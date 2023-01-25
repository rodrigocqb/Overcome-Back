/*
  Warnings:

  - You are about to alter the column `currentWeight` on the `Objective` table. The data in that column could be lost. The data in that column will be cast from `Decimal` to `Integer`.
  - You are about to alter the column `goalWeight` on the `Objective` table. The data in that column could be lost. The data in that column will be cast from `Decimal` to `Integer`.
  - You are about to alter the column `weight` on the `SheetExercise` table. The data in that column could be lost. The data in that column will be cast from `Decimal` to `Integer`.
  - Made the column `currentWeight` on table `Objective` required. This step will fail if there are existing NULL values in that column.
  - Made the column `goalWeight` on table `Objective` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Objective" ALTER COLUMN "currentWeight" SET NOT NULL,
ALTER COLUMN "currentWeight" SET DATA TYPE INTEGER,
ALTER COLUMN "goalWeight" SET NOT NULL,
ALTER COLUMN "goalWeight" SET DATA TYPE INTEGER;

-- AlterTable
ALTER TABLE "SheetExercise" ALTER COLUMN "weight" SET DEFAULT 0,
ALTER COLUMN "weight" SET DATA TYPE INTEGER;
