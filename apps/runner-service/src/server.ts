import "dotenv/config";
import app from "./app";
import { prepareExecutor } from "./executor/executor";
import { startConsumer } from "./queue/rabbitmq";

const port = Number(process.env.PORT ?? 3005);

try {
  await prepareExecutor();
  await startConsumer();
  app.listen(port, () => {
    console.log(`Runner service listening on port ${port}`);
  });
} catch (error) {
  console.error("Failed to start runner service:", error);
  process.exit(1);
}

