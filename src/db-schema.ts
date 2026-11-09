import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const ConfigTable = sqliteTable("config", {
  id: integer()
    .notNull()
    .primaryKey()
    .$default(() => 1),

  site_name: text().notNull(),
  post_per_page: integer().notNull(),
  extra_css: text().notNull(),
  extra_js: text().notNull(),

  password_hash: text().notNull(),
  jwt_secret: text().notNull(),
});

export const ConfigTableSQL = `CREATE TABLE IF NOT EXISTS config (
  id INTEGER NOT NULL PRIMARY KEY CHECK (id = 1),

  site_name TEXT NOT NULL,
  post_per_page INTEGER NOT NULL,
  extra_css TEXT NOT NULL,
  extra_js TEXT NOT NULL,

  password_hash TEXT NOT NULL,
  jwt_secret TEXT NOT NULL
);`;

export const StorageTable = sqliteTable("storage", {
  name: text().notNull().primaryKey(),
  type: text().notNull().$type<"post" | "page">(),
  title: text().notNull().unique(),
  content: text().notNull().default(""),
});

export const StorageTableSQL = `CREATE TABLE IF NOT EXISTS storage (
  name TEXT NOT NULL PRIMARY KEY,
  type TEXT NOT NULL CHECK (type IN ('post', 'page')),
  title TEXT NOT NULL UNIQUE,
  content TEXT NOT NULL DEFAULT ''
);`;
