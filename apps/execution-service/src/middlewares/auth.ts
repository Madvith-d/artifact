import { verifyToken } from "@artifact/auth";
import type { NextFunction, Request, Response } from "express";

export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  const header = req.headers.authorization;
  if (!header?.match(/^Bearer\s+\S+/i)) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const user = verifyToken(header.replace(/^Bearer\s+/i, "")) as {
      id: string;
      email: string;
    };
    req.user = user;
    next();
  } catch {
    return res.status(401).json({ error: "Unauthorized" });
  }
};

export const requireRunner = (req: Request, res: Response, next: NextFunction) => {
  const configuredToken = process.env.RUNNER_CALLBACK_TOKEN;
  if (!configuredToken || req.headers["x-runner-token"] !== configuredToken) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  next();
};
