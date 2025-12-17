/*
  Warnings:

  - A unique constraint covering the columns `[CmsSlug]` on the table `tbl_cms` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `CmsSlug` to the `tbl_cms` table without a default value. This is not possible if the table is not empty.
  - Added the required column `UpdatedAt` to the `tbl_cms` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."tbl_cms" ADD COLUMN     "CmsSlug" TEXT NOT NULL,
ADD COLUMN     "CreatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "UpdatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "public"."tbl_news" ADD COLUMN     "IsFeatured" BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex
CREATE UNIQUE INDEX "tbl_cms_CmsSlug_key" ON "public"."tbl_cms"("CmsSlug");
