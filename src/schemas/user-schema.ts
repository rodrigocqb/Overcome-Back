import { SignInParams, SignUpParams } from "@/types/auth-types";
import Joi from "joi";

export const signUpSchema = Joi.object<SignUpParams>({
  email: Joi.string().email().required(),
  name: Joi.string().required(),
  password: Joi.string().required(),
});

export const signInSchema = Joi.object<SignInParams>({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});
