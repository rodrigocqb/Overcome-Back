import { conflictError, unauthorizedError } from "@/errors";
import { authRepository } from "@/repositories";
import { SignInParams, SignUpParams } from "@/types";
import { User } from "@prisma/client";
import bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";

async function createUser({
  email,
  name,
  password,
}: SignUpParams): Promise<User> {
  const existingUser = await checkIfUserWithEmailAlreadyExists(email);

  if (existingUser) throw conflictError();

  const hashedPassword = bcrypt.hashSync(password, 10);

  const user = await authRepository.createUser({
    email,
    name,
    password: hashedPassword,
  });

  return user;
}

async function signUserIn({ email, password }: SignInParams): Promise<{
  id: number;
  name: string;
  token: string;
}> {
  const user = await checkIfUserWithEmailAlreadyExists(email);

  if (!user) throw unauthorizedError();

  validatePassword(password, user.password);

  const token = await createSession(user.id);

  return {
    id: user.id,
    name: user.name,
    token,
  };
}

async function checkIfUserWithEmailAlreadyExists(email: string) {
  const existingUser = await authRepository.findUserByEmail(email);

  return existingUser;
}

function validatePassword(password: string, userPassword: string) {
  const isPasswordValid = bcrypt.compareSync(password, userPassword);

  if (!isPasswordValid) throw unauthorizedError();
}

async function createSession(userId: number) {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET);
  await authRepository.createSession({
    token,
    userId,
  });

  return token;
}

export const authService = { createUser, signUserIn };
