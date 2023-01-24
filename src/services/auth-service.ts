import { conflictError } from "@/errors";
import authRepository from "@/repositories/auth-repository";
import { SignUpParams } from "@/types/auth-types";
import { User } from "@prisma/client";
import bcrypt from "bcrypt";

async function createUser({ email, name, password }: SignUpParams): Promise<User> {
  await checkIfUserWithEmailAlreadyExists(email);

  const hashedPassword = bcrypt.hashSync(password, 10);

  const user = await authRepository.createUser({
    email,
    name,
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
