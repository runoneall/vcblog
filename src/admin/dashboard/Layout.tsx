import { jsxRenderer, useRequestContext } from "hono/jsx-renderer";
import { dashboard_title } from "@/admin/dashboard/util/title";
import { GlobalCtx } from "@/types";

export default jsxRenderer(async ({ children, Layout }) => {
  const c: GlobalCtx = useRequestContext();

  return (
    <Layout>
      <title>
        {dashboard_title()} | {c.var.config.site_name}
      </title>

      {children}
    </Layout>
  );
});
