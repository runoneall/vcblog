import { eq, sql } from "drizzle-orm";
import { Feed, serveFeed } from "hono-feed";
import { Context } from "@/types";
import { StorageTable } from "@/types/db";

export default (format: "rss" | "atom") => {
  return async (c: Context) => {
    const { i18n, protocol, host, db, config } = c.var;

    const feed = new Feed({
      title: config.site_name,
      link: `${protocol}://${host}`,
      description: `${config.site_name}${i18n.feed_description}`,
    });

    const articles = await db
      .select({
        name: StorageTable.name,
        title: StorageTable.title,
        preview:
          sql`substr(${StorageTable.content}, 1, ${config.preview_char})`.mapWith(
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
        author: { name: config.site_name },
        link: `${protocol}://${host}/${article.name}`,
        published: new Date(),
        content: article.preview,
      });
    });

    return serveFeed(c, feed, { format });
  };
};
