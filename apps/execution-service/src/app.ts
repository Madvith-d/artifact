import express from "express";
import morgan from "morgan";
const app = express();

app.use(morgan("dev"));

app.get("/health", (_req, res) => {
  res.json({ 
    service: "execution-service",
    status: "OK" 
  });
});
export default app;