import { eq } from "drizzle-orm";
import { raw } from "hono/html";
import { jsxRenderer, useRequestContext } from "hono/jsx-renderer";
import { admin_path } from "@/admin/util/path";
import { StorageTable } from "@/db-schema";
import { GlobalCtx } from "@/types";

export default jsxRenderer(async ({ children, Layout }) => {
  const c: GlobalCtx = useRequestContext();
  const { db, config } = c.var;

  const pages = await db
    .select({
      name: StorageTable.name,
      title: StorageTable.title,
    })
    .from(StorageTable)
    .where(eq(StorageTable.type, "page"));

  return (
    <Layout>
      <meta
        name="viewport"
        content="width=device-width, initial-scale=1.0 maximum-scale=1.0"
      />
      <link
        rel="alternate"
        href="/rss.xml"
        type="application/rss+xml"
        title="RSS"
      />
      <link
        rel="alternate"
        href="/atom.xml"
        type="application/atom+xml"
        title="Atom"
      />

      <title>{config.site_name}</title>

      <div class="drawer md:drawer-open p-3">
        <input type="checkbox" class="drawer-toggle" id="drawer-toggle" />

        <div class="drawer-content md:max-h-fit">
          <div class="navbar mb-3 p-0">
            <label class="mr-2 md:hidden" for="drawer-toggle">
              <svg
                aria-label="Menu"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                class="inline-block h-5 w-5 stroke-current"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </label>

            <div class="navbar-start">
              <a class="link text-2xl md:text-4xl" href="/">
                {config.site_name}
              </a>
            </div>

            <div class="navbar-end">
              <form action="/search" method="get">
                <input
                  class="input"
                  type="text"
                  name="query"
                  placeholder="输入关键词搜索"
                />
              </form>
            </div>
          </div>

          {children}
        </div>

        <div class="drawer-side max-h-fit md:mr-4">
          <label
            for="drawer-toggle"
            aria-label="close sidebar"
            class="drawer-overlay"
          />

          <ul class="menu menu-vertical bg-base-300 md:rounded-box min-h-full w-54 pt-5 pb-8 md:min-h-fit md:bg-inherit">
            {pages.map((page) => (
              <li>
                <a href={"/" + page.name}>{page.title}</a>
              </li>
            ))}

            <li>
              <a href={admin_path()} target="_blank" rel="noopener noreferrer">
                管理员
              </a>
            </li>
          </ul>
        </div>
      </div>

      <style>{raw(config.extra_css)}</style>
      <script>{raw(config.extra_js)}</script>
    </Layout>
  );
});
