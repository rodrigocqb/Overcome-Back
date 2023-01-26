import { JournalBody } from "@/types";
import Joi from "joi";

export const journalSchema = Joi.object<JournalBody>({
  text: Joi.string().required()
});
