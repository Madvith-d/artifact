import { verifyToken } from "../utils/jwt";
import type { NextFunction, Request, Response } from "express";
export const verifiedRoute = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  const token = authHeader.replace(/^bearer\s+/i, "").trim();
  try {
    const user = verifyToken(token) as { id: string; email: string };
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ error: "Unauthorized" });
  }
};
