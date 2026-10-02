import { randomUUID } from "node:crypto";
import type { Request, Response } from "express";
import { publishJob } from "../queue/rabbitmq";
import {
  createExecution,
  findExecutionForUser,
  updateExecution,
} from "../repository/execution.repository";
import { fetchAccessibleSnippet, SnippetServiceError } from "../services/snippet.client";
import type { ExecutionJob, ExecutionResultUpdate } from "../types/execute";

const serializeExecution = (execution: NonNullable<Awaited<ReturnType<typeof findExecutionForUser>>>) => ({
  jobId: execution.id,
  snippetId: execution.snippetId,
  language: execution.language,
  status: execution.status.toLowerCase(),
  stdout: execution.stdout,
  stderr: execution.stderr,
  exitCode: execution.exitCode,
  createdAt: execution.createdAt,
  startedAt: execution.startedAt,
  completedAt: execution.completedAt,
});

export const executeSnippet = async (req: Request, res: Response) => {
  const user = req.user!;
  try {
    const snippet = await fetchAccessibleSnippet(
      req.body.snippetId,
      req.headers.authorization!,
    );

    if (snippet.language.toLowerCase() !== "python") {
      return res.status(422).json({
        error: "Unsupported language",
        supportedLanguages: ["python"],
      });
    }

    const jobId = randomUUID();
    const createdAt = new Date();
    await createExecution({
      id: jobId,
      snippetId: snippet.id,
      userId: user.id,
      language: snippet.language,
    });

    const callbackBaseUrl =
      process.env.EXECUTION_CALLBACK_BASE_URL ?? "http://localhost:3004";
    const job: ExecutionJob = {
      jobId,
      snippetId: snippet.id,
      language: snippet.language,
      code: snippet.code,
      callbackUrl: `${callbackBaseUrl}/internal/executions/${jobId}`,
      createdAt: createdAt.toISOString(),
    };

    try {
      await publishJob(job);
    } catch (error) {
      await updateExecution(jobId, {
        status: "FAILED",
        stderr: "Failed to enqueue execution",
        completedAt: new Date(),
      });
      throw error;
    }

    return res.status(202).json({ success: true, jobId, status: "queued" });
  } catch (error) {
    if (error instanceof SnippetServiceError) {
      return res.status(error.statusCode).json({ error: error.message });
    }
    console.error("Failed to queue execution:", error);
    return res.status(500).json({ error: "Failed to queue execution" });
  }
};

export const getExecution = async (req: Request, res: Response) => {
  try {
    const execution = await findExecutionForUser(req.params.jobId as string, req.user!.id);
    if (!execution) return res.status(404).json({ error: "Execution not found" });
    return res.json(serializeExecution(execution));
  } catch (error) {
    console.error("Failed to fetch execution:", error);
    return res.status(500).json({ error: "Failed to fetch execution" });
  }
};

export const updateExecutionResult = async (req: Request, res: Response) => {
  const update = req.body as ExecutionResultUpdate;
  try {
    const execution = await updateExecution(req.params.jobId as string, {
      status: update.status,
      stdout: update.stdout,
      stderr: update.stderr,
      exitCode: update.exitCode,
      ...(update.status === "RUNNING" ? { startedAt: new Date() } : {}),
      ...(["COMPLETED", "FAILED", "TIMEOUT"].includes(update.status)
        ? { completedAt: new Date() }
        : {}),
    });
    if (!execution) return res.status(404).json({ error: "Execution not found" });
    return res.json({ success: true });
  } catch (error) {
    console.error("Failed to update execution:", error);
    return res.status(500).json({ error: "Failed to update execution" });
  }
};
