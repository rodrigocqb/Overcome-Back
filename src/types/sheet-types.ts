import { Sheet, SheetExercise } from "@prisma/client";

export type SheetParams = Pick<Sheet, "title" | "userId">;
export type SheetBody = Pick<Sheet, "title">;
export type SheetExerciseParams = Omit<
  SheetExercise,
  "id" | "createdAt" | "updatedAt"
>;
export type SheetExerciseBody = Omit<SheetExerciseParams, "sheetId">;
export type SheetWithExercises = {
  title: string;
  id: number;
  createdAt: Date;
  updatedAt: Date;
  userId: number;
  SheetExercise: {
      weight: number;
      reps: number;
      sets: number;
      Exercise: {
          id: number;
          name: string;
      };
  }[];
};
