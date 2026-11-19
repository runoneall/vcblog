import { FC } from "hono/jsx";
import { useRequestContext } from "hono/jsx-renderer";
import { Context } from "@/types";

export default (() => {
  const c: Context = useRequestContext();
  const { i18n, config } = c.var;

  c.status(404);

  return (
    <>
      <title>
        {i18n.title.not_found} | {config.site_name}
      </title>

      <img class="h-auto w-full" src="https://http.cat/images/404.jpg" />
    </>
  );
}) as FC<{}>;
