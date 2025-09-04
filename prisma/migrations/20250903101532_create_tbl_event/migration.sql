-- CreateTable
CREATE TABLE "public"."tbl_event" (
    "EventID" TEXT NOT NULL,
    "EventTitle" TEXT NOT NULL,
    "EventURL" TEXT NOT NULL,
    "Description" TEXT NOT NULL,
    "Featured" BOOLEAN NOT NULL DEFAULT false,
    "EventDate" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tbl_event_pkey" PRIMARY KEY ("EventID")
);

-- CreateIndex
CREATE UNIQUE INDEX "tbl_event_EventTitle_key" ON "public"."tbl_event"("EventTitle");
