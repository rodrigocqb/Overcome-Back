import { postSignIn, postSignUp } from "@/controllers";
import { validateBody } from "@/middlewares";
import { signInSchema, signUpSchema } from "@/schemas";
import { Router } from "express";

const authRouter = Router();

authRouter
  .post("/sign-up", validateBody(signUpSchema), postSignUp)
  .post("/sign-in", validateBody(signInSchema), postSignIn);

export { authRouter };
