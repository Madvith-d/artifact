import {
  pgTable,
  text,
  uuid,
  timestamp,
  pgEnum,
} from "drizzle-orm/pg-core";
export const languageEnum = pgEnum("language", [
  "typescript",
  "javascript",
  "python",
  "java",
  "c++",
  "c",
  "html",
  "css",
  "sql",
  "bash",
  "powershell",
  "",
]);

export const visibilityEnum = pgEnum("visibility", ["public", "private"]);

export const snippets = pgTable(
  "snippets",
  {
    id: uuid("id").primaryKey(),
    title: text("title").notNull(),
    description: text("description"),
    language: languageEnum(),
    code: text("code").notNull(),
    visibility: visibilityEnum().notNull(),
    ownerId: uuid("owner_id").notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
);
