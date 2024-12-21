-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Report" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "shopName" TEXT,
    "rating" INTEGER NOT NULL,
    "comment" TEXT NOT NULL,
    "link" TEXT,
    "dateYYYYMMDD" TEXT NOT NULL,
    "imgUrl" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    CONSTRAINT "Report_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Report" ("comment", "dateYYYYMMDD", "id", "imgUrl", "link", "name", "rating", "userId") SELECT "comment", "dateYYYYMMDD", "id", "imgUrl", "link", "name", "rating", "userId" FROM "Report";
DROP TABLE "Report";
ALTER TABLE "new_Report" RENAME TO "Report";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
