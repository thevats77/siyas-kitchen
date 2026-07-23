-- CreateTable
CREATE TABLE "Order" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "customerName" TEXT,
    "itemsOrdered" TEXT NOT NULL,
    "amount" REAL NOT NULL,
    "source" TEXT NOT NULL,
    "paymentMethod" TEXT NOT NULL,
    "expenseAmount" REAL,
    "expensePaymentMethod" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
