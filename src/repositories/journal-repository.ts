import { prisma } from "@/config";
import { JournalParams, JournalUpdateParams } from "@/types";

async function findJournalsByUserId(userId: number) {
  return prisma.journal.findMany({
    where: {
      userId,
    },
  });
}

async function findJournalById(journalId: number) {
  return prisma.journal.findFirst({
    where: {
      id: journalId,
    },
  });
}

async function createJournal(data: JournalParams) {
  return prisma.journal.create({
    data,
  });
}

async function updateJournalById({ id, text }: JournalUpdateParams) {
  return prisma.journal.update({
    where: {
      id,
    },
    data: {
      text,
    },
  });
}

export const journalRepository = {
  findJournalsByUserId,
  findJournalById,
  createJournal,
  updateJournalById,
};
