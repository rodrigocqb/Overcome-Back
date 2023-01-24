import bcrypt from "bcrypt";
import { faker } from "@faker-js/faker";
import { User } from "@prisma/client";
import { prisma } from "@/config";
import { UserParams } from "@/types/auth-types";

export async function createUser({ email, password }: Partial<User> = {}): Promise<User> {
  const incomingPassword = password || faker.internet.password(6);
  const hashedPassword = bcrypt.hashSync(incomingPassword, 10);

  return prisma.user.create({
    data: {
      email: email || faker.internet.email(),
      password: hashedPassword,
    },
  });
}

export function generateValidUserBody(): UserParams {
  return {
    email: faker.internet.email(),
    password: faker.internet.password(6),
  };
}
