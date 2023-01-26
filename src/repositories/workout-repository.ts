import { prisma } from "@/config";
import { WorkoutParams } from "@/types/workout-types";

async function findWorkoutsByUserId(userId: number) {
  return prisma.workout.findMany({
    where: {
      userId,
    },
    include: {
      Sheet: true,
    },
    take: 10,
  });
}

async function createWorkout(data: WorkoutParams) {
  return prisma.workout.create({
    data,
  });
}

export const workoutRepository = { findWorkoutsByUserId, createWorkout };
