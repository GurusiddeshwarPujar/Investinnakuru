-- CreateTable
CREATE TABLE "public"."tbl_newslettersubscription" (
    "NLSubID" TEXT NOT NULL,
    "EmailAddress" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tbl_newslettersubscription_pkey" PRIMARY KEY ("NLSubID")
);
