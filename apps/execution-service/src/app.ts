import express from "express";
import morgan from "morgan";
import executionRoutes from "./routes/execution.routes";

const app = express();
app.use(express.json({ limit: "1mb" }));
app.use(morgan("dev"));

app.get("/health", (_req, res) => {
  res.json({
    service: "execution-service",
    status: "OK",
  });
});

app.use(executionRoutes);

export default app;
