import { postSignUp } from "@/controllers";
import { validateBody } from "@/middlewares";
import { signUpSchema } from "@/schemas";
import { Router } from "express";

const authRouter = Router();

authRouter.post("/sign-up", validateBody(signUpSchema), postSignUp);

export { authRouter };
