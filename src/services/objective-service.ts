import { notFoundError } from "@/errors";
import { objectiveRepository } from "@/repositories";
import { Objective } from "@prisma/client";

async function getObjectiveByUserId(userId: number): Promise<Objective> {
  const objective = await objectiveRepository.findObjectiveByUserId(userId);

  if (!objective) throw notFoundError();

  return objective;
}

export const objectiveService = { getObjectiveByUserId };
