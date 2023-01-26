import { prisma } from "@/config";
import { faker } from "@faker-js/faker";
import { Exercise, Sheet, User } from "@prisma/client";
import { createExercise } from "./exercise-factory";
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

export async function createSheetExercise(sheet: Sheet) {
  const exercise = await createExercise();
  return prisma.sheetExercise.create({
    data: {
      sheetId: sheet.id,
      exerciseId: exercise?.id,
      weight: faker.datatype.number(),
      reps: faker.datatype.number(),
      sets: faker.datatype.number(),
    },
  });
}
