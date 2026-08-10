import amqplib, { type Channel, type ChannelModel } from "amqplib";
import type { ExecutionJob } from "../types/execute";
import "dotenv/config";

const rabbitMqUrl = process.env.RABBITMQ_URL || "amqp://localhost";
const queueName = "execution-jobs";

let connection: ChannelModel | null = null;
let channel: Channel | null = null;

export const connectRabbitMQ = async (): Promise<Channel> => {
  if (channel) return channel;

  try {
    connection = await amqplib.connect(rabbitMqUrl);
    const createdChannel = await connection.createChannel();
    await createdChannel.assertQueue(queueName, { durable: true });
    channel = createdChannel;
    return channel;
  } catch (error) {
    console.error("Failed to connect to RabbitMQ:", error);
    throw error;
  }
};

export const publishJob = async (job: ExecutionJob): Promise<void> => {
  const ch = await connectRabbitMQ();
  const payload = Buffer.from(JSON.stringify(job));
  ch.sendToQueue(queueName, payload, {
    persistent: true,
  });
  console.log(`[ExecutionService] Published job ${job.jobId} to queue`);
};
