import { Journal } from "@prisma/client";

export type JournalParams = Pick<Journal, "userId" | "text">;
export type JournalBody = Pick<Journal, "text">;
export type JournalIdRouteParams = { journalId: number };
export type JournalUpdateParams = Pick<Journal, "id" | "text">;
