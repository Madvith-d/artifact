import { verifyToken } from "@artifact/auth";
import type { NextFunction, Request, Response } from "express";

export const optionalAuth = (
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return next();
  }
  const token = authHeader.replace(/^bearer\s+/i, "").trim();
  try {
    const user = verifyToken(token) as { id: string; email: string };
    req.user = user;
  } catch (error) {
    // Token is invalid or expired; proceed unauthenticated
  }
  next();
};
