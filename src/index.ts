import { Hono } from "hono";
import admin from "@/admin";
import { admin_path } from "@/admin/util/path";
import feed from "@/feed";
import config from "@/middleware/config";
import db from "@/middleware/db";
import proxy from "@/middleware/proxy";
import storage from "@/middleware/storage";
import { renderer } from "@/renderer";
import robots from "@/robots";
import sitemap from "@/sitemap";
import theme from "@/theme";
import { GlobalEnv } from "@/types";

const app = new Hono<GlobalEnv>();
app.use(db);
app.use(config);
app.use(storage);
app.use(proxy);
app.use(renderer);

app.route(admin_path(), admin);
app.get("/robots.txt", robots);
app.get("/rss.xml", feed("rss"));
app.get("/atom.xml", feed("atom"));
app.get("/sitemap.xml", sitemap);
app.route("/", theme);

export default app;
