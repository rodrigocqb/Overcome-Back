import { SignUpParams } from "@/types/auth-types";
import Joi from "joi";

export const signUpSchema = Joi.object<SignUpParams>({
  email: Joi.string().email().required(),
  name: Joi.string().required(),
  password: Joi.string().required(),
});
