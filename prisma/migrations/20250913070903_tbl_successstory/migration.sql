-- CreateTable
CREATE TABLE "public"."tbl_successstory" (
    "SSID" TEXT NOT NULL,
    "SSFullName" TEXT NOT NULL,
    "designation" TEXT NOT NULL,
    "testimonial" TEXT NOT NULL,
    "Image" TEXT NOT NULL,
    "IsFeatured" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tbl_successstory_pkey" PRIMARY KEY ("SSID")
);
