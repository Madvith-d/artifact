import type { NextFunction, Request, Response } from "express";
import { z, ZodError } from "zod";

export const validate = (schema: z.ZodTypeAny) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const validatedData = schema.parse(req.body);
      req.body = validatedData;
      next();
    } catch (err) {
      if (err instanceof ZodError) {
        res.status(400).json({
          success: false,
          message: "Validation failure",
          errors: err.issues,
        });
        return;
      }
      res.status(400).json({
        success: false,
        message: "Invalid request body",
      });
      return;
    }
  };
};
