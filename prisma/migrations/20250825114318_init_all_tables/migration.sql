-- CreateTable
CREATE TABLE "public"."tbl_admin" (
    "id" TEXT NOT NULL,
    "fullname" TEXT,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "phoneNumber" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "status" INTEGER,
    "resetToken" TEXT,
    "resetTokenExpires" TIMESTAMP(3),

    CONSTRAINT "tbl_admin_pkey" PRIMARY KEY ("id")
);

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

-- CreateTable
CREATE TABLE "public"."tbl_cms" (
    "CmsId" TEXT NOT NULL,
    "CmsPageName" TEXT NOT NULL,
    "CmsText" TEXT NOT NULL,

    CONSTRAINT "tbl_cms_pkey" PRIMARY KEY ("CmsId")
);

-- CreateIndex
CREATE UNIQUE INDEX "tbl_admin_email_key" ON "public"."tbl_admin"("email");

-- CreateIndex
CREATE UNIQUE INDEX "tbl_cms_CmsPageName_key" ON "public"."tbl_cms"("CmsPageName");
