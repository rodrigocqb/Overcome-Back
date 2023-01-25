import { exerciseRepository } from "@/repositories";
import { Exercise } from "@prisma/client";

async function getExercisesList(): Promise<Exercise[]> {
  const exercises = await exerciseRepository.findExercises();
  return exercises;
}

export const exerciseService = { getExercisesList };
