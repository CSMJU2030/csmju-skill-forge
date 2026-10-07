CREATE TABLE "assessment_attempts" (
    "id" TEXT NOT NULL,
    "student_username" TEXT NOT NULL,
    "career_path_id" TEXT NOT NULL,
    "score" INTEGER NOT NULL,
    "total_questions" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "assessment_attempts_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "assessment_attempts_student_username_career_path_id_created_at_idx"
ON "assessment_attempts"("student_username", "career_path_id", "created_at");

ALTER TABLE "assessment_attempts"
ADD CONSTRAINT "assessment_attempts_career_path_id_fkey"
FOREIGN KEY ("career_path_id") REFERENCES "career_paths"("id")
ON DELETE CASCADE ON UPDATE CASCADE;
