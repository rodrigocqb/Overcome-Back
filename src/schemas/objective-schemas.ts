import { ObjectiveBodyParams } from "@/types";
import Joi from "joi";

export const objectiveSchema = Joi.object<ObjectiveBodyParams>({
  title: Joi.string(),
  currentWeight: Joi.number().positive(),
  goalWeight: Joi.number().positive(),
});
