/*
  Warnings:

  - You are about to drop the `tbl_event` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterTable
ALTER TABLE "public"."tbl_banner" ADD COLUMN     "BannnerTitle" TEXT;

-- DropTable
DROP TABLE "public"."tbl_event";
