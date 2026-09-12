-- Also supports existing installations of the original PostgreSQL backend.
-- No existing state is replaced or removed.
CREATE TABLE IF NOT EXISTS "dna_genetics_state" (
    "id" INTEGER NOT NULL,
    "data" JSONB NOT NULL,
    CONSTRAINT "dna_genetics_state_pkey" PRIMARY KEY ("id")
);
