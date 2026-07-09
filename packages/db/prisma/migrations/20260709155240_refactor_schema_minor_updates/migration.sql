/*
  Warnings:

  - The values [BUSINESS] on the enum `ProfileType` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `theatreMovieSeatId` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `theatreMovieSeatId` on the `Ticket` table. All the data in the column will be lost.
  - You are about to drop the `TheatreMovie` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TheatreMovieSeat` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TheatreMovieSeatReservation` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[theatreId,row,col]` on the table `Seat` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[showSeatId]` on the table `Ticket` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `showSeatId` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `showSeatId` to the `Ticket` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "MOVIE_TAG" AS ENUM ('ACTION', 'ADVENTURE', 'COMEDY', 'CRIME', 'DRAMA', 'DOCUMENTARY', 'FAMILY', 'FANTASY', 'HORROR', 'MUSICAL', 'MYSTERY', 'ROMANCE', 'SCIENCE_FICTION', 'THRILLER', 'WESTERN', 'WAR', 'SUPERHERO', 'MARTIAL_ARTS', 'SPY', 'HEIST', 'ROMANTIC_COMEDY', 'BLACK_COMEDY', 'SATIRE', 'SLAPSTICK', 'FILM_NOIR', 'WHODUNIT', 'DETECTIVE', 'TRUE_CRIME', 'BIOGRAPHY', 'HISTORICAL', 'MELODRAMA', 'COMING_OF_AGE', 'CYBERPUNK', 'SPACE_OPERA', 'DYSTOPIAN', 'STEAMPUNK', 'SLASHER', 'PSYCHOLOGICAL', 'BODY_HORROR', 'ZOMBIE', 'SUPERNATURAL', 'NEO_WESTERN', 'SPAGHETTI_WESTERN', 'EMPIRE_WESTERN');

-- AlterEnum
BEGIN;
CREATE TYPE "ProfileType_new" AS ENUM ('CUSTOMER', 'OWNER', 'ADMIN');
ALTER TABLE "public"."user" ALTER COLUMN "role" DROP DEFAULT;
ALTER TABLE "user" ALTER COLUMN "role" TYPE "ProfileType_new" USING ("role"::text::"ProfileType_new");
ALTER TYPE "ProfileType" RENAME TO "ProfileType_old";
ALTER TYPE "ProfileType_new" RENAME TO "ProfileType";
DROP TYPE "public"."ProfileType_old";
ALTER TABLE "user" ALTER COLUMN "role" SET DEFAULT 'CUSTOMER';
COMMIT;

-- DropForeignKey
ALTER TABLE "Order" DROP CONSTRAINT "Order_theatreMovieSeatId_fkey";

-- DropForeignKey
ALTER TABLE "TheatreMovie" DROP CONSTRAINT "TheatreMovie_movieId_fkey";

-- DropForeignKey
ALTER TABLE "TheatreMovie" DROP CONSTRAINT "TheatreMovie_theatreId_fkey";

-- DropForeignKey
ALTER TABLE "TheatreMovieSeat" DROP CONSTRAINT "TheatreMovieSeat_seatId_fkey";

-- DropForeignKey
ALTER TABLE "TheatreMovieSeat" DROP CONSTRAINT "TheatreMovieSeat_theatreMovieId_fkey";

-- DropForeignKey
ALTER TABLE "TheatreMovieSeatReservation" DROP CONSTRAINT "TheatreMovieSeatReservation_customerId_fkey";

-- DropForeignKey
ALTER TABLE "TheatreMovieSeatReservation" DROP CONSTRAINT "TheatreMovieSeatReservation_theatreMovieSeatId_fkey";

-- DropForeignKey
ALTER TABLE "Ticket" DROP CONSTRAINT "Ticket_theatreMovieSeatId_fkey";

-- DropIndex
DROP INDEX "Order_customerId_key";

-- DropIndex
DROP INDEX "Order_theatreMovieSeatId_key";

-- DropIndex
DROP INDEX "Seat_row_col_key";

-- DropIndex
DROP INDEX "Ticket_theatreMovieSeatId_key";

-- AlterTable
ALTER TABLE "Movie" ADD COLUMN     "tags" "MOVIE_TAG"[];

-- AlterTable
ALTER TABLE "Order" DROP COLUMN "theatreMovieSeatId",
ADD COLUMN     "showSeatId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Ticket" DROP COLUMN "theatreMovieSeatId",
ADD COLUMN     "showSeatId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "user" ADD COLUMN     "isOnboarded" BOOLEAN NOT NULL DEFAULT false;

-- DropTable
DROP TABLE "TheatreMovie";

-- DropTable
DROP TABLE "TheatreMovieSeat";

-- DropTable
DROP TABLE "TheatreMovieSeatReservation";

-- CreateTable
CREATE TABLE "Show" (
    "id" TEXT NOT NULL,
    "theatreId" TEXT NOT NULL,
    "movieId" TEXT NOT NULL,
    "startTime" TIMESTAMP(3) NOT NULL,
    "endTime" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Show_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ShowSeat" (
    "id" TEXT NOT NULL,
    "showId" TEXT NOT NULL,
    "seatId" TEXT NOT NULL,
    "status" "SEAT_STATUS" NOT NULL DEFAULT 'AVAILABLE',
    "price" INTEGER NOT NULL,

    CONSTRAINT "ShowSeat_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ShowSeatReservation" (
    "id" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "showSeatId" TEXT NOT NULL,
    "reservedAt" TIMESTAMP(3) NOT NULL,
    "duration" INTEGER NOT NULL,

    CONSTRAINT "ShowSeatReservation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Show_theatreId_movieId_startTime_key" ON "Show"("theatreId", "movieId", "startTime");

-- CreateIndex
CREATE UNIQUE INDEX "ShowSeat_seatId_showId_key" ON "ShowSeat"("seatId", "showId");

-- CreateIndex
CREATE UNIQUE INDEX "Seat_theatreId_row_col_key" ON "Seat"("theatreId", "row", "col");

-- CreateIndex
CREATE UNIQUE INDEX "Ticket_showSeatId_key" ON "Ticket"("showSeatId");

-- AddForeignKey
ALTER TABLE "Show" ADD CONSTRAINT "Show_theatreId_fkey" FOREIGN KEY ("theatreId") REFERENCES "Theatre"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Show" ADD CONSTRAINT "Show_movieId_fkey" FOREIGN KEY ("movieId") REFERENCES "Movie"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ShowSeat" ADD CONSTRAINT "ShowSeat_showId_fkey" FOREIGN KEY ("showId") REFERENCES "Show"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ShowSeat" ADD CONSTRAINT "ShowSeat_seatId_fkey" FOREIGN KEY ("seatId") REFERENCES "Seat"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ShowSeatReservation" ADD CONSTRAINT "ShowSeatReservation_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ShowSeatReservation" ADD CONSTRAINT "ShowSeatReservation_showSeatId_fkey" FOREIGN KEY ("showSeatId") REFERENCES "ShowSeat"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ticket" ADD CONSTRAINT "Ticket_showSeatId_fkey" FOREIGN KEY ("showSeatId") REFERENCES "ShowSeat"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_showSeatId_fkey" FOREIGN KEY ("showSeatId") REFERENCES "ShowSeat"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
