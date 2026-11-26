import { FC } from "hono/jsx";
import { useRequestContext } from "hono/jsx-renderer";
import { Context } from "@/types";
import { ConfigTable } from "@/types/db";
import form from "@/util/form";

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

    const body = form(await c.req.formData());
    const site_name = body.text("site_name") || config.site_name;
    const extra_css = body.text("extra_css") || "";
    const extra_js = body.text("extra_js") || "";

    let post_per_page = Math.trunc(
      body.number("post_per_page") || config.post_per_page,
    );

    let preview_char = Math.trunc(
      body.number("preview_char") || config.preview_char,
    );

    if (post_per_page <= 0) post_per_page = config.post_per_page;
    if (preview_char <= 0) preview_char = config.preview_char;

    await db
      .update(ConfigTable)
      .set({ site_name, post_per_page, preview_char, extra_css, extra_js });

    return c.redirect("/settings");
  },
};
