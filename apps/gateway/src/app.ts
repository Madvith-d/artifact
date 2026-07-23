import express from "express";
import type { Request, Response } from "express";
import morgan from "morgan";
const app = express();
app.use(express.json());
app.use(morgan("dev"));

app.get("/health", (_req: Request, res: Response) => {
  res.json({
    service: "gateway-service",
    status: "OK",
  });
});

app.use("/api/auth", async (req: Request, res: Response) => {
  try {
    const identityServiceUrl = process.env.IDENTITY_SERVICE_URL || "http://localhost:3001";
    const path = req.originalUrl.replace(/^\/api/, "");
    const targetUrl = `${identityServiceUrl}${path}`;

    const upstreamResponse = await fetch(targetUrl, {
      method: req.method,
      headers: {
        "content-type": req.headers["content-type"] ?? "application/json",
        authorization: req.headers.authorization ?? "",
      },
      body: ["GET", "HEAD"].includes(req.method)
        ? undefined
        : JSON.stringify(req.body),
    });
    const contentType = upstreamResponse.headers.get("content-type") ?? "";
    const body = await upstreamResponse.text();
    res.status(upstreamResponse.status);
    res.setHeader("content-type", contentType);
    res.send(body);
  } catch (error) {
    console.error("Proxy error:", error);
    return res.status(500).json({
      error: "GATEWAY_ERROR",
      message: "Failed to connect to Identity Service",
    });
  }
});
export default app;
