import { Hono } from "hono";
import Main from "@/Main";
import NotFound from "@/NotFound";
import Search from "@/Search";
import View from "@/View";
import change_password from "@/change-password";
import create from "@/create";
import _delete from "@/delete";
import feed from "@/feed";
import login from "@/login";
import auth from "@/middleware/auth";
import config from "@/middleware/config";
import db from "@/middleware/db";
import i18n from "@/middleware/i18n";
import needauth from "@/middleware/needauth";
import proxy from "@/middleware/proxy";
import { renderer } from "@/middleware/renderer";
import storage from "@/middleware/storage";
import robots from "@/robots";
import settings from "@/settings";
import sitemap from "@/sitemap";
import { Environment } from "@/types";

const app = new Hono<Environment>();
app.use(i18n);
app.use(proxy);
app.use(db);
app.use(config);
app.use(storage);
app.use(auth);
app.use(renderer);

app.get("/robots.txt", robots);
app.get("/sitemap.xml", sitemap);
app.get("/rss.xml", feed("rss"));
app.get("/atom.xml", feed("atom"));

app.get("/:page{[1-9]+}?", (c) => {
  const page = Number(c.req.param("page")) || 1;
  return c.render(<Main page={page} />);
});

app.get("/search", (c) => {
  const keyword = c.req.query("keyword");
  return !keyword || keyword == "" || keyword.includes("%")
    ? c.render(<NotFound />)
    : c.render(<Search keyword={keyword} />);
});

app
  .get("/login", (c) => {
    return c.render(<login.Form />);
  })
  .post(login.Submit);

app
  .get("/change-password", needauth, (c) => {
    return c.render(<change_password.Form />);
  })
  .post(needauth, change_password.Submit);

app
  .get("/settings", needauth, (c) => {
    return c.render(<settings.Form />);
  })
  .post(needauth, settings.Submit);

app
  .get("/create", needauth, (c) => {
    const type = c.req.query("type");
    return type ? c.render(<create.Form />) : c.redirect("/");
  })
  .post(needauth, create.Submit);

app
  .get("/delete", needauth, (c) => {
    const name = c.req.query("name");
    return name ? c.render(<_delete.Form />) : c.redirect("/");
  })
  .post(needauth, _delete.Submit);

app.get("/:name{[a-zA-Z0-9_-]+}", (c) => {
  const name = c.req.param("name");
  return c.render(<View name={name} />);
});

app.get("*", (c) => {
  return c.render(<NotFound />);
});

export default app;
