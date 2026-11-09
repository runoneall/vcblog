import { useRequestContext } from "hono/jsx-renderer";
import { GlobalCtx } from "@/types";

export default async () => {
  const c: GlobalCtx = useRequestContext();
  const { config } = c.var;

  return (
    <>
      <title>未找到 | {config.site_name}</title>
      <img
        class="h-auto w-full lg:w-8/12"
        src="https://http.cat/images/404.jpg"
        alt="httpcat 404 image"
      />
    </>
  );
};
