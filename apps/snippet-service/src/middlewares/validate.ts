import { z } from "zod";
import type { Request, Response, NextFunction } from "express";

type ValidateSource = "body" | "query";

export const validate = (
  schema: z.ZodType<any>,
  source: ValidateSource = "body",
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const data = source === "query" ? req.query : req.body;
    const result = schema.safeParse(data);
    if (!result.success) {
      return res.status(400).json({ error: result.error.message });
    }
    next();
  };
};
