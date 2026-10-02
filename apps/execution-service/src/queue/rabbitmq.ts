import amqplib, { type ChannelModel, type ConfirmChannel } from "amqplib";
import type { ExecutionJob } from "../types/execute";
import "dotenv/config";

const rabbitMqUrl = process.env.RABBITMQ_URL || "amqp://localhost";
const queueName = "execution-jobs";

let connection: ChannelModel | null = null;
let channel: ConfirmChannel | null = null;
let connecting: Promise<ConfirmChannel> | null = null;

export const connectRabbitMQ = async (): Promise<ConfirmChannel> => {
  if (channel) return channel;
  if (connecting) return connecting;

  connecting = (async () => {
    try {
      connection = await amqplib.connect(rabbitMqUrl);
      connection.on("close", () => {
        connection = null;
        channel = null;
      });
      connection.on("error", (error) => {
        console.error("RabbitMQ connection error:", error);
      });
      const createdChannel = await connection.createConfirmChannel();
      await createdChannel.assertQueue(queueName, { durable: true });
      channel = createdChannel;
      return createdChannel;
    } catch (error) {
      connection = null;
      channel = null;
      console.error("Failed to connect to RabbitMQ:", error);
      throw error;
    } finally {
      connecting = null;
    }
  })();

  return connecting;
};

export const publishJob = async (job: ExecutionJob): Promise<void> => {
  const ch = await connectRabbitMQ();
  const payload = Buffer.from(JSON.stringify(job));
  ch.sendToQueue(queueName, payload, {
    persistent: true,
    contentType: "application/json",
  });
  await ch.waitForConfirms();
  console.log(`[ExecutionService] Published job ${job.jobId} to queue`);
};
