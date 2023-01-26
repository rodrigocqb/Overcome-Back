import { badRequestError } from "@/errors";
import { workoutRepository } from "@/repositories";
import { WorkoutBody } from "@/types/workout-types";
import { Sheet, Workout } from "@prisma/client";

async function getWorkoutsByUserId(userId: number): Promise<
  (Workout & {
    Sheet: Sheet;
  })[]
> {
  const workouts = await workoutRepository.findWorkoutsByUserId(userId);
  return workouts;
}

async function createWorkout({
  userId,
  sheetId = null,
  cardio = null,
}: { userId: number } & WorkoutBody) {
  if (!sheetId && !cardio) throw badRequestError();
  if (sheetId && cardio) throw badRequestError();

  const workout = workoutRepository.createWorkout({ userId, sheetId, cardio });

  return workout;
}

export const workoutService = { getWorkoutsByUserId, createWorkout };
