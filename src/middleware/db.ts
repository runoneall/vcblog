import { drizzle } from "drizzle-orm/d1";
import { Next } from "hono";
import { GlobalCtx } from "@/types";

export default async (c: GlobalCtx, next: Next) => {
  c.set("db", drizzle(c.env.db));
  return await next();
};
