import { Exercise } from "@prisma/client";

export type ExerciseParams = Pick<Exercise, "name">;
