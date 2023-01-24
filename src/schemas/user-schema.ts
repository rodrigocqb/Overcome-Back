import { UserParams } from "@/types/auth-types";
import Joi from "joi";

export const userSchema = Joi.object<UserParams>({
  email: Joi.string().email().required(),
  name: Joi.string().required(),
  password: Joi.string().required(),
});
