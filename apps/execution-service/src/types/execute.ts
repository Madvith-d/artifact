import type { ExecutionStatus } from "../db/schema";

export interface ExecutionJob {
  jobId: string;
  snippetId: string;
  language: string;
  code: string;
  callbackUrl: string;
  createdAt: string;
}

export interface ExecutionResultUpdate {
  status: Exclude<ExecutionStatus, "QUEUED">;
  stdout?: string | null;
  stderr?: string | null;
  exitCode?: number | null;
}
