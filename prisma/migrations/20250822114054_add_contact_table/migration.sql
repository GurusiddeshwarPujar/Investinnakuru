-- CreateTable
CREATE TABLE "public"."tbl_contact" (
    "ContactId" TEXT NOT NULL,
    "ContactName" TEXT NOT NULL,
    "ContactEmail" TEXT NOT NULL,
    "ContactPhoneNumber" TEXT NOT NULL,
    "ContactSubject" TEXT NOT NULL,
    "ContactMessage" TEXT NOT NULL,
    "ContactDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tbl_contact_pkey" PRIMARY KEY ("ContactId")
);
