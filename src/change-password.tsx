import { FC } from "hono/jsx";
import { useRequestContext } from "hono/jsx-renderer";
import { Context } from "@/types";
import { ConfigTable } from "@/types/db";
import { password_to_hash } from "@/util/password";

export default {
  Form: (() => {
    const c: Context = useRequestContext();
    const { i18n, config } = c.var;

    return (
      <>
        <title>
          {i18n.title.change_password} | {config.site_name}
        </title>

        <div class="flex justify-center">
          <form action="/change-password" method="post">
            <fieldset>
              <legend>{i18n.title.change_password}</legend>

              <label>{i18n.change_password_form.new_password}</label>

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

                <input type="password" name="new-password" required />
              </label>

              <button type="submit">{i18n.change_password_form.submit}</button>
            </fieldset>
          </form>
        </div>
      </>
    );
  }) as FC<{}>,

  Submit: async (c: Context) => {
    const { db } = c.var;

    const body = await c.req.formData();
    const new_password = body.get("new-password");

    if (!new_password || new_password.toString() === "")
      return c.redirect("/change-password");

    await db
      .update(ConfigTable)
      .set({ password_hash: password_to_hash(new_password.toString()) });

    return c.redirect("/login");
  },
};
