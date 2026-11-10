import { Next } from "hono";
import { GlobalCtx } from "@/types";

export default async (c: GlobalCtx, next: Next) => {
  const forwarded_host = c.req.header("x-forwarded-host");
  c.set(
    "host",
    typeof forwarded_host === "string"
      ? forwarded_host.split(",")[0].trim()
      : new URL(c.req.url).hostname,
  );

  const forwarded_proto = c.req.header("x-forwarded-proto");
  c.set(
    "protocol",
    typeof forwarded_proto === "string"
      ? forwarded_proto.split(",")[0].trim()
      : new URL(c.req.url).protocol.replace(":", ""),
  );

  return await next();
};
