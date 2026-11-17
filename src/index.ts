import { Hono } from "hono";
import { html } from "hono/html";
import { renderer } from "@/middleware/renderer";

const app = new Hono();
app.use(renderer);

app.get("/", (c) => {
  return c.render(html``);
});

export default app;
