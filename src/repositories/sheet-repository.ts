import { prisma } from "@/config";
import { SheetExerciseParams, SheetParams } from "@/types";

async function findSheetsByUserId(userId: number) {
  return prisma.sheet.findMany({
    where: {
      userId,
    },
    orderBy: [{
      createdAt: "desc",
    }],
    select: {
      id: true,
      title: true,
      userId: true,
      createdAt: true,
      updatedAt: true,
      SheetExercise: {
        select: {
          sets: true,
          reps: true,
          weight: true,
          Exercise: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
    },
  });
}

async function findSheetById(sheetId: number) {
  return prisma.sheet.findFirst({
    where: {
      id: sheetId,
    },
  });
}

async function createSheet(data: SheetParams) {
  return prisma.sheet.create({
    data,
  });
}

async function createSheetExercises(data: SheetExerciseParams[]) {
  return prisma.sheetExercise.createMany({
    data,
  });
}

async function deleteSheetById(id: number) {
  return prisma.sheet.delete({
    where: {
      id,
    },
  });
}

export const sheetRepository = {
  findSheetsByUserId,
  findSheetById,
  createSheet,
  createSheetExercises,
  deleteSheetById,
};
