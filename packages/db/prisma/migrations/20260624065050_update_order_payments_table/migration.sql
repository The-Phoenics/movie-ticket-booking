-- CreateEnum
CREATE TYPE "ORDER_STATUS" AS ENUM ('SUCCESS', 'PENDING', 'FAILED');

-- CreateEnum
CREATE TYPE "PAYMENT_STATUS" AS ENUM ('SUCCESS', 'PENDING', 'FAILED');

-- CreateEnum
CREATE TYPE "CURRENCY" AS ENUM ('USD', 'INR');

-- CreateEnum
CREATE TYPE "PAYMENT_PROVIDER" AS ENUM ('STRIPE');

-- CreateTable
CREATE TABLE "Order" (
    "id" TEXT NOT NULL,
    "status" "ORDER_STATUS" NOT NULL,
    "customerId" TEXT NOT NULL,
    "theatreMovieSeatId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Payment" (
    "id" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "currency" "CURRENCY" NOT NULL,
    "orderId" TEXT NOT NULL,
    "paymentId" TEXT NOT NULL,
    "paymentProvider" "PAYMENT_PROVIDER" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Payment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Order_customerId_key" ON "Order"("customerId");

-- CreateIndex
CREATE UNIQUE INDEX "Order_theatreMovieSeatId_key" ON "Order"("theatreMovieSeatId");

-- CreateIndex
CREATE UNIQUE INDEX "Payment_orderId_key" ON "Payment"("orderId");

-- CreateIndex
CREATE UNIQUE INDEX "Payment_paymentId_key" ON "Payment"("paymentId");

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_theatreMovieSeatId_fkey" FOREIGN KEY ("theatreMovieSeatId") REFERENCES "TheatreMovieSeat"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
