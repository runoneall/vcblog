import { Context } from "@/types";

export default async (c: Context) => {
  const { protocol, host } = c.var;

  return c.text(`User-agent: *
Sitemap: ${protocol}://${host}/sitemap.xml`);
};
