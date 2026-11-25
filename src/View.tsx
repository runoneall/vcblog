import { renderHtml } from "@comark/html";
import { external } from "comark-links";
import { eq } from "drizzle-orm";
import { raw } from "hono/html";
import { FC } from "hono/jsx";
import { useRequestContext } from "hono/jsx-renderer";
import NotFound from "@/NotFound";
import { Context } from "@/types";
import { StorageTable } from "@/types/db";

export default (async ({ name }) => {
  const c: Context = useRequestContext();
  const { i18n, host, db, config, authed } = c.var;

  const result = await db
    .select()
    .from(StorageTable)
    .where(eq(StorageTable.name, name))
    .get();

  if (!result) return <NotFound />;

  const html = await renderHtml(result.content, {
    plugins: [
      external({
        target: "_blank",
        rel: ["nofollow", "noreferrer"],
        hosts: [host],
        icon: true,
        label: "",
      }),
    ],
  });

  return (
    <>
      <title>
        {result.title} | {config.site_name}
      </title>

      <div class="card bg-base-100 rounded-none">
        <div class="card-body">
          <h2 class="card-title">{result.title}</h2>
          <div class="prose max-w-none">{raw(html)}</div>

          {authed && (
            <div class="card-actions justify-end">
              <a
                class="btn btn-link btn-error"
                href={`/delete?name=${result.name}`}
              >
                {i18n.title.delete[result.type]}
              </a>
            </div>
          )}
        </div>
      </div>
    </>
  );
}) as FC<{ name: string }>;
