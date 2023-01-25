import { ExerciseParams } from "@/types";
import Joi from "joi";

export const exerciseSchema = Joi.object<ExerciseParams>({
  name: Joi.string().required(),
});
