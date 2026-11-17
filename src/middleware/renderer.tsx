import { eq } from "drizzle-orm";
import { jsxRenderer, useRequestContext } from "hono/jsx-renderer";
import { Link, ViteClient } from "vite-ssr-components/hono";
import { Context } from "@/types";
import { StorageTable } from "@/types/db";

export const renderer = jsxRenderer(async ({ children }) => {
  const c: Context = useRequestContext();
  const { i18n, db, config } = c.var;

  const pages = await db
    .select({
      name: StorageTable.name,
      title: StorageTable.title,
    })
    .from(StorageTable)
    .where(eq(StorageTable.type, "page"));

  return (
    <html>
      <head>
        <meta http-equiv="Content-Type" content="text/html;charset=UTF-8" />
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
        <ViteClient />
        <Link href="/src/style.css" rel="stylesheet" />
      </head>
      <body>
        <div class="navbar bg-base-100 shadow-sm">
          <div class="flex-none md:hidden">
            <label
              for="drawer-toggle"
              class="btn btn-square btn-ghost drawer-button"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                class="inline-block h-6 w-6 stroke-current"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </label>
          </div>

          <div class="flex-1">
            <a class="btn btn-ghost text-xl" href="/">
              {config.site_name}
            </a>
          </div>

          <div class="flex-none">
            <form action="/search" method="get">
              <input
                class="input"
                type="text"
                name="keyword"
                placeholder={i18n.search_input_placeholder}
              />
            </form>
          </div>
        </div>

        <div class="drawer md:drawer-open">
          <input class="drawer-toggle" type="checkbox" id="drawer-toggle" />

          <div class="drawer-content md:max-h-fit">{children}</div>

          <div class="drawer-side md:max-h-fit">
            <label for="drawer-toggle" class="drawer-overlay" />

            <ul class="menu bg-base-200 min-h-full w-54 p-4 md:min-h-fit md:bg-inherit">
              {pages.map((page) => (
                <li>
                  <a href={`/${page.name}`}>{page.title}</a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </body>
    </html>
  );
});
