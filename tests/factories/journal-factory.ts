import { prisma } from "@/config";
import { faker } from "@faker-js/faker";
import { User } from "@prisma/client";
import { createUser } from "./user-factory";

export async function createJournal(user?: User) {
  const incomingUser = user || (await createUser());
  return prisma.journal.create({
    data: {
      userId: incomingUser.id,
      text: faker.lorem.paragraph(),
    },
  });
}
