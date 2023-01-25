import { prisma } from "@/config";
import { SheetParams } from "@/types";

async function createSheet(data: SheetParams) {
  return prisma.sheet.create({
    data,
  });
}

export const sheetRepository = { createSheet };
