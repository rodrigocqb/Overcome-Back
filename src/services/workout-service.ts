import { badRequestError } from "@/errors";
import { workoutRepository } from "@/repositories";
import { WorkoutBody } from "@/types";
import { Sheet, Workout } from "@prisma/client";
import { findSheetAndCheckOwnership } from "./sheet-service";

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
  validateWorkoutBody({ sheetId, cardio });
  if (sheetId) {
    await findSheetAndCheckOwnership({ sheetId, userId });
  }

  const workout = workoutRepository.createWorkout({ userId, sheetId, cardio });

  return workout;
}

function validateWorkoutBody({ sheetId, cardio }: WorkoutBody): void {
  if ((!sheetId && !cardio) || (sheetId && cardio)) throw badRequestError();
  return;
}

export const workoutService = { getWorkoutsByUserId, createWorkout };
