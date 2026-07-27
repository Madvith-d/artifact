import "dotenv/config";
import jwt from "jsonwebtoken";
const generateToken = (user: { id: string; email: string }) => {
  const payload = {
    id: user.id,
    email: user.email,
  };
  try {
    return jwt.sign(payload, process.env.JWT_SECRET!, {
      expiresIn: "7d",
    });
  } catch (error) {
    throw new Error("Failed to generate JWT");
  }
};

const verifyToken = (token: string) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET!);
  } catch (error) {
    throw new Error("Failed to verify JWT");
  }
};

export { generateToken, verifyToken };
