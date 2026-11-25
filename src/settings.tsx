import { FC } from "hono/jsx";
import { useRequestContext } from "hono/jsx-renderer";
import { Context } from "@/types";
import { ConfigTable } from "@/types/db";

export default {
  Form: (() => {
    const c: Context = useRequestContext();
    const { i18n, config } = c.var;

    return (
      <>
        <title>
          {i18n.title.settings} | {config.site_name}
        </title>

        <form action="/settings" method="post">
          <fieldset class="mx-2 w-auto">
            <legend>{i18n.title.settings}</legend>

            <label>{i18n.settings_form.site_name}</label>
            <input type="text" name="site_name" value={config.site_name} />

            <label>{i18n.settings_form.post_per_page}</label>
            <input
              type="number"
              name="post_per_page"
              value={config.post_per_page}
            />

            <label>{i18n.settings_form.preview_char}</label>
            <input
              type="number"
              name="preview_char"
              value={config.preview_char}
            />

            <label>{i18n.settings_form.extra_css}</label>
            <textarea name="extra_css">{config.extra_css}</textarea>

            <label>{i18n.settings_form.extra_js}</label>
            <textarea name="extra_js">{config.extra_js}</textarea>

            <button type="submit" class="btn-wide">
              {i18n.settings_form.submit}
            </button>
          </fieldset>
        </form>
      </>
    );
  }) as FC<{}>,

  Submit: async (c: Context) => {
    const { db, config } = c.var;

    const body = await c.req.formData();
    const form = {
      site_name: body.get("site_name")?.toString() || config.site_name,

      post_per_page: Math.trunc(
        Number(body.get("post_per_page")?.toString()) || config.post_per_page,
      ),

      preview_char: Math.trunc(
        Number(body.get("preview_char")?.toString()) || config.preview_char,
      ),

      extra_css: body.get("extra_css")?.toString() || "",
      extra_js: body.get("extra_js")?.toString() || "",
    };

    if (form.post_per_page <= 0) form.post_per_page = config.post_per_page;
    if (form.preview_char <= 0) form.preview_char = config.preview_char;

    await db.update(ConfigTable).set(form);
    return c.redirect("/settings");
  },
};
