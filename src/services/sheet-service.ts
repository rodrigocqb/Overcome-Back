import { notFoundError } from "@/errors";
import { forbiddenError } from "@/errors/forbidden-error";
import { sheetRepository } from "@/repositories";
import { SheetExerciseBody, SheetExerciseParams, SheetParams } from "@/types";
import { Prisma } from "@prisma/client";

async function createNewSheet({ userId, title }: SheetParams) {
  const sheet = await sheetRepository.createSheet({ userId, title });
  return sheet;
}

async function insertExercisesIntoSheet({
  userId,
  sheetId,
  exerciseBody,
}: InsertExercisesParams): Promise<Prisma.BatchPayload> {
  const sheet = await sheetRepository.findSheetById(sheetId);
  if (!sheet) throw notFoundError();

  if (sheet.userId !== userId) throw forbiddenError();

  const sheetExercises: SheetExerciseParams[] = exerciseBody.map((value) => ({
    ...value,
    sheetId,
  }));

  const insertCount = await sheetRepository.createSheetExercises(
    sheetExercises,
  );
  return insertCount;
}

export const sheetService = { createNewSheet, insertExercisesIntoSheet };

type InsertExercisesParams = {
  userId: number
  sheetId: number;
  exerciseBody: SheetExerciseBody[];
};
