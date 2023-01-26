import { AuthenticatedRequest } from "@/middlewares";
import { sheetService } from "@/services";
import { SheetBody, SheetExerciseBody } from "@/types";
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

export async function putCreateSheetExercises(
  req: AuthenticatedRequest,
  res: Response,
) {
  const { userId } = req;
  const sheetId = Number(req.params.sheetId);
  const { exerciseBody } = req.body as { exerciseBody: SheetExerciseBody[] };

  const insertCount = await sheetService.insertExercisesIntoSheet({
    sheetId,
    exerciseBody,
    userId,
  });

  return res.status(httpStatus.OK).send(insertCount);
}

export async function deleteSheetById(
  req: AuthenticatedRequest,
  res: Response,
) {
  const { userId } = req;
  const sheetId = Number(req.params.sheetId);

  await sheetService.deleteSheetById({ sheetId, userId });

  return res.sendStatus(httpStatus.NO_CONTENT);
}
