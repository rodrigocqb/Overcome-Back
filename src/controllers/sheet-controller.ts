import { AuthenticatedRequest } from "@/middlewares";
import { sheetService } from "@/services";
import { SheetBody } from "@/types";
import { Response } from "express";
import httpStatus from "http-status";

export async function postCreateSheet(
  req: AuthenticatedRequest,
  res: Response,
) {
  const { userId } = req;
  const { title } = req.body as SheetBody;

  const sheet = await sheetService.createNewSheet({ userId, title });

  return res.status(httpStatus.CREATED).send(sheet);
}
