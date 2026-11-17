import { drizzle } from "drizzle-orm/d1";
import { Next } from "hono";
import { Context } from "@/types";

export default async (c: Context, next: Next) => {
  c.set("db", drizzle(c.env.db));
  return await next();
};
