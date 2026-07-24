import { Router } from "express";
import {
  handleRegister,
  loginUser,
  getMe,
} from "../controllers/auth.controller";
import { validate } from "../middlewares/validate";
import { z } from "zod";
import { verifiedRoute } from "../middlewares/auth.middleware";
const registerSchema = z.object({
  username: z.string(),
  email: z.email(),
  password: z.string(),
});

const loginSchema = z.object({
  email: z.email(),
  password: z.string(),
});
const router = Router();

router.post("/register", validate(registerSchema), handleRegister);
router.post("/login", validate(loginSchema), loginUser);
router.get("/me", verifiedRoute, getMe);
export default router;
