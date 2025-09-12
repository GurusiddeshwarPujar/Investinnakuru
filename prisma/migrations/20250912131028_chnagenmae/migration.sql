/*
  Warnings:

  - You are about to drop the column `BannnerTitle` on the `tbl_banner` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."tbl_banner" DROP COLUMN "BannnerTitle",
ADD COLUMN     "BannerTitle" TEXT;
