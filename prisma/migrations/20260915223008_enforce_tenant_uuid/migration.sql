/*
  Warnings:

  - Changed the type of `tenant_id` on the `subscriptions` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "subscriptions" DROP COLUMN "tenant_id",
ADD COLUMN     "tenant_id" UUID NOT NULL;

-- CreateIndex
CREATE INDEX "subscriptions_tenant_id_idx" ON "subscriptions"("tenant_id");
