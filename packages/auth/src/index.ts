import "dotenv/config";
import jwt from "jsonwebtoken";

export interface AuthUser {
  id: string;
  email: string;
}

const getJwtSecret = () => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET is not configured");
  }
  return secret;
};

export const generateToken = (user: AuthUser) =>
  jwt.sign({ id: user.id, email: user.email }, getJwtSecret(), {
    expiresIn: "7d",
  });

export const verifyToken = (token: string) =>
  jwt.verify(token, getJwtSecret());
