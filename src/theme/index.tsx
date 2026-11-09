import { Hono } from "hono";
import { GlobalEnv } from "@/types";

const app = new Hono<GlobalEnv>();

app.get("/", (c) => {
  return c.render(<h1>Hello VCBlog!</h1>);
});

export default app;
