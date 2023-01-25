import { prisma } from "@/config";

async function findObjectiveByUserId(userId: number) {
  return prisma.objective.findFirst({
    where: {
      userId,
    }
  });
}

export const objectiveRepository = { findObjectiveByUserId };
