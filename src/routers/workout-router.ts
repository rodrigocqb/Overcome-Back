import { getWorkoutsByUserId, postCreateWorkout } from "@/controllers";
import { authenticateToken, validateBody } from "@/middlewares";
import { workoutSchema } from "@/schemas";
import { Router } from "express";

const workoutRouter = Router();

workoutRouter
  .all("/*", authenticateToken)
  .get("/", getWorkoutsByUserId)
  .post("/", validateBody(workoutSchema), postCreateWorkout);

export { workoutRouter };
