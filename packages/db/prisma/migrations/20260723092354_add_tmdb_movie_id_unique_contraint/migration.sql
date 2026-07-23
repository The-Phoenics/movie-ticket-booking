/*
  Warnings:

  - The values [USD] on the enum `CURRENCY` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `crew` on the `Movie` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `Movie` table. All the data in the column will be lost.
  - You are about to drop the column `rating` on the `Movie` table. All the data in the column will be lost.
  - You are about to drop the column `tags` on the `Movie` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[tmdbMovieId]` on the table `Movie` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `adult` to the `Movie` table without a default value. This is not possible if the table is not empty.
  - Added the required column `genres` to the `Movie` table without a default value. This is not possible if the table is not empty.
  - Added the required column `img` to the `Movie` table without a default value. This is not possible if the table is not empty.
  - Added the required column `original_language` to the `Movie` table without a default value. This is not possible if the table is not empty.
  - Added the required column `overview` to the `Movie` table without a default value. This is not possible if the table is not empty.
  - Added the required column `popularity` to the `Movie` table without a default value. This is not possible if the table is not empty.
  - Added the required column `release_date` to the `Movie` table without a default value. This is not possible if the table is not empty.
  - Added the required column `status` to the `Movie` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tagline` to the `Movie` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tmdbMovieId` to the `Movie` table without a default value. This is not possible if the table is not empty.
  - Added the required column `vote_average` to the `Movie` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Region" AS ENUM ('MUMBAI', 'DELHI_NCR', 'BENGALURU', 'HYDERABAD', 'CHANDIGARH', 'AHEMDABAD', 'PUNE', 'CHENNAI', 'KOLKATA', 'KOCHI');

-- AlterEnum
BEGIN;
CREATE TYPE "CURRENCY_new" AS ENUM ('INR');
ALTER TABLE "Payment" ALTER COLUMN "currency" TYPE "CURRENCY_new" USING ("currency"::text::"CURRENCY_new");
ALTER TYPE "CURRENCY" RENAME TO "CURRENCY_old";
ALTER TYPE "CURRENCY_new" RENAME TO "CURRENCY";
DROP TYPE "public"."CURRENCY_old";
COMMIT;

-- AlterTable
ALTER TABLE "Movie" DROP COLUMN "crew",
DROP COLUMN "description",
DROP COLUMN "rating",
DROP COLUMN "tags",
ADD COLUMN     "adult" BOOLEAN NOT NULL,
ADD COLUMN     "genres" JSONB NOT NULL,
ADD COLUMN     "img" TEXT NOT NULL,
ADD COLUMN     "original_language" TEXT NOT NULL,
ADD COLUMN     "overview" TEXT NOT NULL,
ADD COLUMN     "popularity" INTEGER NOT NULL,
ADD COLUMN     "release_date" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "status" TEXT NOT NULL,
ADD COLUMN     "tagline" TEXT NOT NULL,
ADD COLUMN     "tmdbMovieId" INTEGER NOT NULL,
ADD COLUMN     "vote_average" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Movie_tmdbMovieId_key" ON "Movie"("tmdbMovieId");
