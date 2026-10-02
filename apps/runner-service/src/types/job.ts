export interface ExecutionJob {
  jobId: string;
  snippetId: string;
  language: string;
  code: string;
  callbackUrl: string;
  createdAt: string;
}

export type ExecutionResult = {
  status: "COMPLETED" | "FAILED" | "TIMEOUT";
  stdout: string;
  stderr: string;
  exitCode: number | null;
};

export const isExecutionJob = (value: unknown): value is ExecutionJob => {
  if (!value || typeof value !== "object") return false;
  const job = value as Record<string, unknown>;
  return (
    typeof job.jobId === "string" &&
    typeof job.snippetId === "string" &&
    typeof job.language === "string" &&
    typeof job.code === "string" &&
    typeof job.callbackUrl === "string" &&
    typeof job.createdAt === "string"
  );
};
