import { Next } from "hono";
import { getCookie } from "hono/cookie";
import { Context } from "@/types";
import { aes256gcmkey, decrypt } from "@/util/aes256gcm";
import { hash_eq_hash } from "@/util/password";

export default async (c: Context, next: Next) => {
  const { config } = c.var;
  const key = aes256gcmkey(config.password_hash);

  const authed = (() => {
    const auth_cookie_encrypted = getCookie(c, "auth");
    if (!auth_cookie_encrypted) return false;

    let auth_cookie: string;
    try {
      auth_cookie = decrypt(auth_cookie_encrypted, key);
    } catch {
      return false;
    }

    return hash_eq_hash(auth_cookie, config.password_hash);
  })();

  c.set("authed", authed);
  return await next();
};
