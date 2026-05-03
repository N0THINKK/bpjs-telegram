-- CreateTable
CREATE TABLE "Conversation" (
    "id" TEXT NOT NULL,
    "chatId" TEXT NOT NULL,
    "userName" TEXT,
    "message" TEXT NOT NULL,
    "response" TEXT,
    "category" TEXT,
    "status" TEXT NOT NULL DEFAULT 'active',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Conversation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Conversation_chatId_idx" ON "Conversation"("chatId");

-- CreateIndex
CREATE INDEX "Conversation_createdAt_idx" ON "Conversation"("createdAt");

-- CreateIndex
CREATE INDEX "Conversation_status_idx" ON "Conversation"("status");
