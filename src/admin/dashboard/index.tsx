import { Hono } from "hono";
import needauth from "@/admin/middleware/needauth";
import { GlobalEnv } from "@/types";

const app = new Hono<GlobalEnv>();
app.use(needauth);

app.get("/", (c) => {
  return c.render(<span>dashboard</span>);
});

export default app;
