/*
  Warnings:

  - A unique constraint covering the columns `[NewsURL]` on the table `tbl_news` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "tbl_news_NewsURL_key" ON "public"."tbl_news"("NewsURL");
