/*
  Warnings:

  - A unique constraint covering the columns `[linkedTransactionId]` on the table `Transaction` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Transaction" DROP CONSTRAINT "Transaction_categoryId_fkey";

-- AlterTable
ALTER TABLE "Transaction" ADD COLUMN     "linkedTransactionId" INTEGER,
ALTER COLUMN "categoryId" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Transaction_linkedTransactionId_key" ON "Transaction"("linkedTransactionId");

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_linkedTransactionId_fkey" FOREIGN KEY ("linkedTransactionId") REFERENCES "Transaction"("id") ON DELETE SET NULL ON UPDATE CASCADE;
