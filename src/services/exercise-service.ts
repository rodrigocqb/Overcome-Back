import { notFoundError } from "@/errors";
import { exerciseRepository } from "@/repositories";
import { Exercise } from "@prisma/client";

async function getExercisesList(): Promise<Exercise[]> {
  const exercises = await exerciseRepository.findExercises();
  return exercises;
}

async function searchExercises(searchParam: string): Promise<Exercise[]> {
  const exercises = await exerciseRepository.findExercisesBySearchParam(
    searchParam,
  );

  if (exercises.length === 0) throw notFoundError();

  return exercises;
}

export const exerciseService = { getExercisesList, searchExercises };
