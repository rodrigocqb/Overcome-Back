import { faker } from "@faker-js/faker";
import { prisma } from "@/config";
import { User } from "@prisma/client";

export async function createObjective(user: User) {
  return prisma.objective.create({
    data: {
      userId: user.id,
      title: faker.lorem.sentence(),
      currentWeight: faker.datatype.number(),
      goalWeight: faker.datatype.number(),
    },
  });
}
