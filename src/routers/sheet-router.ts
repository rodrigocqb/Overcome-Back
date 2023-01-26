import {
  deleteSheetById,
  getSheetsByUserId,
  postCreateSheet,
  putCreateSheetExercises,
} from "@/controllers";
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
  .get("/", getSheetsByUserId)
  .post("/", validateBody(sheetSchema), postCreateSheet)
  .put(
    "/:sheetId",
    validateParams(sheetIdParamsSchema),
    validateBody(sheetExerciseListBodySchema),
    putCreateSheetExercises,
  )
  .delete("/:sheetId", validateParams(sheetIdParamsSchema), deleteSheetById);

export { sheetRouter };
