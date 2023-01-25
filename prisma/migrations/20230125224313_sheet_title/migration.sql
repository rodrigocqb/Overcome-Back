/*
  Warnings:

  - Added the required column `title` to the `Sheet` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Sheet" ADD COLUMN     "title" VARCHAR(255) NOT NULL;
