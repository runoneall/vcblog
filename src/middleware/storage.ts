import { sql } from "drizzle-orm";
import { Next } from "hono";
import { CreateStorageTable, StorageTable } from "@/db-schema";
import { GlobalCtx } from "@/types";

export default async (c: GlobalCtx, next: Next) => {
  try {
    await c.var.db.select().from(StorageTable).get();
  } catch {
    await c.var.db.run(sql.raw(CreateStorageTable));
  }

  return await next();
};
