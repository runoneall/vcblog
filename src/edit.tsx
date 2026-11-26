import { and, eq, ne, or } from "drizzle-orm";
import { FC } from "hono/jsx";
import { useRequestContext } from "hono/jsx-renderer";
import NotFound from "@/NotFound";
import { Context } from "@/types";
import { StorageTable } from "@/types/db";
import form from "@/util/form";

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
          <fieldset class="mx-2 w-auto">
            <legend>{i18n_title}</legend>

            <input
              class="hidden"
              type="text"
              name="old_name"
              value={old_name}
            />

            <label>{i18n.edit_form.name}</label>
            <input type="text" name="name" value={result.name} />

            <label>{i18n.edit_form.type}</label>
            <select class="select" name="type">
              <option value="post" selected={result.type === "post"}>
                {i18n.edit_form.types.post}
              </option>
              <option value="page" selected={result.type === "page"}>
                {i18n.edit_form.types.page}
              </option>
            </select>

            <label>{i18n.edit_form.title}</label>
            <input type="text" name="title" value={result.title} />

            <label>{i18n.edit_form.content}</label>
            <textarea name="content">{result.content}</textarea>

            <button type="submit" class="btn-wide">
              {i18n.edit_form.submit}
            </button>
          </fieldset>
        </form>
      </>
    );
  }) as FC<{}>,

  Submit: async (c: Context) => {
    const { db } = c.var;

    const body = form(await c.req.formData());
    const old_name = body.text("old_name");

    if (!old_name) return c.redirect("/");

    const result = await db
      .select()
      .from(StorageTable)
      .where(eq(StorageTable.name, old_name))
      .get();

    if (!result) return c.redirect(`/edit?name=${old_name}`);

    const name = body.text("name") || result.name;
    const type =
      (body.text("type") || result.type) === "page" ? "page" : "post";
    const title = body.text("title") || result.title;
    const content = body.text("content") || result.content;

    if (
      await db
        .select({
          type: StorageTable.type,
        })
        .from(StorageTable)
        .where(
          and(
            or(eq(StorageTable.name, name), eq(StorageTable.title, title)),
            ne(StorageTable.name, old_name),
          ),
        )
        .get()
    )
      return c.redirect(`/edit?name=${old_name}`);

    await db
      .update(StorageTable)
      .set({ name, type, title, content })
      .where(eq(StorageTable.name, old_name));

    return c.redirect(`/edit?name=${name}`);
  },
};
