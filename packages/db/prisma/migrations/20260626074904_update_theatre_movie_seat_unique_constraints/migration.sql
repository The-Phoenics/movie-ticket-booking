/*
  Warnings:

  - A unique constraint covering the columns `[seatId,theatreMovieId]` on the table `TheatreMovieSeat` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "TheatreMovieSeat_seatId_key";

-- CreateIndex
CREATE UNIQUE INDEX "TheatreMovieSeat_seatId_theatreMovieId_key" ON "TheatreMovieSeat"("seatId", "theatreMovieId");
