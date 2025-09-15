/*
  Warnings:

  - You are about to drop the `tbl_successstory` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "public"."tbl_successstory";

-- CreateTable
CREATE TABLE "public"."tbl_testimonial" (
    "TID" TEXT NOT NULL,
    "TFullName" TEXT NOT NULL,
    "designation" TEXT NOT NULL,
    "testimonial" TEXT NOT NULL,
    "Image" TEXT NOT NULL,
    "IsFeatured" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tbl_testimonial_pkey" PRIMARY KEY ("TID")
);
