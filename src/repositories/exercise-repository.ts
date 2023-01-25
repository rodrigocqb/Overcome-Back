import { prisma } from "@/config";

async function findExercises() {
  return prisma.exercise.findMany();
}

export const exerciseRepository = { findExercises };
