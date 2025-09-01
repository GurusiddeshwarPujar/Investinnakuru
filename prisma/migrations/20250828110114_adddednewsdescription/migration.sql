/*
  Warnings:

  - Added the required column `NewsDescription` to the `tbl_news` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."tbl_news" ADD COLUMN     "NewsDescription" TEXT NOT NULL;
