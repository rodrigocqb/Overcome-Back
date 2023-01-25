import { AuthenticatedRequest } from "@/middlewares";
import { exerciseService } from "@/services";
import { ExerciseParams } from "@/types";
import { Response } from "express";
import httpStatus from "http-status";

export async function getExercises(req: AuthenticatedRequest, res: Response) {
  const exercises = await exerciseService.getExercisesList();

  return res.status(httpStatus.OK).send(exercises);
}

export async function getExercisesBySearchParam(
  req: AuthenticatedRequest,
  res: Response,
) {
  const { searchParam } = req.params;

  const exercises = await exerciseService.searchExercises(searchParam);

  return res.status(httpStatus.OK).send(exercises);
}

export async function postCreateExercise(
  req: AuthenticatedRequest,
  res: Response,
) {
  const { name } = req.body as ExerciseParams;

  const exercise = await exerciseService.createNewExercise(name);

  return res.status(httpStatus.CREATED).send(exercise);
}
