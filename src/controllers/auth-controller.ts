import { authService } from "@/services";
import { SignInParams, SignUpParams } from "@/types";
import { Request, Response } from "express";
import httpStatus from "http-status";

export async function postSignUp(req: Request, res: Response) {
  const { email, name, password } = req.body as SignUpParams;

  await authService.createUser({ email, name, password });

  return res.sendStatus(httpStatus.CREATED);
}

export async function postSignIn(req: Request, res: Response) {
  const { email, password } = req.body as SignInParams;

  const sessionData = await authService.signUserIn({ email, password });

  return res.status(httpStatus.OK).send(sessionData);
}
