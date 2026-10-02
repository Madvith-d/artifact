import {
  createUser,
  findUserByUsername,
  findUserByEmail,
} from "../repository/user.repository";
import { generateToken } from "@artifact/auth";
import bcrypt from "bcryptjs";
import { ConflictError, UnauthorizedError, InternalServerError } from "../utils/errors";

export const register = async (payload: {
  username: string;
  email: string;
  password: string;
}) => {
  const existingUser = await findUserByUsername(payload.username);
  if (existingUser) {
    throw new ConflictError("Username already exists");
  }

  const existingEmail = await findUserByEmail(payload.email);
  if (existingEmail) {
    throw new ConflictError("Email already exists");
  }

  const passwordHash = await bcrypt.hash(payload.password, 10);

  const user = await createUser({
    username: payload.username,
    email: payload.email,
    passwordHash,
  });

  if (!user) {
    throw new InternalServerError("Failed to create user");
  }

  return {
    id: user.id,
    username: user.username,
    email: user.email,
  };
};

export const login = async (payload: { email: string; password: string }) => {
  const user = await findUserByEmail(payload.email);
  if (!user) {
    throw new UnauthorizedError("Invalid email or password");
  }

  const validPassword = await bcrypt.compare(
    payload.password,
    user.passwordHash,
  );
  if (!validPassword) {
    throw new UnauthorizedError("Invalid email or password");
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
