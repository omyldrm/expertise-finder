-- Additive only: creates the documents table (and the starter Item table used by /api/health).
CREATE TABLE IF NOT EXISTS "employee_document" (
    "id" BIGSERIAL NOT NULL,
    "employeeid" BIGINT NOT NULL,
    "title" VARCHAR NOT NULL,
    "last_reviewed" DATE NOT NULL,
    CONSTRAINT "employee_document_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "employee_document_employeeid_fkey" FOREIGN KEY ("employeeid")
        REFERENCES "fact_employee"("id") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE INDEX IF NOT EXISTS "employee_document_employeeid_idx" ON "employee_document"("employeeid");

CREATE TABLE IF NOT EXISTS "Item" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Item_pkey" PRIMARY KEY ("id")
);

-- Block access through Supabase's public API; the app connects as the table owner.
ALTER TABLE "employee_document" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Item" ENABLE ROW LEVEL SECURITY;
