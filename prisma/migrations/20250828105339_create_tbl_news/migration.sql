-- CreateTable
CREATE TABLE "public"."tbl_news" (
    "NewsId" TEXT NOT NULL,
    "CatId" TEXT NOT NULL,
    "NewsTitle" TEXT NOT NULL,
    "NewsURL" TEXT NOT NULL,
    "NewsShortDescription" TEXT NOT NULL,
    "Image" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tbl_news_pkey" PRIMARY KEY ("NewsId")
);

-- CreateIndex
CREATE UNIQUE INDEX "tbl_news_NewsTitle_key" ON "public"."tbl_news"("NewsTitle");

-- AddForeignKey
ALTER TABLE "public"."tbl_news" ADD CONSTRAINT "tbl_news_CatId_fkey" FOREIGN KEY ("CatId") REFERENCES "public"."tbl_category"("CatId") ON DELETE RESTRICT ON UPDATE CASCADE;
