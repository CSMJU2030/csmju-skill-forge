-- CreateExtension
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- CreateTable
CREATE TABLE "curriculum_plans" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
    "name" TEXT NOT NULL,
    "description" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "curriculum_plans_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "courses" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
    "code" TEXT NOT NULL,
    "name_th" TEXT NOT NULL,
    "name_en" TEXT NOT NULL,
    "credits" INTEGER NOT NULL,
    "category" TEXT NOT NULL,
    "plan_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "courses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "skills" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
    "name" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "description" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "skills_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "course_skills" (
    "course_id" TEXT NOT NULL,
    "skill_id" TEXT NOT NULL,
    "weight" DOUBLE PRECISION NOT NULL DEFAULT 1.0,

    CONSTRAINT "course_skills_pkey" PRIMARY KEY ("course_id","skill_id")
);

-- CreateTable
CREATE TABLE "career_paths" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
    "name" TEXT NOT NULL,
    "description" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "career_paths_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "career_path_skills" (
    "career_path_id" TEXT NOT NULL,
    "skill_id" TEXT NOT NULL,
    "importance_level" INTEGER NOT NULL DEFAULT 3,

    CONSTRAINT "career_path_skills_pkey" PRIMARY KEY ("career_path_id","skill_id")
);

-- CreateTable
CREATE TABLE "assessment_attempts" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
    "student_username" TEXT NOT NULL,
    "career_path_id" TEXT NOT NULL,
    "score" INTEGER NOT NULL,
    "total_questions" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "assessment_attempts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "students" (
    "username" TEXT NOT NULL,
    "target_career_path_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "students_pkey" PRIMARY KEY ("username")
);

-- CreateTable
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

-- CreateTable
CREATE TABLE "grades" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
    "student_username" TEXT NOT NULL,
    "course_id" TEXT NOT NULL,
    "letter_grade" TEXT NOT NULL,
    "semester" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "grades_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "certificates" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
    "name" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "is_free" BOOLEAN NOT NULL DEFAULT true,
    "effort_hours" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "certificates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "certificate_skills" (
    "certificate_id" TEXT NOT NULL,
    "skill_id" TEXT NOT NULL,

    CONSTRAINT "certificate_skills_pkey" PRIMARY KEY ("certificate_id","skill_id")
);

-- CreateTable
CREATE TABLE "project_ideas" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "difficulty" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "project_ideas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "project_idea_skills" (
    "project_idea_id" TEXT NOT NULL,
    "skill_id" TEXT NOT NULL,

    CONSTRAINT "project_idea_skills_pkey" PRIMARY KEY ("project_idea_id","skill_id")
);

-- CreateTable
CREATE TABLE "generated_documents" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
    "student_username" TEXT NOT NULL,
    "doc_type" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content_markdown" TEXT NOT NULL,
    "target_role" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "generated_documents_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "courses_code_key" ON "courses"("code");

-- CreateIndex
CREATE UNIQUE INDEX "skills_name_key" ON "skills"("name");

-- CreateIndex
CREATE UNIQUE INDEX "career_paths_name_key" ON "career_paths"("name");

-- CreateIndex
CREATE INDEX "assessment_attempts_student_username_career_path_id_created_at_idx"
ON "assessment_attempts"("student_username", "career_path_id", "created_at");

-- CreateIndex
CREATE UNIQUE INDEX "grades_student_username_course_id_semester_key"
ON "grades"("student_username", "course_id", "semester");

-- AddForeignKey
ALTER TABLE "courses"
ADD CONSTRAINT "courses_plan_id_fkey"
FOREIGN KEY ("plan_id") REFERENCES "curriculum_plans"("id")
ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "course_skills"
ADD CONSTRAINT "course_skills_course_id_fkey"
FOREIGN KEY ("course_id") REFERENCES "courses"("id")
ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "course_skills"
ADD CONSTRAINT "course_skills_skill_id_fkey"
FOREIGN KEY ("skill_id") REFERENCES "skills"("id")
ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "career_path_skills"
ADD CONSTRAINT "career_path_skills_career_path_id_fkey"
FOREIGN KEY ("career_path_id") REFERENCES "career_paths"("id")
ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "career_path_skills"
ADD CONSTRAINT "career_path_skills_skill_id_fkey"
FOREIGN KEY ("skill_id") REFERENCES "skills"("id")
ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assessment_attempts"
ADD CONSTRAINT "assessment_attempts_career_path_id_fkey"
FOREIGN KEY ("career_path_id") REFERENCES "career_paths"("id")
ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "students"
ADD CONSTRAINT "students_target_career_path_id_fkey"
FOREIGN KEY ("target_career_path_id") REFERENCES "career_paths"("id")
ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "llm_credentials"
ADD CONSTRAINT "llm_credentials_student_username_fkey"
FOREIGN KEY ("student_username") REFERENCES "students"("username")
ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "grades"
ADD CONSTRAINT "grades_student_username_fkey"
FOREIGN KEY ("student_username") REFERENCES "students"("username")
ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "grades"
ADD CONSTRAINT "grades_course_id_fkey"
FOREIGN KEY ("course_id") REFERENCES "courses"("id")
ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "certificate_skills"
ADD CONSTRAINT "certificate_skills_certificate_id_fkey"
FOREIGN KEY ("certificate_id") REFERENCES "certificates"("id")
ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "certificate_skills"
ADD CONSTRAINT "certificate_skills_skill_id_fkey"
FOREIGN KEY ("skill_id") REFERENCES "skills"("id")
ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_idea_skills"
ADD CONSTRAINT "project_idea_skills_project_idea_id_fkey"
FOREIGN KEY ("project_idea_id") REFERENCES "project_ideas"("id")
ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_idea_skills"
ADD CONSTRAINT "project_idea_skills_skill_id_fkey"
FOREIGN KEY ("skill_id") REFERENCES "skills"("id")
ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "generated_documents"
ADD CONSTRAINT "generated_documents_student_username_fkey"
FOREIGN KEY ("student_username") REFERENCES "students"("username")
ON DELETE CASCADE ON UPDATE CASCADE;
