import { and, eq, ne, or } from "drizzle-orm";
import { FC } from "hono/jsx";
import { useRequestContext } from "hono/jsx-renderer";
import NotFound from "@/NotFound";
import { Context } from "@/types";
import { StorageTable } from "@/types/db";

export default {
  Form: (async () => {
    const c: Context = useRequestContext();
    const { i18n, db, config } = c.var;

    const { name: old_name } = c.req.query();
    const result = await db
      .select()
      .from(StorageTable)
      .where(eq(StorageTable.name, old_name))
      .get();

    if (!result) return <NotFound />;
    const i18n_title = i18n.title.edit[result.type];

    return (
      <>
        <title>
          {i18n_title} | {config.site_name}
        </title>

        <form action="/edit" method="post">
          <fieldset class="fieldset bg-base-200 border-base-300 rounded-box mx-2 border p-4">
            <legend class="fieldset-legend">{i18n_title}</legend>

            <input
              class="hidden"
              type="text"
              name="old_name"
              value={old_name}
            />

            <label class="label">{i18n.edit_form.name}</label>
            <input type="text" class="input" name="name" value={result.name} />

            <label class="label">{i18n.edit_form.type}</label>
            <select class="select" name="type">
              <option value="post" selected={result.type === "post"}>
                {i18n.edit_form.types.post}
              </option>
              <option value="page" selected={result.type === "page"}>
                {i18n.edit_form.types.page}
              </option>
            </select>

            <label class="label">{i18n.edit_form.title}</label>
            <input
              type="text"
              class="input"
              name="title"
              value={result.title}
            />

            <label class="label">{i18n.edit_form.content}</label>
            <textarea
              class="textarea field-sizing-content w-full font-mono"
              name="content"
            >
              {result.content}
            </textarea>

            <button type="submit" class="btn btn-neutral btn-wide mt-4">
              {i18n.edit_form.submit}
            </button>
          </fieldset>
        </form>
      </>
    );
  }) as FC<{}>,

  Submit: async (c: Context) => {
    const { db } = c.var;

    const body = await c.req.formData();
    const old_name = body.get("old_name");

    if (!old_name) return c.redirect("/");

    const result = await db
      .select()
      .from(StorageTable)
      .where(eq(StorageTable.name, old_name.toString()))
      .get();

    if (!result) return c.redirect(`/edit?name=${old_name.toString()}`);

    const form = {
      name: body.get("name")?.toString() || result.name,
      type: (body.get("type")?.toString() || result.type) as typeof result.type,
      title: body.get("title")?.toString() || result.title,
      content: body.get("content")?.toString() || result.content,
    };

    if (form.type !== "page") form.type = "post";

    if (
      await db
        .select({
          type: StorageTable.type,
        })
        .from(StorageTable)
        .where(
          and(
            or(
              eq(StorageTable.name, form.name),
              eq(StorageTable.title, form.title),
            ),
            ne(StorageTable.name, old_name.toString()),
          ),
        )
        .get()
    )
      return c.redirect(`/edit?name=${old_name.toString()}`);

    await db
      .update(StorageTable)
      .set(form)
      .where(eq(StorageTable.name, old_name.toString()));

    return c.redirect(`/edit?name=${form.name}`);
  },
};
