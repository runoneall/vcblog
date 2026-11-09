import { Hono } from "hono";
import Layout from "@/theme/Layout";
import Main from "@/theme/Main";
import NotFound from "@/theme/NotFound";
import { GlobalEnv } from "@/types";

const app = new Hono<GlobalEnv>();
app.use(Layout);

app.get("/", (c) => c.render(<Main page={1} />));
app.get("/:page{[1-9]+}", (c) =>
  c.render(<Main page={Number(c.req.param("page"))} />),
);

app.get("*", (c) => c.render(<NotFound />));

export default app;
