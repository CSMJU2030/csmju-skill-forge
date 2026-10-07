CREATE TABLE "llm_credentials" (
    "student_username" TEXT NOT NULL,
    "base_url" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "encrypted_key" TEXT NOT NULL,
    "retention_mode" TEXT NOT NULL,
    "expires_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "llm_credentials_pkey" PRIMARY KEY ("student_username")
);

ALTER TABLE "llm_credentials"
ADD CONSTRAINT "llm_credentials_student_username_fkey"
FOREIGN KEY ("student_username") REFERENCES "students"("username")
ON DELETE CASCADE ON UPDATE CASCADE;
