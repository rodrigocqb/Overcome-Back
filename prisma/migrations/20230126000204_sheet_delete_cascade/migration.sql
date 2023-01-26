-- DropForeignKey
ALTER TABLE "SheetExercise" DROP CONSTRAINT "SheetExercise_sheetId_fkey";

-- DropForeignKey
ALTER TABLE "Workout" DROP CONSTRAINT "Workout_sheetId_fkey";

-- AddForeignKey
ALTER TABLE "SheetExercise" ADD CONSTRAINT "SheetExercise_sheetId_fkey" FOREIGN KEY ("sheetId") REFERENCES "Sheet"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Workout" ADD CONSTRAINT "Workout_sheetId_fkey" FOREIGN KEY ("sheetId") REFERENCES "Sheet"("id") ON DELETE CASCADE ON UPDATE CASCADE;
