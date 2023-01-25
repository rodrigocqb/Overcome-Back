import { Sheet } from "@prisma/client";

export type SheetParams = Pick<Sheet, "title" | "userId">;
export type SheetBody = Pick<Sheet, "title">;
