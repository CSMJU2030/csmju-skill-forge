export interface Envelope<T> {
  success: boolean;
  data: T;
  meta: Record<string, unknown>;
  error?: { status_code: number; message: string };
}

export interface Identity {
  username: string;
  layer1_role: 'student' | 'alumni' | 'staff' | 'admin';
  faculty: string;
}

export interface Skill {
  id: string;
  name: string;
  category: string;
  description?: string | null;
}

export interface CareerPath {
  id: string;
  name: string;
  description?: string | null;
  skills: { skill: Skill; importance_level: number }[];
}

export interface AssessmentAttempt {
  id: string;
  career_path_id: string;
  score: number;
  total_questions: number;
  created_at: string;
  career_path?: { name: string };
}

export interface CourseSkillLink {
  skill_id: string;
  weight: number;
  skill: Skill;
}

export interface Course {
  id: string;
  code: string;
  name_th: string;
  name_en: string;
  credits: number;
  category: string;
  plan_id?: string | null;
  course_skills?: CourseSkillLink[];
}

export interface Student {
  username: string;
  target_career_path_id: string | null;
  target_career_path: CareerPath | null;
}

export interface Grade {
  id: string;
  course_id: string;
  letter_grade: string;
  semester: string;
  course: Course;
}

export interface SkillGapEntry {
  skill_id: string;
  skill_name: string;
  category: string;
  importance_level: number;
  proficiency_score: number;
  readiness_percent: number;
  status: 'strength' | 'developing' | 'gap';
  contributing_courses: { code: string; name_en: string; letter_grade: string }[];
}

export interface SkillGapResult {
  career_path_id: string;
  career_path_name: string;
  overall_readiness_percent: number;
  strengths: SkillGapEntry[];
  gaps: SkillGapEntry[];
  developing: SkillGapEntry[];
}

export interface RoadmapMilestone {
  skill_id: string;
  skill_name: string;
  readiness_percent: number;
  importance_level: number;
  recommended_courses: { code: string; name_en: string; name_th: string }[];
  recommended_certificates: { name: string; provider: string; url: string; effort_hours: number | null }[];
  recommended_projects: { title: string; description: string; difficulty: string }[];
}

export interface Roadmap {
  career_path_name: string;
  overall_readiness_percent: number;
  milestones: RoadmapMilestone[];
}

export interface Certificate {
  id: string;
  name: string;
  provider: string;
  url: string;
  is_free: boolean;
  effort_hours: number | null;
  skills: { skill: Skill }[];
}

export interface ProjectIdea {
  id: string;
  title: string;
  description: string;
  difficulty: string;
  skills: { skill: Skill }[];
}

export interface GeneratedDocument {
  id: string;
  doc_type: 'resume' | 'cover_letter' | 'portfolio';
  title: string;
  content_markdown: string;
  target_role: string | null;
  created_at: string;
}
