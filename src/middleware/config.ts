import { sql } from "drizzle-orm";
import { Next } from "hono";
import { ConfigTable, ConfigTableSQL } from "@/db-schema";
import { GlobalCtx, UseConfig } from "@/types";
import { random_jwt_secret } from "@/util/jwt";
import { password_to_hash } from "@/util/password";

export default async (c: GlobalCtx, next: Next) => {
  try {
    const config_in_db = await c.var.db.select().from(ConfigTable).get();
    if (!config_in_db) throw null;
    c.set("config", config_in_db);
  } catch {
    await c.var.db.run(sql.raw(ConfigTableSQL));

    const default_config: UseConfig["config"] = {
      site_name: "My Blog",
      post_per_page: 10,
      extra_css: "",
      extra_js: "",

      password_hash: password_to_hash("admin@123"),
      jwt_secret: random_jwt_secret(),
    };

    await c.var.db.insert(ConfigTable).values(default_config);
    c.set("config", default_config);
  }

  return await next();
};
