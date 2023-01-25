import { prisma } from "@/config";
import { faker } from "@faker-js/faker";

export async function createExercise(name: string | undefined = undefined) {
  return prisma.exercise.create({
    data: {
      name: name || faker.lorem.word(),
    },
  });
}

export function createValidExerciseBody(name: string | undefined = undefined) {
  return {
    name: name || faker.lorem.word(),
  };
}
