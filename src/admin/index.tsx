import { Hono } from "hono";
import { GlobalEnv } from "@/types";

const app = new Hono<GlobalEnv>();

export default app;
