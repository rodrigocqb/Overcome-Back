import { journalRepository } from "@/repositories";
import { Journal } from "@prisma/client";

async function getJournalsByUserId(userId: number): Promise<Journal[]> {
  const journals = await journalRepository.findJournalsByUserId(userId);
  return journals;
}

export const journalService = { getJournalsByUserId };
