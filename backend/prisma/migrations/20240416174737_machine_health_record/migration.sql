-- CreateTable
CREATE TABLE "machine_health_records" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "machine_type" TEXT NOT NULL,
    "partType" TEXT NOT NULL,
    "value" REAL NOT NULL
);

-- CreateIndex
CREATE INDEX "machine_health_records_machine_type_partType_idx" ON "machine_health_records"("machine_type", "partType");
