/*
  Warnings:

  - Added the required column `desc` to the `Session` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `Session` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Session" ADD COLUMN     "desc" TEXT NOT NULL,
ADD COLUMN     "name" TEXT NOT NULL;
