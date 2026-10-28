-- CreateEnum
CREATE TYPE "admin_action_type" AS ENUM ('BAN_USER', 'WARN_USER', 'SEND_MESSAGE_USER', 'SEND_MESSAGE_STORE', 'SUSPEND_STORE', 'VERIFY_STORE', 'CHANGE_PLAN_USER', 'CHANGE_PLAN_STORE', 'FORCE_PASSWORD_RESET');

-- CreateEnum
CREATE TYPE "admin_action_entity_type" AS ENUM ('USER', 'STORE', 'OTHER');

-- CreateTable
CREATE TABLE "sessions" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "device" VARCHAR(255),
    "ip" VARCHAR(45),
    "location" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "admin_action_logs" (
    "id" TEXT NOT NULL,
    "admin_id" TEXT NOT NULL,
    "action" "admin_action_type" NOT NULL,
    "entity_type" "admin_action_entity_type" NOT NULL,
    "entity_id" TEXT,
    "details" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "admin_action_logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "sessions_user_id_idx" ON "sessions"("user_id");

-- CreateIndex
CREATE INDEX "admin_action_logs_admin_id_idx" ON "admin_action_logs"("admin_id");

-- CreateIndex
CREATE INDEX "admin_action_logs_entity_type_idx" ON "admin_action_logs"("entity_type");

-- AddForeignKey
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "admin_action_logs" ADD CONSTRAINT "admin_action_logs_admin_id_fkey" FOREIGN KEY ("admin_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
