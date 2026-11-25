import { eq, or } from "drizzle-orm";
import { FC } from "hono/jsx";
import { useRequestContext } from "hono/jsx-renderer";
import { Context } from "@/types";
import { StorageTable } from "@/types/db";

export default {
  Form: (() => {
    const c: Context = useRequestContext();
    const { i18n, config } = c.var;

    let { type } = c.req.query();
    type = type === "page" ? "page" : "post";
    const i18n_title = i18n.title.create[type as "post" | "page"];

    return (
      <>
        <title>
          {i18n_title} | {config.site_name}
        </title>

        <div class="flex justify-center">
          <form action="/create" method="post">
            <fieldset>
              <legend>{i18n_title}</legend>

              <input class="hidden" type="text" name="type" value={type} />

              <label>{i18n.create_form.name}</label>
              <input class="input" type="text" name="name" required />

              <label>{i18n.create_form.title}</label>
              <input class="input" type="text" name="title" required />

              <button type="submit">{i18n.create_form.submit}</button>
            </fieldset>
          </form>
        </div>
      </>
    );
  }) as FC<{}>,

  Submit: async (c: Context) => {
    const { db } = c.var;

    const body = await c.req.formData();
    const name = body.get("name");
    const type = body.get("type");
    const title = body.get("title");

    if (
      !name ||
      !type ||
      !title ||
      (type.toString() !== "post" && type.toString() !== "page") ||
      (await db
        .select({
          type: StorageTable.type,
        })
        .from(StorageTable)
        .where(
          or(
            eq(StorageTable.name, name.toString()),
            eq(StorageTable.title, title.toString()),
          ),
        )
        .get())
    )
      return c.redirect(`/create?type=default`);

    await db.insert(StorageTable).values({
      name: name.toString(),
      type: type.toString() as "post" | "page",
      title: title.toString(),
      content: "",
    });

    return c.redirect(`/${name}`);
  },
};
