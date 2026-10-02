import amqplib, { type Channel, type ChannelModel, type ConsumeMessage } from "amqplib";
import { execute } from "../executor/executor";
import { isExecutionJob, type ExecutionJob } from "../types/job";

const rabbitMqUrl = process.env.RABBITMQ_URL ?? "amqp://localhost";
const queueName = "execution-jobs";
let connection: ChannelModel | null = null;
let channel: Channel | null = null;

const sendUpdate = async (
  job: ExecutionJob,
  body: Record<string, unknown>,
): Promise<void> => {
  const token = process.env.RUNNER_CALLBACK_TOKEN;
  if (!token) throw new Error("RUNNER_CALLBACK_TOKEN is not configured");

  let lastError: unknown;
  for (let attempt = 1; attempt <= 3; attempt += 1) {
    try {
      const response = await fetch(job.callbackUrl, {
        method: "PATCH",
        headers: {
          "content-type": "application/json",
          "x-runner-token": token,
        },
        body: JSON.stringify(body),
        signal: AbortSignal.timeout(5_000),
      });
      if (!response.ok) {
        throw new Error(`Execution callback returned ${response.status}`);
      }
      return;
    } catch (error) {
      lastError = error;
      if (attempt < 3) await Bun.sleep(attempt * 500);
    }
  }
  throw lastError;
};

const processMessage = async (message: ConsumeMessage, ch: Channel) => {
  let parsed: unknown;
  try {
    parsed = JSON.parse(message.content.toString("utf8"));
  } catch {
    console.error("Discarding malformed execution job");
    ch.nack(message, false, false);
    return;
  }

  if (!isExecutionJob(parsed)) {
    console.error("Discarding invalid execution job");
    ch.nack(message, false, false);
    return;
  }

  try {
    await sendUpdate(parsed, { status: "RUNNING" });
    const result = await execute(parsed);
    await sendUpdate(parsed, result);
    ch.ack(message);
    console.log(`[RunnerService] Finished job ${parsed.jobId}: ${result.status}`);
  } catch (error) {
    console.error(`[RunnerService] Job ${parsed.jobId} failed:`, error);
    ch.nack(message, false, true);
  }
};

export const startConsumer = async (): Promise<void> => {
  connection = await amqplib.connect(rabbitMqUrl);
  connection.on("error", (error) => console.error("RabbitMQ connection error:", error));
  connection.on("close", () => {
    channel = null;
    connection = null;
    console.error("RabbitMQ connection closed");
  });

  channel = await connection.createChannel();
  await channel.assertQueue(queueName, { durable: true });
  await channel.prefetch(Number(process.env.RUNNER_CONCURRENCY ?? 1));
  await channel.consume(queueName, (message) => {
    if (message && channel) void processMessage(message, channel);
  });
  console.log(`[RunnerService] Consuming ${queueName}`);
};
