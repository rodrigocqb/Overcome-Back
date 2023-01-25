import { SheetBody } from "@/types";
import Joi from "joi";

export const sheetSchema = Joi.object<SheetBody>({
  title: Joi.string().required(),
});
