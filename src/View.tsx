import { renderHtml } from "@comark/html";
import rangi, { RangiToken } from "@comark/html/plugins/rangi";
import { external } from "comark-links";
import { eq } from "drizzle-orm";
import { raw } from "hono/html";
import { FC } from "hono/jsx";
import { useRequestContext } from "hono/jsx-renderer";
import { githubDark, githubLight } from "rangi/themes";
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

  const adaptive_color = (light: string, dark: string) =>
    `light-dark(${light}, ${dark})`;

  const github = {
    ...githubLight,
    name: "github",
    bg: adaptive_color(githubLight.bg, githubDark.bg),
    fg: adaptive_color(githubLight.fg, githubDark.fg),
    tokens: Object.fromEntries(
      Object.entries(githubLight.tokens).map(([token, color]) => [
        token,
        adaptive_color(
          color,
          githubDark.tokens[token as RangiToken] ?? githubDark.fg,
        ),
      ]),
    ),
  };

  const html = await renderHtml(result.content, {
    plugins: [
      rangi({ theme: github, preStyles: true }),
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
                class="btn btn-link btn-warning"
                href={`/edit?name=${result.name}`}
              >
                {i18n.title.edit[result.type]}
              </a>
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
