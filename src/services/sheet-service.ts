import { notFoundError } from "@/errors";
import { forbiddenError } from "@/errors/forbidden-error";
import { sheetRepository } from "@/repositories";
import { SheetExerciseBody, SheetExerciseParams, SheetParams } from "@/types";
import { Prisma, Sheet } from "@prisma/client";

async function getSheetsByUserId(userId: number): Promise<
  {
    title: string;
    userId: number;
    createdAt: Date;
    updatedAt: Date;
    SheetExercise: {
      Exercise: {
        id: number;
        name: string;
      };
    }[];
    id: number;
  }[]
> {
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

async function findSheetAndCheckOwnership({
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
