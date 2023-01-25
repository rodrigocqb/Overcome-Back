import { sheetRepository } from "@/repositories";
import { SheetParams } from "@/types";

async function createNewSheet({ userId, title }: SheetParams) {
  const sheet = await sheetRepository.createSheet({ userId, title });
  return sheet;
}

export const sheetService = { createNewSheet };
