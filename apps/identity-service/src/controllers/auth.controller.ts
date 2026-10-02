import type { Request, Response } from "express";
import { register, login } from "../services/auth.service";

export const handleRegister = async (req: Request, res: Response) => {
  const user = await register(req.body);
  return res.status(201).json({
    success: true,
    data: user,
  });
};

export const loginUser = async (req: Request, res: Response) => {
  const data = await login(req.body);
  res.cookie("accessToken", data.token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
  return res.status(200).json({
    success: true,
    data,
  });
};

export const getMe = (req: Request, res: Response) => {
  const user = req.user;
  if (!user) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
  }
  return res.status(200).json({
    success: true,
    data: {
      id: user.id,
      email: user.email,
    },
  });
};
