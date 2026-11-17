import { sql } from "drizzle-orm";
import { Next } from "hono";
import { Context } from "@/types";
import { UseConfig } from "@/types/config";
import { ConfigTable, CreateConfigTable } from "@/types/db";
import { password_to_hash } from "@/util/password";

export default async (c: Context, next: Next) => {
  const { i18n, db } = c.var;

  try {
    const config_in_db = await db.select().from(ConfigTable).get();
    if (!config_in_db) throw null;
    c.set("config", config_in_db);
  } catch {
    await db.run(sql.raw(CreateConfigTable));

    const default_config: UseConfig["config"] = {
      site_name: i18n.default_site_name,
      post_per_page: 10,
      preview_char: 200,
      extra_css: "",
      extra_js: "",
      password_hash: password_to_hash("admin@123"),
    };

    await db.insert(ConfigTable).values(default_config);
    c.set("config", default_config);
  }

  return await next();
};
