import { notFoundError } from "@/errors";
import { forbiddenError } from "@/errors/forbidden-error";
import { objectiveRepository } from "@/repositories";
import { ObjectiveParams } from "@/types";
import { Objective } from "@prisma/client";

async function getObjectiveByUserId(userId: number): Promise<Objective> {
  const objective = await checkIfObjectiveExists(userId);

  return objective;
}

async function createUserObjective({
  userId,
  title,
  currentWeight,
  goalWeight,
}: ObjectiveParams): Promise<Objective> {
  const existingObjective = await objectiveRepository.findObjectiveByUserId(userId);
  if (existingObjective) throw forbiddenError();

  const objective = await objectiveRepository.createUserObjective({
    userId,
    title,
    currentWeight,
    goalWeight,
  });

  return objective;
}

async function updateUserObjective({
  userId,
  title,
  currentWeight,
  goalWeight,
}: ObjectiveParams): Promise<Objective> {
  await checkIfObjectiveExists(userId);

  const objective = await objectiveRepository.updateUserObjective({
    userId,
    title,
    currentWeight,
    goalWeight,
  });

  return objective;
}

async function checkIfObjectiveExists(userId: number): Promise<Objective> {
  const objective = await objectiveRepository.findObjectiveByUserId(userId);

  if (!objective) throw notFoundError();

  return objective;
}

export const objectiveService = {
  getObjectiveByUserId,
  createUserObjective,
  updateUserObjective,
};
