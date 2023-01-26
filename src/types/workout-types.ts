import { Cardio } from "@prisma/client";

export type WorkoutParams = {
  userId: number;
  sheetId?: number | null;
  cardio?: Cardio | null;
};

export type WorkoutBody = Omit<WorkoutParams, "userId">;
