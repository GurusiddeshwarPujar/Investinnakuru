/*
  Warnings:

  - Added the required column `Image` to the `tbl_category` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."tbl_category" ADD COLUMN     "Image" TEXT NOT NULL;
