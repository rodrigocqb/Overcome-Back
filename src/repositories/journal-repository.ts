import { prisma } from "@/config";

async function findJournalsByUserId(userId: number) {
  return prisma.journal.findMany({
    where: {
      userId,
    },
  });
}

export const journalRepository = { findJournalsByUserId };
