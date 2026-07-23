import type { NextFunction, Request, Response } from "express";
import { z } from "zod";
export const validate = (schema: z.ZodTypeAny) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const validatedData = schema.parse(req.body);
      Object.assign(req, validatedData);
      next();
    } catch (err) {
      res.status(400).json({ error: "Zod - Invalid request body" });
    }
  };
};
