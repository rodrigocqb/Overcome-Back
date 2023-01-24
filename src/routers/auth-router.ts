import { postOAuth, postSignIn, postSignUp } from "@/controllers";
import { validateBody } from "@/middlewares";
import { oAuthSchema, signInSchema, signUpSchema } from "@/schemas";
import { Router } from "express";

const authRouter = Router();

authRouter
  .post("/sign-up", validateBody(signUpSchema), postSignUp)
  .post("/sign-in", validateBody(signInSchema), postSignIn)
  .post("/oauth", validateBody(oAuthSchema), postOAuth);

export { authRouter };
