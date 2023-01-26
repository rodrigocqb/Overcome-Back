import { AuthenticatedRequest } from "@/middlewares";
import { workoutService } from "@/services";
import { Response } from "express";
import httpStatus from "http-status";

export async function getWorkoutsByUserId(
  req: AuthenticatedRequest,
  res: Response,
) {
  const { userId } = req;

  const workouts = await workoutService.getWorkoutsByUserId(userId);

  return res.status(httpStatus.OK).send(workouts);
}
