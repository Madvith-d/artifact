import { randomUUID } from "node:crypto";
import { execFile, spawn } from "node:child_process";
import { promisify } from "node:util";
import type { ExecutionJob, ExecutionResult } from "../types/job";

const MAX_OUTPUT_BYTES = 1_048_576;
const TIMEOUT_MS = Number(process.env.EXECUTION_TIMEOUT_MS ?? 5_000);
const PYTHON_IMAGE = process.env.PYTHON_RUNNER_IMAGE ?? "python:3.12-alpine";
const execFileAsync = promisify(execFile);

export const prepareExecutor = async (): Promise<void> => {
  try {
    await execFileAsync("docker", ["image", "inspect", PYTHON_IMAGE]);
  } catch {
    console.log(`[RunnerService] Pulling sandbox image ${PYTHON_IMAGE}`);
    await execFileAsync("docker", ["pull", PYTHON_IMAGE], {
      timeout: 300_000,
      maxBuffer: MAX_OUTPUT_BYTES,
    });
  }
};

const appendOutput = (current: Buffer[], chunk: Buffer, size: number) => {
  const remaining = MAX_OUTPUT_BYTES - size;
  if (remaining <= 0) return 0;
  const kept = chunk.subarray(0, remaining);
  current.push(kept);
  return kept.length;
};

export const execute = async (job: ExecutionJob): Promise<ExecutionResult> => {
  if (job.language.toLowerCase() !== "python") {
    return {
      status: "FAILED",
      stdout: "",
      stderr: `Unsupported language: ${job.language}`,
      exitCode: null,
    };
  }

  const containerName = `artifact-run-${job.jobId}-${randomUUID().slice(0, 8)}`;
  const args = [
    "run",
    "--rm",
    "--interactive",
    "--name",
    containerName,
    "--network",
    "none",
    "--memory",
    process.env.EXECUTION_MEMORY_LIMIT ?? "128m",
    "--cpus",
    process.env.EXECUTION_CPU_LIMIT ?? "0.5",
    "--pids-limit",
    "64",
    "--read-only",
    "--tmpfs",
    "/tmp:rw,noexec,nosuid,size=16m",
    "--cap-drop",
    "ALL",
    "--security-opt",
    "no-new-privileges",
    "--user",
    "65534:65534",
    PYTHON_IMAGE,
    "python",
    "-I",
    "-",
  ];

  return await new Promise((resolve) => {
    const child = spawn("docker", args, { stdio: ["pipe", "pipe", "pipe"] });
    const stdout: Buffer[] = [];
    const stderr: Buffer[] = [];
    let stdoutSize = 0;
    let stderrSize = 0;
    let timedOut = false;
    let outputExceeded = false;
    let settled = false;

    const finish = (result: ExecutionResult) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      resolve(result);
    };

    const stopContainer = () => {
      child.kill("SIGKILL");
      const cleanup = spawn("docker", ["rm", "-f", containerName], {
        stdio: "ignore",
      });
      cleanup.unref();
    };

    child.stdout.on("data", (chunk: Buffer) => {
      stdoutSize += appendOutput(stdout, chunk, stdoutSize);
      if (stdoutSize >= MAX_OUTPUT_BYTES && !outputExceeded) {
        outputExceeded = true;
        stopContainer();
      }
    });
    child.stderr.on("data", (chunk: Buffer) => {
      stderrSize += appendOutput(stderr, chunk, stderrSize);
      if (stderrSize >= MAX_OUTPUT_BYTES && !outputExceeded) {
        outputExceeded = true;
        stopContainer();
      }
    });

    child.on("error", (error) => {
      finish({
        status: "FAILED",
        stdout: Buffer.concat(stdout).toString("utf8"),
        stderr: `Failed to start Docker: ${error.message}`,
        exitCode: null,
      });
    });

    child.on("close", (code) => {
      const capturedStderr = Buffer.concat(stderr).toString("utf8");
      finish({
        status: timedOut ? "TIMEOUT" : outputExceeded ? "FAILED" : "COMPLETED",
        stdout: Buffer.concat(stdout).toString("utf8"),
        stderr: outputExceeded
          ? `${capturedStderr}\nOutput limit exceeded`.trim()
          : capturedStderr,
        exitCode: timedOut || outputExceeded ? null : code,
      });
    });

    const timer = setTimeout(() => {
      timedOut = true;
      stopContainer();
    }, TIMEOUT_MS);

    child.stdin.on("error", () => undefined);
    child.stdin.end(job.code);
  });
};
