import { prisma, redis } from "@/config";
import { Exercise } from "@prisma/client";

async function findExercises() {
  let exercises: Exercise[] = JSON.parse(await redis.get("exercises"));

  if (!exercises) {
    const day = 86400;

    exercises = await prisma.exercise.findMany();

    await redis.set("exercises", JSON.stringify(exercises), {
      EX: day,
    });
  }

  return exercises;
}

async function findExercisesBySearchParam(searchParam: string) {
  return prisma.exercise.findMany({
    where: {
      name: {
        contains: searchParam,
        mode: "insensitive",
      },
    },
    take: 3,
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
  redis.del("exercises");
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
