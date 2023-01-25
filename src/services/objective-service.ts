import { notFoundError } from "@/errors";
import { objectiveRepository } from "@/repositories";
import { ObjectiveParams } from "@/types";
import { Objective } from "@prisma/client";

async function getObjectiveByUserId(userId: number): Promise<Objective> {
  const objective = await objectiveRepository.findObjectiveByUserId(userId);

  if (!objective) throw notFoundError();

  return objective;
}

async function createUserObjective({
  userId,
  title,
  currentWeight,
  goalWeight,
}: ObjectiveParams): Promise<Objective> {
  const objective = await objectiveRepository.createUserObjective({
    userId,
    title,
    currentWeight,
    goalWeight,
  });

  return objective;
}

export const objectiveService = { getObjectiveByUserId, createUserObjective };
