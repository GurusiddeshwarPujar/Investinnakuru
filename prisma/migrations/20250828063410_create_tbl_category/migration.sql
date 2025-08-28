-- CreateTable
CREATE TABLE "public"."tbl_category" (
    "CatId" TEXT NOT NULL,
    "CatName" TEXT NOT NULL,
    "CatURL" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tbl_category_pkey" PRIMARY KEY ("CatId")
);

-- CreateIndex
CREATE UNIQUE INDEX "tbl_category_CatName_key" ON "public"."tbl_category"("CatName");
