import { and, eq } from "drizzle-orm";
import { db } from "../db/db";
import {
  executionJobs,
  type ExecutionRecord,
  type ExecutionStatus,
} from "../db/schema";

export const createExecution = async (input: {
  id: string;
  snippetId: string;
  userId: string;
  language: string;
}): Promise<ExecutionRecord> => {
  const [record] = await db.insert(executionJobs).values(input).returning();
  if (!record) throw new Error("Failed to create execution record");
  return record;
};

export const findExecutionForUser = async (
  id: string,
  userId: string,
): Promise<ExecutionRecord | undefined> => {
  const [record] = await db
    .select()
    .from(executionJobs)
    .where(and(eq(executionJobs.id, id), eq(executionJobs.userId, userId)))
    .limit(1);
  return record;
};

export const updateExecution = async (
  id: string,
  input: {
    status: ExecutionStatus;
    stdout?: string | null;
    stderr?: string | null;
    exitCode?: number | null;
    startedAt?: Date;
    completedAt?: Date;
  },
): Promise<ExecutionRecord | undefined> => {
  const [record] = await db
    .update(executionJobs)
    .set(input)
    .where(eq(executionJobs.id, id))
    .returning();
  return record;
};
