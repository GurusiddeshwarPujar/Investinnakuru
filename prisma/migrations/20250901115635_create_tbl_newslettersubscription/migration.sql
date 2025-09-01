/*
  Warnings:

  - You are about to drop the `tbl_newslettersubscription` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "public"."tbl_newslettersubscription";

-- CreateTable
CREATE TABLE "public"."tbl_newslettersubscriber" (
    "NLSubID" TEXT NOT NULL,
    "EmailAddress" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tbl_newslettersubscriber_pkey" PRIMARY KEY ("NLSubID")
);
