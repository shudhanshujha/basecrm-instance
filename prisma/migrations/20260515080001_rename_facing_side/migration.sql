/*
  Warnings:

  - You are about to drop the column `facingSide` on the `Site` table. All the data in the column will be lost.

*/
-- CreateTable
CREATE TABLE "Expense" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "date" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "category" TEXT NOT NULL,
    "amount" REAL NOT NULL,
    "description" TEXT,
    "paymentMode" TEXT NOT NULL,
    "referenceNumber" TEXT,
    "gstin" TEXT,
    "taxableAmount" REAL,
    "cgstAmount" REAL,
    "sgstAmount" REAL,
    "igstAmount" REAL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Site" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "siteName" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "district" TEXT NOT NULL,
    "state" TEXT NOT NULL DEFAULT 'Haryana',
    "latitude" REAL,
    "longitude" REAL,
    "siteType" TEXT NOT NULL,
    "ownershipType" TEXT NOT NULL,
    "vendorId" TEXT,
    "leaseAmount" REAL,
    "leaseStartDate" DATETIME,
    "leaseEndDate" DATETIME,
    "widthFt" REAL NOT NULL,
    "heightFt" REAL NOT NULL,
    "printingType" TEXT,
    "mountingType" TEXT,
    "illuminated" BOOLEAN NOT NULL DEFAULT false,
    "siteFacing" TEXT,
    "trafficDensity" TEXT,
    "monthlyRate" REAL NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'AVAILABLE',
    "isRecurring" BOOLEAN NOT NULL DEFAULT false,
    "notes" TEXT,
    "photos" TEXT NOT NULL DEFAULT '[]',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Site_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "Vendor" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Site" ("address", "city", "createdAt", "district", "heightFt", "id", "illuminated", "isRecurring", "latitude", "leaseAmount", "leaseEndDate", "leaseStartDate", "longitude", "monthlyRate", "mountingType", "notes", "ownershipType", "photos", "printingType", "siteName", "siteType", "state", "status", "trafficDensity", "updatedAt", "vendorId", "widthFt") SELECT "address", "city", "createdAt", "district", "heightFt", "id", "illuminated", "isRecurring", "latitude", "leaseAmount", "leaseEndDate", "leaseStartDate", "longitude", "monthlyRate", "mountingType", "notes", "ownershipType", "photos", "printingType", "siteName", "siteType", "state", "status", "trafficDensity", "updatedAt", "vendorId", "widthFt" FROM "Site";
DROP TABLE "Site";
ALTER TABLE "new_Site" RENAME TO "Site";
CREATE TABLE "new_Vendor" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "vendorName" TEXT NOT NULL,
    "contactPerson" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT,
    "address" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "gstin" TEXT,
    "panNumber" TEXT,
    "vendorType" TEXT NOT NULL,
    "bankName" TEXT,
    "accountNumber" TEXT,
    "ifscCode" TEXT,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Vendor" ("accountNumber", "address", "bankName", "city", "contactPerson", "createdAt", "email", "gstin", "id", "ifscCode", "notes", "panNumber", "phone", "updatedAt", "vendorName", "vendorType") SELECT "accountNumber", "address", "bankName", "city", "contactPerson", "createdAt", "email", "gstin", "id", "ifscCode", "notes", "panNumber", "phone", "updatedAt", "vendorName", "vendorType" FROM "Vendor";
DROP TABLE "Vendor";
ALTER TABLE "new_Vendor" RENAME TO "Vendor";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
