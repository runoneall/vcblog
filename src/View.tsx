import { renderHtml } from "@comark/html";
import { ComarkPlugin, Node } from "@comark/html/parse";
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

  const external_icon_svg: ComarkPlugin = {
    name: "external-icon-svg",

    post({ tree }) {
      const visit = (node: Node, parentTag = "") => {
        if (!Array.isArray(node) || node[0] === null) return;

        const [tag, attrs, ...children] = node;
        if (tag === "code" || tag === "pre") return;

        if (
          parentTag === "a" &&
          tag === "span" &&
          String(attrs.class ?? "")
            .split(/\s+/)
            .includes("cl-icon") &&
          attrs["aria-hidden"] === "true" &&
          children.length === 1 &&
          children[0] === "↗"
        ) {
          node[0] = "external-link-icon";
          node.splice(2);
          return;
        }

        for (const child of children) visit(child, tag);
      };

      for (const node of tree.nodes) visit(node);
    },
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

      external_icon_svg,
    ],

    components: {
      "external-link-icon": () =>
        raw(
          <svg
            class="cl-icon inline-block"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width="1em"
            height="1em"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true"
            focusable="false"
          >
            <path d="M15 3h6v6M10 14 21 3" />
            <path d="M21 14v5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5" />
          </svg>,
        ),
    },
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
