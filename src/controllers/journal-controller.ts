import { AuthenticatedRequest } from "@/middlewares";
import { journalService } from "@/services";
import { Response } from "express";
import httpStatus from "http-status";

export async function getJournalsByUserId(
  req: AuthenticatedRequest,
  res: Response,
) {
  const { userId } = req;

  const journals = await journalService.getJournalsByUserId(userId);

  return res.status(httpStatus.OK).send(journals);
}
