import express from "express";
import morgan from "morgan";
import authRoutes from "./routes/auth.routes";
const app = express();
app.use(express.json());
app.use(morgan("dev"));
app.use("/auth", authRoutes);

app.get("/health", (_req, res) => {
  res.json({ 
    service: "auth-service",
    status: "OK" 
  });
});

export default {
  port: 3001,
  fetch: app,
};