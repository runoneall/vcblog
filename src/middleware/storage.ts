import { sql } from "drizzle-orm";
import { Next } from "hono";
import { Context } from "@/types";
import { CreateStorageTable, StorageTable } from "@/types/db";

export default async (c: Context, next: Next) => {
  const { i18n, db } = c.var;

  try {
    await db.select({ type: StorageTable.type }).from(StorageTable).limit(1);
  } catch {
    await db.run(sql.raw(CreateStorageTable));
    await db.insert(StorageTable).values({
      ...i18n.first_post,
      ...{ name: "first-post", type: "post" },
    });
  }

  return await next();
};
