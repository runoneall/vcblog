import { eq, sql } from "drizzle-orm";
import { Feed, serveFeed } from "hono-feed";
import { StorageTable } from "@/db-schema";
import { GlobalCtx } from "@/types";

export default (format: "rss" | "atom") => {
  return async (c: GlobalCtx) => {
    const { db, config, host } = c.var;
    const protocol = new URL(c.req.url).protocol;

    const feed = new Feed({
      title: config.site_name,
      link: `${protocol}//${host}`,
      description: "latest articles",
    });

    const max_preview_char = 200;
    const articles = await db
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
      .limit(config.post_per_page);

    articles.forEach((article) => {
      feed.addItem({
        title: article.title,
        link: `${protocol}//${host}/${article.name}`,
        published: new Date(),
        content: article.preview,
      });
    });

    return serveFeed(c, feed, { format });
  };
};
