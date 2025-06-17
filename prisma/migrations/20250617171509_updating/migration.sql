/*
  Warnings:

  - A unique constraint covering the columns `[idUser]` on the table `Carts` will be added. If there are existing duplicate values, this will fail.
  - Made the column `createdIn` on table `Appointments` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Appointments" ALTER COLUMN "createdIn" SET NOT NULL;

-- AlterTable
ALTER TABLE "Carts" ADD COLUMN     "createdIn" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP;

-- CreateIndex
CREATE UNIQUE INDEX "Carts_idUser_key" ON "Carts"("idUser");
