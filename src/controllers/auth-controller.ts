import authService from "@/services/auth-service";
import { UserParams } from "@/types/auth-types";
import { Request, Response } from "express";
import httpStatus from "http-status";

export async function postSignUp(req: Request, res: Response) {
  const { email, name, password } = req.body as UserParams;

  await authService.createUser({ email, name, password });

  return res.sendStatus(httpStatus.CREATED);
}
