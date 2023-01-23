import { postSignUp } from "@/controllers";
import { Router } from "express";

const authRouter = Router();

authRouter.post("/sign-up", postSignUp);

export { authRouter };
