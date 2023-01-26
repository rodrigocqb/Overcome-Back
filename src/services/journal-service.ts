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

export const journalService = { getJournalsByUserId, createNewJournal };
