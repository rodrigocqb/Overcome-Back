import { AuthenticatedRequest } from "@/middlewares";
import { objectiveService } from "@/services";
import { Response } from "express";
import httpStatus from "http-status";

export async function getObjective(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;

  const objective = await objectiveService.getObjectiveByUserId(userId);

  return res.status(httpStatus.OK).send(objective);
}
