import { notFoundError, forbiddenError } from "@/errors";
import { sheetRepository } from "@/repositories";
import {
  SheetExerciseBody,
  SheetExerciseParams,
  SheetParams,
  SheetWithExercises,
} from "@/types";
import { Prisma, Sheet } from "@prisma/client";

async function getSheetsByUserId(
  userId: number,
): Promise<SheetWithExercises[]> {
  const sheets = await sheetRepository.findSheetsByUserId(userId);
  return sheets;
}

async function createNewSheet({ userId, title }: SheetParams): Promise<Sheet> {
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

export async function findSheetAndCheckOwnership({
  sheetId,
  userId,
}: FindSheetParams): Promise<Sheet> {
  const sheet = await sheetRepository.findSheetById(sheetId);
  if (!sheet) throw notFoundError();

  if (sheet.userId !== userId) throw forbiddenError();

  return sheet;
}

export const sheetService = {
  getSheetsByUserId,
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
