import { email } from "zod";
import {
  createUser,
  findUserByUsername,
  findUserByEmail,
} from "../repository/user.repository";
import { generateToken } from "../utils/jwt";
import bcrypt from "bcryptjs";

export const register = async (payload: {
  username: string;
  email: string;
  password: string;
}) => {
  const existingUser = await findUserByUsername(payload.username);
  if (existingUser) {
    throw new Error("User already exists");
  }

  const existingEmail = await findUserByEmail(payload.email);
  if (existingEmail) {
    throw new Error("Email already exists");
  }

  const user = await createUser(payload);
  if (!user) {
    throw new Error("Failed to create user");
  }
  return user;
};

export const login = async (payload: { email: string; password: string }) => {
  const user = await findUserByEmail(payload.email);
  if (!user) {
    throw new Error("User not found");
  }

  const validPassword = await bcrypt.compare(
    payload.password,
    user.passwordHash,
  );
  if (!validPassword) {
    throw new Error("Invalid password");
  }

  const token = generateToken(user);
  return {
    token,
    data: {
      id: user.id,
      email: user.email,
    },
  };
};
