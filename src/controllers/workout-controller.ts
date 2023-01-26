import { AuthenticatedRequest } from "@/middlewares";
import { workoutService } from "@/services";
import { WorkoutBody } from "@/types";
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

export async function postCreateWorkout(
  req: AuthenticatedRequest,
  res: Response,
) {
  const { userId } = req;
  const workoutBody = req.body as WorkoutBody;

  const workout = await workoutService.createWorkout({
    userId,
    ...workoutBody,
  });

  return res.status(httpStatus.CREATED).send(workout);
}
