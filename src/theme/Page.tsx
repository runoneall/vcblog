import { renderHtml } from "@comark/html";
import { external } from "comark-links";
import { eq } from "drizzle-orm";
import { raw } from "hono/html";
import { FC } from "hono/jsx";
import { useRequestContext } from "hono/jsx-renderer";
import { StorageTable } from "@/db-schema";
import NotFound from "@/theme/NotFound";
import { GlobalCtx } from "@/types";

export default (async ({ name }) => {
  const c: GlobalCtx = useRequestContext();
  const { db, config } = c.var;

  const page = await db
    .select({
      name: StorageTable.name,
      title: StorageTable.title,
      content: StorageTable.content,
    })
    .from(StorageTable)
    .where(eq(StorageTable.name, name))
    .get();

  if (!page) return <NotFound />;

  const forwarded = c.req.header("x-forwarded-host");
  const host =
    typeof forwarded === "string"
      ? forwarded.split(",")[0].trim()
      : new URL(c.req.url).hostname;

  const html = await renderHtml(
    `# [${page.title}](/${page.name})\n\n` + page.content,
    {
      plugins: [
        external({
          target: "_blank",
          rel: ["nofollow", "noreferrer"],
          hosts: [host],
          icon: true,
          label: "",
        }),
      ],
    },
  );

  return (
    <>
      <title>
        {page.title} | {config.site_name}
      </title>
      <article class="prose max-w-none">{raw(html)}</article>
    </>
  );
}) as FC<{ name: string }>;
