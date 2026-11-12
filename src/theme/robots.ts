import { admin_path } from "@/admin/util/path";
import { GlobalCtx } from "@/types";

export default async (c: GlobalCtx) => {
  const { protocol, host } = c.var;

  return c.text(`User-agent: *
Disallow: ${admin_path()}/
Allow: /
Sitemap: ${protocol}://${host}/sitemap.xml`);
};
