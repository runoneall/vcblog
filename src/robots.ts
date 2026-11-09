import { GlobalCtx } from "@/types";

export default async (c: GlobalCtx) => {
  const { host } = c.var;
  const protocol = new URL(c.req.url).protocol;

  return c.text(`User-agent: *
Disallow: /admin/
Allow: /
Sitemap: ${protocol}//${host}/sitemap.xml`);
};
