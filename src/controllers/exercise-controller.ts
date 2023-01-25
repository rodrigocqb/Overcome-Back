import { AuthenticatedRequest } from "@/middlewares";
import { exerciseService } from "@/services";
import { Response } from "express";
import httpStatus from "http-status";

export async function getExercises(req: AuthenticatedRequest, res: Response) {
  const exercises = await exerciseService.getExercisesList();

  return res.status(httpStatus.OK).send(exercises);
}
