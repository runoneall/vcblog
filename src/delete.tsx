import { eq } from "drizzle-orm";
import { FC } from "hono/jsx";
import { useRequestContext } from "hono/jsx-renderer";
import NotFound from "@/NotFound";
import { Context } from "@/types";
import { StorageTable } from "@/types/db";

export default {
  Form: (async () => {
    const c: Context = useRequestContext();
    const { i18n, db, config } = c.var;

    const { name } = c.req.query();
    const result = await db
      .select({
        type: StorageTable.type,
      })
      .from(StorageTable)
      .where(eq(StorageTable.name, name))
      .get();

    if (!result) return <NotFound />;
    const i18n_title = i18n.title.delete[result.type];

    return (
      <>
        <title>
          {i18n_title} | {config.site_name}
        </title>

        <div class="flex justify-center">
          <form action="/delete" method="post">
            <fieldset class="fieldset bg-base-200 border-base-300 rounded-box w-xs border p-4">
              <legend class="fieldset-legend">{i18n_title}</legend>

              <input class="hidden" type="text" name="name" value={name} />

              <button type="submit" class="btn btn-error mt-4">
                {i18n.delete_form.confirm.replaceAll("${name}", name)}
              </button>
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

    if (name)
      await db
        .delete(StorageTable)
        .where(eq(StorageTable.name, name.toString()));

    return c.redirect("/");
  },
};
