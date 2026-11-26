import { Next } from "hono";
import { getCookie, setCookie } from "hono/cookie";
import { Context } from "@/types";
import { aes256gcmkey, decrypt, encrypt } from "@/util/aes256gcm";
import { hash_eq_hash } from "@/util/password";

export const set_auth = (c: Context) => {
  const { config } = c.var;
  const key = aes256gcmkey(config.password_hash);

  setCookie(c, "auth", encrypt(config.password_hash, key), {
    httpOnly: true,
    sameSite: "strict",
    maxAge: 24 * 60 * 60,
  });
};

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
  if (authed) set_auth(c);

  return await next();
};
