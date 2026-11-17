import { Hono } from "hono";
import { html } from "hono/html";
import feed from "@/feed";
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
app.use(renderer);

app.get("/robots.txt", robots);
app.get("/sitemap.xml", sitemap);
app.get("/rss.xml", feed("rss"));
app.get("/atom.xml", feed("atom"));

app.get("/", (c) => {
  return c.render(html``);
});

export default app;
