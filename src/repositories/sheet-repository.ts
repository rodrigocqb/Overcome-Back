import { prisma } from "@/config";
import { SheetExerciseParams, SheetParams } from "@/types";

async function createSheet(data: SheetParams) {
  return prisma.sheet.create({
    data,
  });
}

async function findSheetById(sheetId: number) {
  return prisma.sheet.findFirst({
    where: {
      id: sheetId,
    },
  });
}

async function createSheetExercises(data: SheetExerciseParams[]) {
  return prisma.sheetExercise.createMany({
    data,
  });
}

export const sheetRepository = {
  createSheet,
  findSheetById,
  createSheetExercises,
};
