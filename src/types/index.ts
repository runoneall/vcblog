import { Context as HonoContext } from "hono";
import { UseAuth } from "@/types/auth";
import { UseConfig } from "@/types/config";
import { D1Binding, UseDB } from "@/types/db";
import { UseI18n } from "@/types/i18n";
import { UseProxy } from "@/types/proxy";

export type Environment = {
  Bindings: D1Binding;
  Variables: UseI18n & UseProxy & UseDB & UseConfig & UseAuth;
};

export type Context = HonoContext<Environment>;
