import { eq, sql } from "drizzle-orm";
import { FC } from "hono/jsx";
import { useRequestContext } from "hono/jsx-renderer";
import { StorageTable } from "@/db-schema";
import NotFound from "@/theme/NotFound";
import { GlobalCtx } from "@/types";

export default (async ({ page }) => {
  const c: GlobalCtx = useRequestContext();
  const { db, config } = c.var;

  const total_post = await db.$count(
    StorageTable,
    eq(StorageTable.type, "post"),
  );

  const total_page = Math.ceil(total_post / config.post_per_page);
  if (page > total_page) return <NotFound />;

  const max_preview_char = 250;
  const posts = await db
    .select({
      name: StorageTable.name,
      title: StorageTable.title,
      preview:
        sql`substr(${StorageTable.content}, 1, ${max_preview_char})`.mapWith(
          String,
        ),
    })
    .from(StorageTable)
    .where(eq(StorageTable.type, "post"))
    .orderBy(sql`rowid DESC`)
    .offset((page - 1) * config.post_per_page)
    .limit(config.post_per_page);

  return (
    <>
      <title>
        {page == 1 ? "首页" : `第 ${page} 页`} | {config.site_name}
      </title>

      {posts.map((post) => (
        <>
          <div class="card card-body bg-base-100 p-0">
            <h2 class="card-title">{post.title}</h2>
            <p>
              {post.preview.length > max_preview_char
                ? post.preview + "..."
                : post.preview}
            </p>
            <div class="card-actions justify-end">
              <a class="btn" href={"/" + post.name}>
                继续阅读
              </a>
            </div>
          </div>
          <div class="divider" />
        </>
      ))}

      <div class="join mb-6 flex justify-center font-mono">
        {(() => {
          const max = 9;

          if (total_page <= max) {
            return Array.from({ length: total_page }, (_, i) => i + 1).map(
              (p) => (
                <a
                  class="join-item btn btn-square"
                  href={"/" + p}
                  aria-disabled={p === page ? "true" : "false"}
                >
                  {p}
                </a>
              ),
            );
          }

          const inner_max = max - 4;
          let start = page - Math.floor(inner_max / 2);
          let end = start + inner_max - 1;

          if (start < 2) {
            start = 2;
            end = start + inner_max - 1;
          }

          if (end > total_page - 1) {
            end = total_page - 1;
            start = end - inner_max + 1;
          }

          const links: Array<number | "..."> = [];
          links.push(1);
          if (start > 2) links.push("...");
          for (let i = start; i <= end; i++) links.push(i);
          if (end < total_page - 1) links.push("...");
          links.push(total_page);

          return links.map((link) =>
            link === "..." ? (
              <button class="join-item btn btn-square btn-disabled" disabled>
                …
              </button>
            ) : link === page ? (
              <span
                class="join-item btn btn-square btn-active"
                aria-current="page"
              >
                {link}
              </span>
            ) : (
              <a class="join-item btn btn-square" href={"/" + link}>
                {link}
              </a>
            ),
          );
        })()}
      </div>
    </>
  );
}) as FC<{ page: number }>;
