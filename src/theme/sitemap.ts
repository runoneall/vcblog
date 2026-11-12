import { SitemapStream, streamToPromise } from "sitemap";
import { Readable } from "stream";
import { StorageTable } from "@/db-schema";
import { GlobalCtx } from "@/types";

export default async (c: GlobalCtx) => {
  const { db, protocol, host } = c.var;

  const result = await db
    .select({
      name: StorageTable.name,
    })
    .from(StorageTable);

  const links = result.map((item) => ({
    url: `/${item.name}`,
    changefreq: "daily",
    priority: 0.8,
  }));

  const stream = new SitemapStream({ hostname: `${protocol}://${host}` });
  const xml = await streamToPromise(Readable.from(links).pipe(stream));

  return c.body(xml.toString(), 200, {
    "Content-Type": "application/xml; charset=utf-8",
  });
};
