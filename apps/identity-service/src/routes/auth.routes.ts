import { Router } from "express";
import { handleRegister } from "../controllers/auth.controller";
import { validate } from "../middlewares/validate";
import { z } from "zod";
const registerSchema = z.object({
  username: z.string(),
  email: z.email(),
  password: z.string(),
});
const router = Router();

router.post("/register", validate(registerSchema), handleRegister);

export default router;
