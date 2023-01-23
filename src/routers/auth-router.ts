import { postSignUp } from "@/controllers";
import { validateBody } from "@/middlewares";
import { userSchema } from "@/schemas";
import { Router } from "express";

const authRouter = Router();

authRouter.post("/sign-up", validateBody(userSchema), postSignUp);

export { authRouter };
