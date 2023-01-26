import { prisma } from "@/config";
import { faker } from "@faker-js/faker";
import { Exercise, User } from "@prisma/client";
import { createUser } from "./user-factory";

export function createValidSheetBody() {
  return {
    title: faker.lorem.word(),
  };
}

export function createValidSheetExerciseBody(exercise?: Exercise) {
  return {
    exerciseBody: [
      {
        exerciseId: exercise?.id || faker.datatype.number(),
        weight: faker.datatype.number(),
        reps: faker.datatype.number(),
        sets: faker.datatype.number(),
      },
    ],
  };
}

export async function createSheet(user?: User) {
  const incomingUser = user || (await createUser());
  return prisma.sheet.create({
    data: {
      title: faker.lorem.word(),
      userId: incomingUser.id,
    },
  });
}
