import { getCookie, setCookie } from "hono/cookie";
import { sign } from "hono/jwt";
import { aes256gcmkey, decrypt, encrypt } from "@/admin/util/aes256gcm";
import { GlobalCtx } from "@/types";

export const get_jwt_token = (c: GlobalCtx) => {
  const { config } = c.var;
  const key = aes256gcmkey(config.jwt_secret);

  const auth = getCookie(c, "auth");
  if (!auth) return null;

  try {
    return decrypt(auth, key);
  } catch {
    return null;
  }
};

export const set_jwt_token = async (c: GlobalCtx) => {
  const { config } = c.var;
  const key = aes256gcmkey(config.jwt_secret);

  const jwt_token = await sign(
    {
      password_hash: config.password_hash,
      exp: Math.floor(Date.now() / 1000),
    },
    config.jwt_secret,
    "HS256",
  );

  setCookie(c, "auth", encrypt(jwt_token, key), {
    httpOnly: true,
    sameSite: "strict",
    maxAge: 24 * 60 * 60,
  });
};
