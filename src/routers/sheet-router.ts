import { postCreateSheet, postCreateSheetExercises } from "@/controllers";
import { authenticateToken, validateBody } from "@/middlewares";
import { sheetExerciseListBodySchema, sheetSchema } from "@/schemas";
import { Router } from "express";

const sheetRouter = Router();

sheetRouter
  .all("/*", authenticateToken)
  .post("/", validateBody(sheetSchema), postCreateSheet)
  .post(
    "/:sheetId",
    validateBody(sheetExerciseListBodySchema),
    postCreateSheetExercises,
  );

export { sheetRouter };
