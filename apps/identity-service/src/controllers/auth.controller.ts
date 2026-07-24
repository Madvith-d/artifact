import type { Request, Response } from "express";
import { register, login } from "../services/auth.service";
import { AppError } from "../utils/errors";

export const handleRegister = async (req: Request, res: Response) => {
  try {
    const user = await register(req.body);
    return res.status(201).json({
      success: true,
      data: user,
    });
  } catch (error) {
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({
        success: false,
        message: error.message,
      });
    }
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error instanceof Error ? error.message : String(error),
    });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  try {
    const data = await login(req.body);
    res.cookie("accessToken", data.token, {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
    });
    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({
        success: false,
        message: error.message,
      });
    }
    return res.status(500).json({
      success: false,
      message: "Failed to login",
      error: error instanceof Error ? error.message : String(error),
    });
  }
};

export const getMe = async (req: Request, res: Response) => {
  try {
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
  } catch (error) {
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({
        success: false,
        message: error.message,
      });
    }
    return res.status(500).json({
      success: false,
      message: "Failed to get user",
      error: error instanceof Error ? error.message : String(error),
    });
  }
};
