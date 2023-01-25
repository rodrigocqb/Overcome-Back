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
  createExercise,
};
