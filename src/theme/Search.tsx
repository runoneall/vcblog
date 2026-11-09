import { like, or, sql } from "drizzle-orm";
import { FC } from "hono/jsx";
import { useRequestContext } from "hono/jsx-renderer";
import { StorageTable } from "@/db-schema";
import NotFound from "@/theme/NotFound";
import { GlobalCtx } from "@/types";

export default (async ({ query }) => {
  const c: GlobalCtx = useRequestContext();
  const { db, config } = c.var;

  if (!query || query.includes("%")) return <NotFound />;
  const query_sql = "%" + query + "%";

  const max_preview_char = 200;
  const results = await db
    .select({
      name: StorageTable.name,
      title: StorageTable.title,
      preview:
        sql`substr(${StorageTable.content}, 1, ${max_preview_char})`.mapWith(
          String,
        ),
    })
    .from(StorageTable)
    .where(
      or(
        like(StorageTable.name, query_sql),
        like(StorageTable.title, query_sql),
        like(StorageTable.content, query_sql),
      ),
    )
    .orderBy(sql`rowid DESC`)
    .limit(config.post_per_page * 2);

  if (results.length == 0) {
    return (
      <>
        <title>无结果 | {config.site_name}</title>
        <div role="alert" class="alert alert-error alert-soft">
          <span>未找到有关 {query} 的条目</span>
        </div>
      </>
    );
  }

  return (
    <>
      <title>
        搜索 {query} | {config.site_name}
      </title>

      <div role="alert" class="alert alert-info alert-soft">
        <span>找到了 {results.length} 条结果</span>
      </div>

      {results.map((result) => (
        <>
          <div class="divider" />
          <div class="card card-body bg-base-100 p-0">
            <h2 class="card-title">{result.title}</h2>
            <p>
              {result.preview.length > max_preview_char
                ? result.preview + "..."
                : result.preview}
            </p>
            <div class="card-actions justify-end">
              <a class="btn" href={"/" + result.name}>
                继续阅读
              </a>
            </div>
          </div>
        </>
      ))}

      <div class="mb-6" />
    </>
  );
}) as FC<{ query: string | undefined }>;
