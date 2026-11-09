import { Next } from "hono";
import { GlobalCtx } from "@/types";

export default async (c: GlobalCtx, next: Next) => {
  const forwarded = c.req.header("x-forwarded-host");
  c.set(
    "host",
    typeof forwarded === "string"
      ? forwarded.split(",")[0].trim()
      : new URL(c.req.url).hostname,
  );

  return await next();
};
