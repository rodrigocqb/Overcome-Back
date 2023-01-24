import bcrypt from "bcrypt";
import { faker } from "@faker-js/faker";
import { User } from "@prisma/client";
import { prisma } from "@/config";
import { SignUpParams } from "@/types/auth-types";

export async function createUser({ email, name, password }: Partial<User> = {}): Promise<User> {
  const incomingPassword = password || faker.internet.password(6);
  const hashedPassword = bcrypt.hashSync(incomingPassword, 10);

  return prisma.user.create({
    data: {
      email: email || faker.internet.email(),
      name: name || faker.name.fullName(),
      password: hashedPassword,
    },
  });
}

export function generateValidUserBody(): SignUpParams {
  return {
    email: faker.internet.email(),
    name: faker.name.fullName(),
    password: faker.internet.password(6),
  };
}
