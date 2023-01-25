import {
  getExercises,
  getExercisesBySearchParam,
  postCreateExercise,
} from "@/controllers";
import { authenticateToken, validateBody, validateParams } from "@/middlewares";
import { exerciseSchema } from "@/schemas";
import { Router } from "express";

const exerciseRouter = Router();

exerciseRouter
  .all("/*", authenticateToken)
  .get("/", getExercises)
  .get(
    "/:searchParam",
    validateParams(exerciseSchema),
    getExercisesBySearchParam,
  )
  .post("/", validateBody(exerciseSchema), postCreateExercise);

export { exerciseRouter };
