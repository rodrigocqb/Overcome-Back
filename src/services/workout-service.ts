import { workoutRepository } from "@/repositories";
import { Sheet, Workout } from "@prisma/client";

async function getWorkoutsByUserId(userId: number): Promise<
  (Workout & {
    Sheet: Sheet;
  })[]
> {
  const workouts = await workoutRepository.findWorkoutsByUserId(userId);
  return workouts;
}

export const workoutService = { getWorkoutsByUserId };
