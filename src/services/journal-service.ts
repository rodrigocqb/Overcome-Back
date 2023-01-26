import { forbiddenError, notFoundError } from "@/errors";
import { journalRepository } from "@/repositories";
import { JournalParams } from "@/types";
import { Journal } from "@prisma/client";

async function getJournalsByUserId(userId: number): Promise<Journal[]> {
  const journals = await journalRepository.findJournalsByUserId(userId);
  return journals;
}

async function createNewJournal({
  userId,
  text,
}: JournalParams): Promise<Journal> {
  const journal = await journalRepository.createJournal({ userId, text });
  return journal;
}

async function updateJournalById({
  userId,
  text,
  journalId,
}: UpdateJournalServiceParams): Promise<Journal> {
  await findJournalAndCheckOwnership({ userId, journalId });

  const updatedJournal = await journalRepository.updateJournalById({
    id: journalId,
    text,
  });
  return updatedJournal;
}

async function deleteJournalById({
  journalId,
  userId,
}: FindJournalParams): Promise<void> {
  await findJournalAndCheckOwnership({ journalId, userId });

  await journalRepository.deleteJournalById(journalId);
  return;
}

async function findJournalAndCheckOwnership({
  journalId,
  userId,
}: FindJournalParams): Promise<Journal> {
  const journal = await journalRepository.findJournalById(journalId);
  if (!journal) throw notFoundError();

  if (journal.userId !== userId) throw forbiddenError();

  return journal;
}

export const journalService = {
  getJournalsByUserId,
  createNewJournal,
  updateJournalById,
  deleteJournalById,
};

type UpdateJournalServiceParams = {
  userId: number;
  text: string;
  journalId: number;
};

type FindJournalParams = {
  journalId: number;
  userId: number;
};
