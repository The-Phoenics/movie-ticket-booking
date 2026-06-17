/*
  Warnings:

  - A unique constraint covering the columns `[row,col]` on the table `Seat` will be added. If there are existing duplicate values, this will fail.
  - Changed the type of `col` on the `Seat` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `title` to the `Theatre` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Seat_theatreId_key";

-- AlterTable
ALTER TABLE "Seat" DROP COLUMN "col",
ADD COLUMN     "col" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Theatre" ADD COLUMN     "title" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Seat_row_col_key" ON "Seat"("row", "col");

-- AddForeignKey
ALTER TABLE "Seat" ADD CONSTRAINT "Seat_theatreId_fkey" FOREIGN KEY ("theatreId") REFERENCES "Theatre"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
