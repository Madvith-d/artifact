import { generateToken, verifyToken } from "../utils/jwt";
import type { NextFunction, Request, Response } from "express";

export const verifiedRoute = (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  const authHeader = request.headers.authorization;
  if (!authHeader) {
    response.status(401).json({ error: "Unauthorized" });
    return;
  }

  const token = authHeader.replace(/^bearer\s+/i, "").trim();

  try {
    const decodedToken = verifyToken(token) as { id: string; email: string };
    request.user = decodedToken;
    next();
  } catch (error) {
    response.status(401).json({ error: "Invalid or expired token" });
    return;
  }
};
