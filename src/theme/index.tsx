import { Hono } from "hono";
import Layout from "@/theme/Layout";
import Main from "@/theme/Main";
import NotFound from "@/theme/NotFound";
import Page from "@/theme/Page";
import Search from "@/theme/Search";
import { GlobalEnv } from "@/types";

const app = new Hono<GlobalEnv>();
app.use(Layout);

app.get("/", (c) => {
  return c.render(<Main page={1} />);
});

app.get("/:page{[1-9]+}", (c) => {
  return c.render(<Main page={Number(c.req.param("page"))} />);
});

app.get("/search", (c) => {
  return c.render(<Search query={c.req.query("query")} />);
});

app.get("/:name{[0-9a-zA-Z_-]+}", (c) => {
  return c.render(<Page name={c.req.param("name")} />);
});

app.get("*", (c) => {
  return c.render(<NotFound />);
});

export default app;
