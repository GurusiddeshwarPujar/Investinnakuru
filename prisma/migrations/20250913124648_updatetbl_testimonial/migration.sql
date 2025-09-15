/*
  Warnings:

  - You are about to drop the column `IsFeatured` on the `tbl_testimonial` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."tbl_testimonial" DROP COLUMN "IsFeatured",
ADD COLUMN     "Featured" BOOLEAN NOT NULL DEFAULT false;
