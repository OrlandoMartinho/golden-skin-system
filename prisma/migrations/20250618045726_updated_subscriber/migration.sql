/*
  Warnings:

  - Added the required column `status` to the `Subscribers` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Subscribers" ADD COLUMN     "planName" VARCHAR(255),
ADD COLUMN     "status" BOOLEAN NOT NULL;
