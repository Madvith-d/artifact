import { Router } from "express";
import { z } from "zod";
import {
  executeSnippet,
  getExecution,
  updateExecutionResult,
} from "../controllers/execution.controller";
import { requireAuth, requireRunner } from "../middlewares/auth";
import { validate } from "../middlewares/validate";

const router = Router();
const executeSchema = z.object({ snippetId: z.uuid() }).strict();
const jobParamsSchema = z.object({ jobId: z.uuid() });
const resultSchema = z
  .object({
    status: z.enum(["RUNNING", "COMPLETED", "FAILED", "TIMEOUT"]),
    stdout: z.string().max(1_048_576).nullable().optional(),
    stderr: z.string().max(1_048_576).nullable().optional(),
    exitCode: z.number().int().nullable().optional(),
  })
  .strict();

router.post("/execute", requireAuth, validate(executeSchema), executeSnippet);
router.get(
  "/execute/:jobId",
  requireAuth,
  validate(jobParamsSchema, "params"),
  getExecution,
);
router.patch(
  "/internal/executions/:jobId",
  requireRunner,
  validate(jobParamsSchema, "params"),
  validate(resultSchema),
  updateExecutionResult,
);

export default router;
