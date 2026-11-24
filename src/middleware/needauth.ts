import { Next } from "hono";
import { Context } from "@/types";

export default async (c: Context, next: Next) => {
  return c.var.authed ? await next() : c.redirect("/login");
};
