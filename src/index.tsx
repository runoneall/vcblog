import { Hono } from "hono";
import Main from "@/Main";
import NotFound from "@/NotFound";
import View from "@/View";
import feed from "@/feed";
import auth from "@/middleware/auth";
import config from "@/middleware/config";
import db from "@/middleware/db";
import i18n from "@/middleware/i18n";
import proxy from "@/middleware/proxy";
import { renderer } from "@/middleware/renderer";
import storage from "@/middleware/storage";
import robots from "@/robots";
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

app.get("/:name{[a-zA-Z0-9_-]+}", (c) => {
  const name = c.req.param("name");
  return c.render(<View name={name} />);
});

app.get("*", (c) => {
  return c.render(<NotFound />);
});

export default app;
