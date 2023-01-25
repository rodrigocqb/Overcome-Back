import { conflictError, notFoundError } from "@/errors";
import { exerciseRepository } from "@/repositories";
import { Exercise } from "@prisma/client";

async function getExerciseList(): Promise<Exercise[]> {
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

async function createNewExercise(name: string): Promise<Exercise> {
  const exercise = await exerciseRepository.findExerciseByName(name);
  if (exercise) throw conflictError();

  const newExercise = await exerciseRepository.createExercise(name);

  return newExercise;
}

export const exerciseService = {
  getExerciseList,
  searchExercises,
  createNewExercise,
};
