// Seed data for csmju-skillforge.
// Curriculum reflects Plan 2 (Software Engineering / Security track). Career paths
// cover the common roles a CS undergrad actually applies for — general software
// roles first, then the more specialized security/cloud tracks — so the picker
// on the dashboard is never empty or narrow.

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // ---------- Skills ----------
  const skillDefs = [
    { name: 'Linux Administration', category: 'devops' },
    { name: 'Networking Fundamentals', category: 'networking' },
    { name: 'Cloud Platforms (AWS/Azure/GCP)', category: 'cloud' },
    { name: 'Containers & Orchestration', category: 'devops' },
    { name: 'CI/CD Pipelines', category: 'devops' },
    { name: 'Infrastructure as Code', category: 'devops' },
    { name: 'Application Security', category: 'security' },
    { name: 'Cryptography', category: 'security' },
    { name: 'Security Monitoring & Incident Response', category: 'security' },
    { name: 'Identity & Access Management', category: 'security' },
    { name: 'Scripting (Python/Bash)', category: 'programming' },
    { name: 'Object-Oriented Programming', category: 'programming' },
    { name: 'Database Design', category: 'programming' },
    { name: 'Software Engineering Practices', category: 'programming' },
    { name: 'Web Application Development', category: 'programming' },
    { name: 'Frontend Frameworks & UI Engineering', category: 'programming' },
    { name: 'Backend API Design', category: 'programming' },
    { name: 'Mobile App Development', category: 'programming' },
    { name: 'Data Engineering & ETL', category: 'data' },
    { name: 'Machine Learning Fundamentals', category: 'data' },
    { name: 'Software Testing & QA', category: 'programming' },
  ];
  const skills: Record<string, string> = {};
  for (const s of skillDefs) {
    const created = await prisma.skill.upsert({ where: { name: s.name }, update: {}, create: s });
    skills[s.name] = created.id;
  }

  // ---------- Curriculum plan & courses ----------
  // Official curriculum (หลักสูตรปรับปรุง 2565), Plan 2 — Software Engineering &
  // Security track, exactly as registered by the department (see the uploaded
  // course list). Gen-ed / free-elective courses have no skill_weights: they
  // don't map to a career-path skill, so they simply don't move the gap-analysis
  // needle, same as in real life.
  const plan = await prisma.curriculumPlan.upsert({
    where: { id: 'plan-2-seed-fixed-id-000000000000' },
    update: { name: 'หลักสูตรวิทยาการคอมพิวเตอร์ ปรับปรุง 2565 (แผน 2 - Software Engineering & Security)' },
    create: {
      id: 'plan-2-seed-fixed-id-000000000000',
      name: 'หลักสูตรวิทยาการคอมพิวเตอร์ ปรับปรุง 2565 (แผน 2 - Software Engineering & Security)',
      description: 'Computer Science curriculum, revised 2565, Plan 2 (OOP + Cryptography/Network Security track).',
    },
  });

  const courseDefs: {
    code: string; name_th: string; name_en: string; credits: number; category: string;
    skillWeights: [string, number][];
  }[] = [
    { code: '10100214', name_th: 'เกษตรเพื่อชีวิต', name_en: 'Agriculture for Life', credits: 3, category: 'free_elective', skillWeights: [] },
    { code: '10301111', name_th: 'การเขียนโปรแกรมเบื้องต้น', name_en: 'Introduction to Programming', credits: 3, category: 'core',
      skillWeights: [['Object-Oriented Programming', 0.3], ['Scripting (Python/Bash)', 0.3]] },
    { code: '10301112', name_th: 'เทคโนโลยีสารสนเทศและการสื่อสาร', name_en: 'Information and Communication Technology', credits: 3, category: 'general_ed', skillWeights: [] },
    { code: '10305108', name_th: 'แคลคูลัสสำหรับวิทยาศาสตร์และเทคโนโลยี', name_en: 'Calculus for Science and Technology', credits: 3, category: 'core', skillWeights: [] },
    { code: '10700301', name_th: 'ภาษาไทยเพื่อการนำเสนอ', name_en: 'Thai for Presentation', credits: 3, category: 'general_ed', skillWeights: [] },
    { code: '10700308', name_th: 'ภาษาอังกฤษในชีวิตประจำวัน', name_en: 'English in Daily Life', credits: 3, category: 'general_ed', skillWeights: [] },
    { code: '50375', name_th: 'มาตรฐานด้าน Information and Communication Technology (T)', name_en: 'ICT Standard (T)', credits: 0, category: 'general_ed', skillWeights: [] },
    { code: '10301113', name_th: 'คณิตศาสตร์ดีสครีต', name_en: 'Discrete Mathematics', credits: 3, category: 'core', skillWeights: [] },
    { code: '10301114', name_th: 'องค์ประกอบและสถาปัตยกรรมคอมพิวเตอร์', name_en: 'Computer Organization and Architecture', credits: 3, category: 'core', skillWeights: [] },
    { code: '10301141', name_th: 'เครือข่ายคอมพิวเตอร์เบื้องต้น', name_en: 'Introduction to Computer Networks', credits: 3, category: 'core',
      skillWeights: [['Networking Fundamentals', 1]] },
    { code: '10301212', name_th: 'การเขียนโปรแกรมและทักษะการแก้ปัญหา', name_en: 'Programming and Problem Solving Skills', credits: 3, category: 'core',
      skillWeights: [['Object-Oriented Programming', 0.4], ['Scripting (Python/Bash)', 0.3]] },
    { code: '10700309', name_th: 'สนทนาภาษาอังกฤษ', name_en: 'English Conversation', credits: 3, category: 'general_ed', skillWeights: [] },
    { code: '10800114', name_th: 'ความฉลาดทางดิจิทัล', name_en: 'Digital Intelligence', credits: 3, category: 'general_ed', skillWeights: [] },
    { code: '10301211', name_th: 'คณิตศาสตร์สำหรับวิทยาการคอมพิวเตอร์', name_en: 'Mathematics for Computer Science', credits: 3, category: 'core', skillWeights: [] },
    { code: '10301222', name_th: 'โครงสร้างข้อมูลและอัลกอริทึม', name_en: 'Data Structures and Algorithms', credits: 3, category: 'core',
      skillWeights: [['Object-Oriented Programming', 0.5], ['Software Engineering Practices', 0.3]] },
    { code: '10301223', name_th: 'ฐานข้อมูลโครงสร้างเชิงสัมพันธ์', name_en: 'Relational Database', credits: 3, category: 'core',
      skillWeights: [['Database Design', 1]] },
    { code: '10301225', name_th: 'วิศวกรรมซอฟต์แวร์', name_en: 'Software Engineering', credits: 3, category: 'core',
      skillWeights: [['Software Engineering Practices', 1], ['Backend API Design', 0.4]] },
    { code: '10301231', name_th: 'เว็บเทคโนโลยี', name_en: 'Web Technology', credits: 3, category: 'core',
      skillWeights: [['Web Application Development', 1], ['Frontend Frameworks & UI Engineering', 0.6], ['Backend API Design', 0.3]] },
    { code: '10700313', name_th: 'ภาษาอังกฤษเชิงวิทยาศาสตร์และนวัตกรรม', name_en: 'English for Science and Innovation', credits: 3, category: 'general_ed', skillWeights: [] },
    { code: '10301221', name_th: 'การวิเคราะห์และออกแบบเชิงวัตถุ', name_en: 'Object-Oriented Analysis and Design', credits: 3, category: 'core',
      skillWeights: [['Object-Oriented Programming', 0.6], ['Software Engineering Practices', 0.4]] },
    { code: '10301224', name_th: 'ฐานข้อมูลแบบไม่มีโครงสร้าง', name_en: 'NoSQL Database', credits: 3, category: 'major_elective',
      skillWeights: [['Database Design', 0.6], ['Data Engineering & ETL', 0.4]] },
    { code: '10301232', name_th: 'การพัฒนาระบบฝั่งเซิร์ฟเวอร์', name_en: 'Server-Side Development', credits: 3, category: 'core',
      skillWeights: [['Backend API Design', 1], ['Database Design', 0.3]] },
    { code: '10301233', name_th: 'การพัฒนาซอฟต์แวร์บนอุปกรณ์เคลื่อนที่', name_en: 'Mobile Software Development', credits: 3, category: 'core',
      skillWeights: [['Mobile App Development', 1]] },
    { code: '10304205', name_th: 'ความน่าจะเป็นและสถิติ', name_en: 'Probability and Statistics', credits: 3, category: 'core',
      skillWeights: [['Machine Learning Fundamentals', 0.3], ['Data Engineering & ETL', 0.2]] },
    { code: '10700105', name_th: 'มนุษย์ สังคม เทคโนโลยีและสิ่งแวดล้อม', name_en: 'Human, Society, Technology and Environment', credits: 3, category: 'general_ed', skillWeights: [] },
    { code: '10100410', name_th: 'พืชทะเลทราย', name_en: 'Desert Plants', credits: 3, category: 'free_elective', skillWeights: [] },
    { code: '10300413', name_th: 'วิทยาศาสตร์รอบตัวในศตวรรษที่ 21', name_en: 'Science Around Us in the 21st Century', credits: 3, category: 'free_elective', skillWeights: [] },
    { code: '10301314', name_th: 'หลักการเขียนโปรแกรมเชิงวัตถุ', name_en: 'Principles of Object-Oriented Programming', credits: 3, category: 'major_elective',
      skillWeights: [['Object-Oriented Programming', 1]] },
    { code: '10301341', name_th: 'การเข้ารหัสและความปลอดภัยในเครือข่าย', name_en: 'Cryptography and Network Security', credits: 3, category: 'major_elective',
      skillWeights: [['Cryptography', 0.7], ['Application Security', 0.5], ['Networking Fundamentals', 0.3]] },
    { code: '10301385', name_th: 'ระบบบริหารสารสนเทศเพื่อการจัดการ', name_en: 'Management Information System', credits: 3, category: 'major_elective',
      skillWeights: [['Software Engineering Practices', 0.3], ['Database Design', 0.3]] },
    { code: '10301391', name_th: 'หัวข้อพิเศษทางวิทยาการคอมพิวเตอร์ 1', name_en: 'Special Topics in Computer Science 1', credits: 3, category: 'major_elective',
      skillWeights: [['Cloud Platforms (AWS/Azure/GCP)', 0.3], ['Containers & Orchestration', 0.3]] },
    { code: '10700320', name_th: 'ภาษาอังกฤษเพื่อการศึกษาต่อและการประกอบอาชีพ', name_en: 'English for Further Study and Career', credits: 3, category: 'general_ed', skillWeights: [] },
  ];

  const courseIdByCode: Record<string, string> = {};
  for (const c of courseDefs) {
    const created = await prisma.course.upsert({
      where: { code: c.code },
      update: { name_th: c.name_th, name_en: c.name_en, credits: c.credits, category: c.category, plan_id: plan.id },
      create: { code: c.code, name_th: c.name_th, name_en: c.name_en, credits: c.credits, category: c.category, plan_id: plan.id },
    });
    courseIdByCode[c.code] = created.id;
    for (const [skillName, weight] of c.skillWeights) {
      await prisma.courseSkill.upsert({
        where: { course_id_skill_id: { course_id: created.id, skill_id: skills[skillName] } },
        update: { weight },
        create: { course_id: created.id, skill_id: skills[skillName], weight },
      });
    }
  }

  // ---------- Career paths: broad Computer Science roles first ----------
  const careerPathDefs: { name: string; description: string; skills: [string, number][] }[] = [
    {
      name: 'Software Engineer',
      description: 'Designs, builds, and maintains software systems end to end — the broadest, most common first job for CS graduates.',
      skills: [
        ['Object-Oriented Programming', 5], ['Software Engineering Practices', 5],
        ['Database Design', 4], ['Web Application Development', 3],
        ['Backend API Design', 4], ['Scripting (Python/Bash)', 3],
      ],
    },
    {
      name: 'Backend Developer',
      description: 'Builds the APIs, services, and data layer behind an application.',
      skills: [
        ['Backend API Design', 5], ['Database Design', 5], ['Object-Oriented Programming', 4],
        ['Cloud Platforms (AWS/Azure/GCP)', 3], ['Software Engineering Practices', 3], ['Scripting (Python/Bash)', 3],
      ],
    },
    {
      name: 'Frontend Developer',
      description: 'Builds the user-facing interface — component architecture, state, accessibility, performance.',
      skills: [
        ['Frontend Frameworks & UI Engineering', 5], ['Web Application Development', 5],
        ['Object-Oriented Programming', 3], ['Software Engineering Practices', 3],
      ],
    },
    {
      name: 'Full-Stack Web Developer',
      description: 'Comfortable across the whole stack: UI, API, and database.',
      skills: [
        ['Frontend Frameworks & UI Engineering', 4], ['Backend API Design', 4], ['Web Application Development', 4],
        ['Database Design', 4], ['Software Engineering Practices', 3], ['Cloud Platforms (AWS/Azure/GCP)', 2],
      ],
    },
    {
      name: 'Mobile App Developer',
      description: 'Builds native or cross-platform mobile applications.',
      skills: [
        ['Mobile App Development', 5], ['Object-Oriented Programming', 4],
        ['Software Engineering Practices', 3], ['Database Design', 2], ['Backend API Design', 2],
      ],
    },
    {
      name: 'Data Engineer',
      description: 'Builds the pipelines that move and shape data for analytics and ML.',
      skills: [
        ['Data Engineering & ETL', 5], ['Database Design', 5], ['Scripting (Python/Bash)', 4],
        ['Cloud Platforms (AWS/Azure/GCP)', 4], ['Software Engineering Practices', 2],
      ],
    },
    {
      name: 'Machine Learning Engineer',
      description: 'Builds and ships ML models into production systems.',
      skills: [
        ['Machine Learning Fundamentals', 5], ['Scripting (Python/Bash)', 5], ['Data Engineering & ETL', 3],
        ['Database Design', 2], ['Cloud Platforms (AWS/Azure/GCP)', 3],
      ],
    },
    {
      name: 'QA / Test Engineer',
      description: 'Owns product quality — test strategy, automation, and release confidence.',
      skills: [
        ['Software Testing & QA', 5], ['Scripting (Python/Bash)', 4], ['CI/CD Pipelines', 3],
        ['Web Application Development', 2], ['Software Engineering Practices', 3],
      ],
    },
    {
      name: 'Database Administrator',
      description: 'Keeps production databases fast, available, and backed up.',
      skills: [
        ['Database Design', 5], ['Linux Administration', 4], ['Scripting (Python/Bash)', 3],
        ['Cloud Platforms (AWS/Azure/GCP)', 3], ['Identity & Access Management', 2],
      ],
    },
    {
      name: 'Cybersecurity Analyst',
      description: 'Monitors, detects, and responds to security threats.',
      skills: [
        ['Application Security', 4], ['Security Monitoring & Incident Response', 5], ['Networking Fundamentals', 4],
        ['Cryptography', 3], ['Identity & Access Management', 4],
      ],
    },
    {
      name: 'Cloud Platform Engineer',
      description: 'Designs and operates scalable cloud infrastructure.',
      skills: [
        ['Cloud Platforms (AWS/Azure/GCP)', 5], ['Containers & Orchestration', 5], ['Infrastructure as Code', 5],
        ['Networking Fundamentals', 4], ['Linux Administration', 4], ['CI/CD Pipelines', 3], ['Scripting (Python/Bash)', 4],
      ],
    },
    {
      name: 'DevSecOps Engineer',
      description: 'Builds and secures the delivery pipeline: cloud infra, CI/CD, IAM, and security monitoring baked into every release.',
      skills: [
        ['Linux Administration', 5], ['Networking Fundamentals', 4], ['Cloud Platforms (AWS/Azure/GCP)', 5],
        ['Containers & Orchestration', 5], ['CI/CD Pipelines', 5], ['Infrastructure as Code', 4],
        ['Application Security', 4], ['Cryptography', 3], ['Security Monitoring & Incident Response', 4],
        ['Identity & Access Management', 4], ['Scripting (Python/Bash)', 5], ['Software Engineering Practices', 3],
      ],
    },
  ];

  for (const cp of careerPathDefs) {
    const created = await prisma.careerPath.upsert({
      where: { name: cp.name },
      update: { description: cp.description },
      create: { name: cp.name, description: cp.description },
    });
    for (const [skillName, importance] of cp.skills) {
      await prisma.careerPathSkill.upsert({
        where: { career_path_id_skill_id: { career_path_id: created.id, skill_id: skills[skillName] } },
        update: { importance_level: importance },
        create: { career_path_id: created.id, skill_id: skills[skillName], importance_level: importance },
      });
    }
  }

  // ---------- Free certificates ----------
  const certDefs: { name: string; provider: string; url: string; effort_hours: number; skills: string[] }[] = [
    { name: 'AWS Certified Cloud Practitioner (Skill Builder prep)', provider: 'AWS Skill Builder', url: 'https://skillbuilder.aws/', effort_hours: 20, skills: ['Cloud Platforms (AWS/Azure/GCP)'] },
    { name: 'Kubernetes and Cloud Native Associate (KCNA) prep', provider: 'Linux Foundation', url: 'https://training.linuxfoundation.org/', effort_hours: 25, skills: ['Containers & Orchestration', 'Cloud Platforms (AWS/Azure/GCP)'] },
    { name: 'GitHub Actions', provider: 'GitHub Skills', url: 'https://skills.github.com/', effort_hours: 6, skills: ['CI/CD Pipelines'] },
    { name: 'Introduction to Terraform', provider: 'HashiCorp Learn', url: 'https://developer.hashicorp.com/terraform/tutorials', effort_hours: 10, skills: ['Infrastructure as Code'] },
    { name: 'Google Cybersecurity Certificate (audit track)', provider: 'Coursera (audit for free)', url: 'https://www.coursera.org/professional-certificates/google-cybersecurity', effort_hours: 40, skills: ['Application Security', 'Security Monitoring & Incident Response'] },
    { name: 'Introduction to Cybersecurity', provider: 'Cisco Networking Academy', url: 'https://www.netacad.com/courses/cybersecurity', effort_hours: 15, skills: ['Application Security', 'Networking Fundamentals'] },
    { name: 'Linux Command Line Basics', provider: 'freeCodeCamp', url: 'https://www.freecodecamp.org/', effort_hours: 8, skills: ['Linux Administration', 'Scripting (Python/Bash)'] },
    { name: 'Python for Everybody', provider: 'py4e.com (free)', url: 'https://www.py4e.com/', effort_hours: 30, skills: ['Scripting (Python/Bash)'] },
    { name: 'IAM Fundamentals', provider: 'AWS Skill Builder', url: 'https://skillbuilder.aws/', effort_hours: 5, skills: ['Identity & Access Management'] },
    { name: 'Applied Cryptography', provider: 'Khan Academy', url: 'https://www.khanacademy.org/computing/computer-science/cryptography', effort_hours: 12, skills: ['Cryptography'] },
    { name: 'Responsive Web Design', provider: 'freeCodeCamp', url: 'https://www.freecodecamp.org/learn/2022/responsive-web-design/', effort_hours: 20, skills: ['Web Application Development', 'Frontend Frameworks & UI Engineering'] },
    { name: 'Front End Development Libraries (React)', provider: 'freeCodeCamp', url: 'https://www.freecodecamp.org/learn/front-end-development-libraries/', effort_hours: 25, skills: ['Frontend Frameworks & UI Engineering'] },
    { name: 'Back End Development and APIs', provider: 'freeCodeCamp', url: 'https://www.freecodecamp.org/learn/back-end-development-and-apis/', effort_hours: 25, skills: ['Backend API Design'] },
    { name: 'Relational Database (SQL)', provider: 'freeCodeCamp', url: 'https://www.freecodecamp.org/learn/relational-database/', effort_hours: 15, skills: ['Database Design'] },
    { name: 'Google Data Analytics Certificate (audit track)', provider: 'Coursera (audit for free)', url: 'https://www.coursera.org/professional-certificates/google-data-analytics', effort_hours: 40, skills: ['Data Engineering & ETL'] },
    { name: 'Machine Learning Crash Course', provider: 'Google Developers', url: 'https://developers.google.com/machine-learning/crash-course', effort_hours: 15, skills: ['Machine Learning Fundamentals'] },
    { name: 'Software Testing Fundamentals', provider: 'Test Automation University', url: 'https://testautomationu.applitools.com/', effort_hours: 10, skills: ['Software Testing & QA'] },
    { name: 'Kotlin / Android Basics', provider: 'Google Developers (Android Basics)', url: 'https://developer.android.com/courses', effort_hours: 20, skills: ['Mobile App Development'] },
  ];
  // certificates/project ideas have no natural unique key, so clear them first —
  // otherwise every re-run of the seed would duplicate them.
  await prisma.certificateSkill.deleteMany();
  await prisma.certificate.deleteMany();
  for (const c of certDefs) {
    const created = await prisma.certificate.create({ data: { name: c.name, provider: c.provider, url: c.url, is_free: true, effort_hours: c.effort_hours } });
    for (const skillName of c.skills) {
      await prisma.certificateSkill.create({ data: { certificate_id: created.id, skill_id: skills[skillName] } });
    }
  }

  // ---------- Portfolio project ideas ----------
  const projectDefs: { title: string; description: string; difficulty: string; skills: string[] }[] = [
    { title: 'CI/CD pipeline with security gates', description: 'Stand up a GitHub Actions pipeline for a small web app that runs lint, tests, a container build, and a SAST scan before deploy.', difficulty: 'intermediate', skills: ['CI/CD Pipelines', 'Application Security', 'Containers & Orchestration'] },
    { title: 'Infrastructure-as-Code sandbox on AWS free tier', description: 'Provision a VPC, EC2 instance, and IAM roles with least-privilege access using Terraform, documented with a README and architecture diagram.', difficulty: 'intermediate', skills: ['Infrastructure as Code', 'Cloud Platforms (AWS/Azure/GCP)', 'Identity & Access Management'] },
    { title: 'Kubernetes home-lab deployment', description: 'Deploy a multi-service app to a local k3s/minikube cluster with health checks and rolling updates.', difficulty: 'advanced', skills: ['Containers & Orchestration', 'Linux Administration'] },
    { title: 'Log-based intrusion detection dashboard', description: 'Ship sample application logs into an ELK/Grafana stack and build alert rules for suspicious login patterns.', difficulty: 'advanced', skills: ['Security Monitoring & Incident Response', 'Networking Fundamentals'] },
    { title: 'Encrypted file-sharing CLI', description: 'Build a Python CLI that encrypts/decrypts files with AES-GCM and manages keys safely, with unit tests.', difficulty: 'beginner', skills: ['Cryptography', 'Scripting (Python/Bash)'] },
    { title: 'Full-stack task manager (Next.js + REST API)', description: 'A CRUD app with auth-free demo mode, a documented REST API, and a polished UI — the single best portfolio piece for full-stack roles.', difficulty: 'intermediate', skills: ['Frontend Frameworks & UI Engineering', 'Backend API Design', 'Database Design'] },
    { title: 'Component library with Storybook', description: 'Build 8-10 reusable, accessible UI components with documented props and visual states.', difficulty: 'beginner', skills: ['Frontend Frameworks & UI Engineering', 'Web Application Development'] },
    { title: 'Public REST API with OpenAPI docs', description: 'Design and document a REST API (pagination, auth stub, error envelope) with auto-generated OpenAPI/Swagger docs.', difficulty: 'intermediate', skills: ['Backend API Design', 'Database Design'] },
    { title: 'Cross-platform expense tracker app', description: 'A mobile app (React Native/Flutter) with local storage, categorized spending, and simple charts.', difficulty: 'intermediate', skills: ['Mobile App Development'] },
    { title: 'ETL pipeline for a public dataset', description: 'Extract a public dataset (e.g. open government data), clean and load it into a warehouse, and schedule it with a simple orchestrator.', difficulty: 'intermediate', skills: ['Data Engineering & ETL', 'Database Design'] },
    { title: 'ML model with a served prediction API', description: 'Train a small classifier, wrap it in a REST endpoint, and document accuracy/limitations honestly.', difficulty: 'advanced', skills: ['Machine Learning Fundamentals', 'Backend API Design'] },
    { title: 'End-to-end test suite for a sample app', description: 'Write an automated test suite (unit + E2E with Playwright/Cypress) for an existing open-source or demo app, wired into CI.', difficulty: 'beginner', skills: ['Software Testing & QA', 'CI/CD Pipelines'] },
    { title: 'Database performance tuning case study', description: 'Take a slow sample query/schema, profile it, add indexes, and document the before/after with real numbers.', difficulty: 'intermediate', skills: ['Database Design', 'Linux Administration'] },
  ];
  await prisma.projectIdeaSkill.deleteMany();
  await prisma.projectIdea.deleteMany();
  for (const p of projectDefs) {
    const created = await prisma.projectIdea.create({ data: { title: p.title, description: p.description, difficulty: p.difficulty } });
    for (const skillName of p.skills) {
      await prisma.projectIdeaSkill.create({ data: { project_idea_id: created.id, skill_id: skills[skillName] } });
    }
  }

  console.log(`Seed complete: ${Object.keys(skills).length} skills, ${careerPathDefs.length} career paths, ${courseDefs.length} courses, ${certDefs.length} certificates, ${projectDefs.length} project ideas.`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
