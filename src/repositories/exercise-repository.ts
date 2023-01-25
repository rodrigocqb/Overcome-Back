import { prisma } from "@/config";

async function findExercises() {
  return prisma.exercise.findMany();
}

async function findExercisesBySearchParam(searchParam: string) {
  return prisma.exercise.findMany({
    where: {
      name: {
        contains: searchParam,
        mode: "insensitive",
      },
    },
    take: 4,
  });
}

async function findExerciseByName(name: string) {
  return prisma.exercise.findFirst({
    where: {
      name: {
        equals: name,
        mode: "insensitive",
      },
    },
  });
}

async function createExercise(name: string) {
  return prisma.exercise.create({
    data: {
      name,
    },
  });
}

export const exerciseRepository = {
  findExercises,
  findExercisesBySearchParam,
  findExerciseByName,
  createExercise,
};
