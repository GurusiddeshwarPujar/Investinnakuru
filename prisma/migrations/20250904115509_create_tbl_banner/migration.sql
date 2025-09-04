-- CreateTable
CREATE TABLE "public"."tbl_banner" (
    "BannerID" TEXT NOT NULL,
    "BannerImage" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tbl_banner_pkey" PRIMARY KEY ("BannerID")
);
