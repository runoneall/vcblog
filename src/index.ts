import { Hono } from "hono";
import admin from "@/admin";
import { admin_path } from "@/admin/util/path";
import config from "@/middleware/config";
import db from "@/middleware/db";
import storage from "@/middleware/storage";
import { renderer } from "@/renderer";
import theme from "@/theme";
import { GlobalEnv } from "@/types";

const app = new Hono<GlobalEnv>();
app.use(db);
app.use(config);
app.use(storage);
app.use(renderer);

app.route(admin_path(), admin);
app.route("/", theme);

export default app;
