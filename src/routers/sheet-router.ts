import { postCreateSheet, putCreateSheetExercises } from "@/controllers";
import { authenticateToken, validateBody, validateParams } from "@/middlewares";
import {
  sheetExerciseListBodySchema,
  sheetIdParamsSchema,
  sheetSchema,
} from "@/schemas";
import { Router } from "express";

const sheetRouter = Router();

sheetRouter
  .all("/*", authenticateToken)
  .post("/", validateBody(sheetSchema), postCreateSheet)
  .put(
    "/:sheetId",
    validateParams(sheetIdParamsSchema),
    validateBody(sheetExerciseListBodySchema),
    putCreateSheetExercises,
  );

export { sheetRouter };
