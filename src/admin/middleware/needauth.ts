import { Next } from "hono";
import { decode } from "hono/jwt";
import { hash_eq_hash } from "@/admin/util/eq";
import { get_jwt_token, set_jwt_token } from "@/admin/util/jwt";
import { admin_path } from "@/admin/util/path";
import { GlobalCtx } from "@/types";

export default async (c: GlobalCtx, next: Next) => {
  const { config } = c.var;

  const jwt_token = get_jwt_token(c);
  if (!jwt_token) return c.redirect(admin_path("login"));

  const { payload } = decode(jwt_token);
  if (!hash_eq_hash(payload.password_hash as string, config.password_hash))
    return c.redirect(admin_path("login"));

  await set_jwt_token(c);
  return await next();
};
