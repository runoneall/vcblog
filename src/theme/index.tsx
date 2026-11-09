import { Hono } from "hono";
import Layout from "@/theme/Layout";
import { GlobalEnv } from "@/types";

const app = new Hono<GlobalEnv>();
app.use(Layout);

app.get("/", (c) => {
  return c.render(<h1>Hello VCBlog!</h1>);
});

export default app;
