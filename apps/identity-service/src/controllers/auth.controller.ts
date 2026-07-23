import type { Request, Response } from "express";
import { register } from "../services/auth.service";
import { z } from "zod";
const registerSchema = z.object({
  username: z.string(),
  email: z.email(),
  password: z.string(),
});
export const handleRegister = async (req: Request, res: Response) => {
  try {
    // const validatedData = registerSchema.parse(req.body);
    const user = await register(req.body);
    return res.status(201).json({ data: user });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
      error: error instanceof Error ? error.message : String(error),
    });
  }
};
