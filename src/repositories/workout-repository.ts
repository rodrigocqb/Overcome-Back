import { prisma } from "@/config";
import { WorkoutParams } from "@/types";

async function findWorkoutsByUserId(userId: number) {
  return prisma.workout.findMany({
    where: {
      userId,
    },
    include: {
      Sheet: true,
    },
    orderBy: [{
      createdAt: "desc",
    }],
  });
}

async function createWorkout(data: WorkoutParams) {
  return prisma.workout.create({
    data,
  });
}

export const workoutRepository = { findWorkoutsByUserId, createWorkout };
