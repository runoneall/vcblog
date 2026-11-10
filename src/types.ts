import { D1Database } from "@cloudflare/workers-types";
import { DrizzleD1Database } from "drizzle-orm/d1";
import { Context } from "hono";

export type D1Binding = {
  db: D1Database;
};

export type UseDB = {
  db: DrizzleD1Database;
};

export type UseConfig = {
  config: {
    site_name: string;
    post_per_page: number;
    extra_css: string;
    extra_js: string;

    password_hash: string;
    jwt_secret: string;
  };
};

export type UseProxy = {
  host: string;
  protocol: string;
};

export type GlobalEnv = {
  Bindings: D1Binding;
  Variables: UseDB & UseConfig & UseProxy;
};

export type GlobalCtx = Context<GlobalEnv>;
