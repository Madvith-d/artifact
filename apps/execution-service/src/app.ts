import express from "express";
import morgan from "morgan";
//import { v4 as uuidv4 } from "uuid";
import { publishJob } from "./queue/rabbitmq";
import type { ExecutionJob } from "./types/execute";
const app = express();
app.use(express.json());

app.use(morgan("dev"));

app.get("/health", (_req, res) => {
  res.json({
    service: "execution-service",
    status: "OK",
  });
});

//TODO
export default app;
