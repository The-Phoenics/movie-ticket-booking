/*
  Warnings:

  - A unique constraint covering the columns `[theatreId,movieId]` on the table `TheatreMovie` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "TheatreMovie_movieId_key";

-- DropIndex
DROP INDEX "TheatreMovie_theatreId_key";

-- CreateIndex
CREATE UNIQUE INDEX "TheatreMovie_theatreId_movieId_key" ON "TheatreMovie"("theatreId", "movieId");

-- AddForeignKey
ALTER TABLE "TheatreMovieSeat" ADD CONSTRAINT "TheatreMovieSeat_theatreMovieId_fkey" FOREIGN KEY ("theatreMovieId") REFERENCES "TheatreMovie"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
