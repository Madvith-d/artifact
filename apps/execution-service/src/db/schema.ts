import { pgEnum, pgTable, integer, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const executionStatusEnum = pgEnum("execution_status", [
  "QUEUED",
  "RUNNING",
  "COMPLETED",
  "FAILED",
  "TIMEOUT",
]);

export type ExecutionStatus = (typeof executionStatusEnum.enumValues)[number];

export const executionJobs = pgTable("execution_jobs", {
  id: uuid("id").primaryKey(),
  snippetId: uuid("snippet_id").notNull(),
  userId: uuid("user_id").notNull(),
  language: text("language").notNull(),
  status: executionStatusEnum("status").notNull().default("QUEUED"),
  stdout: text("stdout"),
  stderr: text("stderr"),
  exitCode: integer("exit_code"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  startedAt: timestamp("started_at", { withTimezone: true }),
  completedAt: timestamp("completed_at", { withTimezone: true }),
});

export type ExecutionRecord = typeof executionJobs.$inferSelect;
