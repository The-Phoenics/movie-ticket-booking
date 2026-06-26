/*
  Warnings:

  - A unique constraint covering the columns `[theatreId,movieId,startTime]` on the table `TheatreMovie` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `customerId` to the `TheatreMovieSeatReservation` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "TheatreMovie_theatreId_movieId_key";

-- DropIndex
DROP INDEX "TheatreMovieSeatReservation_theatreMovieSeatId_key";

-- AlterTable
ALTER TABLE "TheatreMovieSeatReservation" ADD COLUMN     "customerId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "TheatreMovie_theatreId_movieId_startTime_key" ON "TheatreMovie"("theatreId", "movieId", "startTime");

-- AddForeignKey
ALTER TABLE "TheatreMovieSeatReservation" ADD CONSTRAINT "TheatreMovieSeatReservation_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
