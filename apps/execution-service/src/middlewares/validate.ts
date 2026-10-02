import type { NextFunction, Request, Response } from "express";
import type { ZodType } from "zod";

export const validate =
  (schema: ZodType, source: "body" | "params" = "body") =>
  (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req[source]);
    if (!result.success) {
      return res.status(400).json({
        error: "Validation failed",
        details: result.error.issues,
      });
    }
    req[source] = result.data;
    next();
  };
