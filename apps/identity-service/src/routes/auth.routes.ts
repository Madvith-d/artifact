import { Router } from "express";
import { handleRegister } from "../controllers/auth.controller";
const router = Router();

router.post("/register", handleRegister);

export default router;

