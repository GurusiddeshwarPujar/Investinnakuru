-- AlterTable
ALTER TABLE "public"."tbl_admin" ADD COLUMN     "resetToken" TEXT,
ADD COLUMN     "resetTokenExpires" TIMESTAMP(3);
