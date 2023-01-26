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
  await findSheetAndCheckOwnership({ sheetId, userId });

  const sheetExercises: SheetExerciseParams[] = exerciseBody.map((value) => ({
    ...value,
    sheetId,
  }));

  const insertCount = await sheetRepository.createSheetExercises(
    sheetExercises,
  );
  return insertCount;
}

async function deleteSheetById({
  sheetId,
  userId,
}: FindSheetParams): Promise<void> {
  await findSheetAndCheckOwnership({ sheetId, userId });

  await sheetRepository.deleteSheetById(sheetId);
  return;
}

async function findSheetAndCheckOwnership({
  sheetId,
  userId,
}: FindSheetParams) {
  const sheet = await sheetRepository.findSheetById(sheetId);
  if (!sheet) throw notFoundError();

  if (sheet.userId !== userId) throw forbiddenError();

  return sheet;
}

export const sheetService = {
  createNewSheet,
  insertExercisesIntoSheet,
  deleteSheetById,
};

type FindSheetParams = {
  sheetId: number;
  userId: number;
};

type InsertExercisesParams = {
  userId: number;
  sheetId: number;
  exerciseBody: SheetExerciseBody[];
};
