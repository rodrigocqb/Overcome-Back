import { WorkoutBody } from "@/types/workout-types";
import { Cardio } from "@prisma/client";
import Joi from "joi";

export const workoutSchema = Joi.object<WorkoutBody>({
  sheetId: Joi.number().integer().positive(),
  cardio: Joi.string().valid(Cardio.CYCLING, Cardio.RUNNING, Cardio.SWIMMING),
});
