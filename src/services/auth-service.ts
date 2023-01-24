import { conflictError } from "@/errors";
import authRepository from "@/repositories/auth-repository";
import { UserParams } from "@/types/auth-types";
import { User } from "@prisma/client";
import bcrypt from "bcrypt";

async function createUser({ email, password }: UserParams): Promise<User> {
  await checkIfUserWithEmailAlreadyExists(email);

  const hashedPassword = bcrypt.hashSync(password, 10);

  const user = await authRepository.createUser({
    email,
    password: hashedPassword,
  });

  return user;
}

async function checkIfUserWithEmailAlreadyExists(email: string) {
  const existingUser = await authRepository.findUserByEmail(email);

  if (existingUser) throw conflictError();
}

const authService = { createUser };

export default authService;
