import { AuthenticatedRequest } from "@/middlewares";
import { journalService } from "@/services";
import { JournalBody } from "@/types";
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

export async function postCreateJournal(
  req: AuthenticatedRequest,
  res: Response,
) {
  const { userId } = req;
  const { text } = req.body as JournalBody;

  const journal = await journalService.createNewJournal({ userId, text });

  return res.status(httpStatus.CREATED).send(journal);
}

export async function putUpdateJournal(
  req: AuthenticatedRequest,
  res: Response,
) {
  const { userId } = req;
  const { text } = req.body as JournalBody;
  const journalId = Number(req.params.journalId);

  const updatedJournal = await journalService.updateJournalById({
    userId,
    journalId,
    text,
  });

  return res.status(httpStatus.OK).send(updatedJournal);
}
