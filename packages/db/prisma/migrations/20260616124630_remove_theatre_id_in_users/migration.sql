/*
  Warnings:

  - You are about to drop the column `theatreId` on the `user` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "user_theatreId_key";

-- AlterTable
ALTER TABLE "user" DROP COLUMN "theatreId";
