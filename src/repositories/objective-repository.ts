import { prisma } from "@/config";
import { ObjectiveParams } from "@/types";

async function findObjectiveByUserId(userId: number) {
  return prisma.objective.findFirst({
    where: {
      userId,
    },
  });
}

async function createUserObjective(data: ObjectiveParams) {
  return prisma.objective.create({
    data,
  });
}

export const objectiveRepository = {
  findObjectiveByUserId,
  createUserObjective,
};
