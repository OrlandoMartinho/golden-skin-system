/*
  Warnings:

  - You are about to drop the column `username1` on the `Chats` table. All the data in the column will be lost.
  - You are about to drop the column `username2` on the `Chats` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Chats" DROP COLUMN "username1",
DROP COLUMN "username2",
ADD COLUMN     "lastMessage" TEXT,
ADD COLUMN     "lastMessageDate" VARCHAR(45),
ADD COLUMN     "userName1" VARCHAR(255),
ADD COLUMN     "userName2" VARCHAR(255);
