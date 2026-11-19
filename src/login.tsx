import { setCookie } from "hono/cookie";
import { FC } from "hono/jsx";
import { useRequestContext } from "hono/jsx-renderer";
import { Context } from "@/types";
import { aes256gcmkey, encrypt } from "@/util/aes256gcm";
import { password_eq_hash } from "@/util/password";

export default {
  Form: (() => {
    const c: Context = useRequestContext();
    const { i18n, config } = c.var;

    return (
      <>
        <title>
          {i18n.title.login} | {config.site_name}
        </title>

        <div class="flex justify-center">
          <form action="/login" method="post">
            <fieldset class="fieldset bg-base-200 border-base-300 rounded-box w-xs border p-4">
              <legend class="fieldset-legend">{i18n.title.login}</legend>

              <label class="label">{i18n.login_form.password}</label>
              <input type="password" class="input" name="password" />

              <button type="submit" class="btn btn-neutral mt-4">
                {i18n.login_form.submit}
              </button>
            </fieldset>
          </form>
        </div>
      </>
    );
  }) as FC<{}>,

  Submit: async (c: Context) => {
    const { config } = c.var;
    const key = aes256gcmkey(config.password_hash);

    const body = await c.req.formData();
    const password = body.get("password");

    if (
      !password ||
      !password_eq_hash(password.toString(), config.password_hash)
    )
      return c.redirect("/login");

    const auth_cookie_encrypted = encrypt(config.password_hash, key);
    setCookie(c, "auth", auth_cookie_encrypted, {
      httpOnly: true,
      sameSite: "strict",
      maxAge: 24 * 60 * 60,
    });

    return c.redirect("/");
  },
};
