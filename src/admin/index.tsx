import { Hono } from "hono";
import dashboard from "@/admin/dashboard";
import needauth from "@/admin/middleware/needauth";
import { password_eq_hash } from "@/admin/util/eq";
import { set_jwt_token } from "@/admin/util/jwt";
import {
  admin_dashboard_path,
  admin_path,
  dashboard_path,
} from "@/admin/util/path";
import { GlobalEnv } from "@/types";

const app = new Hono<GlobalEnv>();
app.route(dashboard_path(), dashboard);

app.get("/", needauth, (c) => {
  return c.redirect(admin_dashboard_path());
});

app.get("/login", (c) => {
  return c.render(
    <>
      <title>管理员登录 | {c.var.config.site_name}</title>

      <div class="flex h-dvh w-dvw items-center justify-center">
        <form action={admin_path("login")} method="post">
          <fieldset class="fieldset bg-base-200 border-base-300 rounded-box w-xs border p-4">
            <legend class="fieldset-legend">
              登录至 {c.var.config.site_name}
            </legend>

            <label class="label">密码</label>
            <input type="password" class="input" name="password" />

            <button type="submit" class="btn btn-neutral mt-4">
              登录
            </button>
          </fieldset>
        </form>
      </div>
    </>,
  );
});

app.post("/login", async (c) => {
  const body = await c.req.parseBody();
  const password = body["password"];

  if (typeof password != "string") {
    return c.redirect(admin_path("login"));
  }

  if (!password_eq_hash(password, c.var.config.password_hash))
    return c.redirect(admin_path("login"));

  await set_jwt_token(c);
  return c.redirect(admin_dashboard_path());
});

export default app;
