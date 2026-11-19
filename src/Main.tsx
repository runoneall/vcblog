import { eq, sql } from "drizzle-orm";
import { FC } from "hono/jsx";
import { useRequestContext } from "hono/jsx-renderer";
import NotFound from "@/NotFound";
import { Context } from "@/types";
import { StorageTable } from "@/types/db";

export default (async ({ page }) => {
  const c: Context = useRequestContext();
  const { i18n, db, config } = c.var;

  const total_page = Math.ceil(
    (await db.$count(StorageTable, eq(StorageTable.type, "post"))) /
      config.post_per_page,
  );

  const posts = await db
    .select({
      name: StorageTable.name,
      title: StorageTable.title,
      preview:
        sql`substr(${StorageTable.content}, 1, ${config.preview_char + 1})`.mapWith(
          String,
        ),
    })
    .from(StorageTable)
    .where(eq(StorageTable.type, "post"))
    .orderBy(sql`rowid DESC`)
    .offset((page - 1) * config.post_per_page)
    .limit(config.post_per_page);

  if (posts.length == 0) return <NotFound />;

  return (
    <>
      {page == 1 ? (
        <title>{config.site_name}</title>
      ) : (
        <title>
          {i18n.title.main.replaceAll("${page}", String(page))} |{" "}
          {config.site_name}
        </title>
      )}

      <ul class="list bg-base-100 rounded-box shadow-md">
        {posts.map((post) => (
          <li class="list-row">
            <div>
              <a href={`/${post.name}`}>{post.title}</a>
            </div>
            <p class="list-col-wrap text-xs">
              {post.preview +
                (post.preview.length > config.preview_char ? "..." : "")}
            </p>
          </li>
        ))}
      </ul>

      <div class="join my-6 flex justify-center font-mono">
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
