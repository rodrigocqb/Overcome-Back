import { prisma } from "@/config";
import { WorkoutBody } from "@/types";

export async function createWorkout({
  userId,
  sheetId = null,
  cardio = null,
}: { userId: number } & WorkoutBody) {
  return prisma.workout.create({
    data: {
      userId,
      sheetId,
      cardio,
    },
  });
}
