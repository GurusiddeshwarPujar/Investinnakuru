/*
  Warnings:

  - A unique constraint covering the columns `[EmailAddress]` on the table `tbl_newslettersubscriber` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "tbl_newslettersubscriber_EmailAddress_key" ON "public"."tbl_newslettersubscriber"("EmailAddress");
