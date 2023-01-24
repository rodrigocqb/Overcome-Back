import bcrypt from "bcrypt";
import { faker } from "@faker-js/faker";
import { User } from "@prisma/client";
import { prisma } from "@/config";

export async function createUser(): Promise<User> {
  const incomingPassword = faker.internet.password(6);
  const hashedPassword = bcrypt.hashSync(incomingPassword, 10);

  return prisma.user.create({
    data: {
      email: faker.internet.email(),
      password: hashedPassword,
    },
  });
}
