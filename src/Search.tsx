import { like, or, sql } from "drizzle-orm";
import { FC } from "hono/jsx";
import { useRequestContext } from "hono/jsx-renderer";
import NotFound from "@/NotFound";
import { Context } from "@/types";
import { StorageTable } from "@/types/db";

export default (async ({ keyword }) => {
  const c: Context = useRequestContext();
  const { i18n, db, config } = c.var;

  const keyword_sql = `%${keyword}%`;
  const results = await db
    .select({
      name: StorageTable.name,
      title: StorageTable.title,
      preview:
        sql`substr(${StorageTable.content}, 1, ${config.preview_char + 1})`.mapWith(
          String,
        ),
    })
    .from(StorageTable)
    .where(
      or(
        like(StorageTable.name, keyword_sql),
        like(StorageTable.title, keyword_sql),
        like(StorageTable.content, keyword_sql),
      ),
    )
    .orderBy(sql`rowid DESC`)
    .limit(config.post_per_page);

  if (results.length == 0) return <NotFound />;

  return (
    <>
      <title>
        {`${i18n.title.search} ${keyword}`} | {config.site_name}
      </title>

      <ul class="list bg-base-100">
        {results.map((result) => (
          <li class="list-row">
            <a class="text-xl" href={`/${result.name}`}>
              {result.title}
            </a>
            <p class="list-col-wrap">
              {result.preview +
                (result.preview.length > config.preview_char ? "..." : "")}
            </p>
          </li>
        ))}
      </ul>
    </>
  );
}) as FC<{ keyword: string }>;
