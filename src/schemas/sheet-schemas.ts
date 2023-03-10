import { SheetBody, SheetExerciseBody } from "@/types";
import Joi from "joi";

export const sheetSchema = Joi.object<SheetBody>({
  title: Joi.string().required(),
});

type SheetIdParams = { sheetId: number };
export const sheetIdParamsSchema = Joi.object<SheetIdParams>({
  sheetId: Joi.number().integer().positive().required(),
});

const sheetExerciseSchema = Joi.object<SheetExerciseBody>({
  exerciseId: Joi.number().required(),
  weight: Joi.number(),
  reps: Joi.number().required(),
  sets: Joi.number().required(),
});

export const sheetExerciseListBodySchema = Joi.object<{
  exerciseBody: SheetExerciseBody[];
}>({
  exerciseBody: Joi.array<SheetExerciseBody[]>()
    .items(sheetExerciseSchema)
    .required(),
});
