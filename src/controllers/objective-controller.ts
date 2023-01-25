import { AuthenticatedRequest } from "@/middlewares";
import { objectiveService } from "@/services";
import { ObjectiveBodyParams } from "@/types";
import { Response } from "express";
import httpStatus from "http-status";

export async function getObjective(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;

  const objective = await objectiveService.getObjectiveByUserId(userId);

  return res.status(httpStatus.OK).send(objective);
}

export async function postCreateObjective(
  req: AuthenticatedRequest,
  res: Response,
) {
  const { userId } = req;
  const { title, currentWeight, goalWeight } = req.body as ObjectiveBodyParams;

  const objective = await objectiveService.createUserObjective({
    userId,
    title,
    currentWeight,
    goalWeight,
  });

  return res.status(httpStatus.CREATED).send(objective);
}

export async function putUpdateObjective(
  req: AuthenticatedRequest,
  res: Response,
) {
  const { userId } = req;
  const { title, currentWeight, goalWeight } = req.body as ObjectiveBodyParams;

  const objective = await objectiveService.updateUserObjective({
    userId,
    title,
    currentWeight,
    goalWeight,
  });

  return res.status(httpStatus.NO_CONTENT).send(objective);
}
