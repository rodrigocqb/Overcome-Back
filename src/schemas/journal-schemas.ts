import { JournalBody, JournalIdRouteParams } from "@/types";
import Joi from "joi";

export const journalSchema = Joi.object<JournalBody>({
  text: Joi.string().required(),
});

export const journalParamsSchema = Joi.object<JournalIdRouteParams>({
  journalId: Joi.number().integer().positive().required(),
});
