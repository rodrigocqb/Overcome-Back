import { getExercises, getExercisesBySearchParam } from "@/controllers";
import { authenticateToken, validateParams } from "@/middlewares";
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
  );

export { exerciseRouter };
