import { prisma } from "@/config";

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

export const workoutRepository = { findWorkoutsByUserId };
