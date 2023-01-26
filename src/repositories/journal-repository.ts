import { prisma } from "@/config";
import { JournalParams } from "@/types";

async function findJournalsByUserId(userId: number) {
  return prisma.journal.findMany({
    where: {
      userId,
    },
  });
}

async function createJournal(data: JournalParams) {
  return prisma.journal.create({
    data,
  });
}

export const journalRepository = { findJournalsByUserId, createJournal };
