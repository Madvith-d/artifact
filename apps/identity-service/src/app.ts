import express from "express";
import morgan from "morgan";
import authRoutes from "./routes/auth.routes";
import { errorHandler } from "./middlewares/error.middleware";
const app = express();
app.use(express.json());
app.use(morgan("dev"));
app.use("/auth", authRoutes);

app.get("/health", (_req, res) => {
  res.json({
    service: "identity-service",
    status: "OK",
  });
});

app.use(errorHandler);

export default app;
