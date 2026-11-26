import { FC } from "hono/jsx";
import { useRequestContext } from "hono/jsx-renderer";
import { set_auth } from "@/middleware/auth";
import { Context } from "@/types";
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

        <div class="flex-center">
          <form action="/login" method="post">
            <fieldset>
              <legend>{i18n.title.login}</legend>

              <label class="input">
                <svg
                  class="h-[1em] opacity-50"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                >
                  <g
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    stroke-width="2.5"
                    fill="none"
                    stroke="currentColor"
                  >
                    <path d="M2.586 17.414A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.172a2 2 0 0 0 1.414-.586l.814-.814a6.5 6.5 0 1 0-4-4z" />
                    <circle cx="16.5" cy="7.5" r=".5" fill="currentColor" />
                  </g>
                </svg>

                <input
                  type="password"
                  name="password"
                  placeholder={i18n.login_form.password}
                  required
                />
              </label>

              <button type="submit">{i18n.login_form.submit}</button>
            </fieldset>
          </form>
        </div>
      </>
    );
  }) as FC<{}>,

  Submit: async (c: Context) => {
    const { config } = c.var;

    const body = await c.req.formData();
    const password = body.get("password");

    if (
      !password ||
      !password_eq_hash(password.toString(), config.password_hash)
    )
      return c.redirect("/login");

    set_auth(c);
    return c.redirect("/");
  },
};
