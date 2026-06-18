/*
  Warnings:

  - You are about to drop the column `reservationTime` on the `TheatreMovieSeat` table. All the data in the column will be lost.
  - You are about to drop the column `reservedAt` on the `TheatreMovieSeat` table. All the data in the column will be lost.
  - You are about to drop the column `reservationTime` on the `TheatreMovieSeatReservation` table. All the data in the column will be lost.
  - Added the required column `duration` to the `TheatreMovieSeatReservation` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "TheatreMovieSeat_theatreMovieId_key";

-- AlterTable
ALTER TABLE "TheatreMovieSeat" DROP COLUMN "reservationTime",
DROP COLUMN "reservedAt";

-- AlterTable
ALTER TABLE "TheatreMovieSeatReservation" DROP COLUMN "reservationTime",
ADD COLUMN     "duration" INTEGER NOT NULL;
