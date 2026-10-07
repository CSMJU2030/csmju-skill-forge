export interface CareerLearningGuide {
  overview: string;
  work: string[];
  learn: string[];
  sourceNotes?: string[];
  references: { name: string; url: string }[];
}

export const GENERAL_LEARNING_REFERENCES = [
  {
    name: 'roadmap.sh — Explore roadmaps and learning paths',
    url: 'https://roadmap.sh/dashboard',
  },
];

export const CAREER_LEARNING_GUIDES: Record<string, CareerLearningGuide> = {
  'Software Engineer': {
    overview: 'พัฒนาซอฟต์แวร์ให้ตอบโจทย์ผู้ใช้ ตั้งแต่ทำความเข้าใจปัญหา ออกแบบระบบ เขียนและทดสอบโค้ด ไปจนถึง deploy และดูแลหลังใช้งาน',
    work: ['แตก requirement เป็นงานและขอบเขตที่ทดสอบได้', 'ออกแบบโครงสร้างและ API โดยคำนึงถึงการเปลี่ยนแปลงในอนาคต', 'เขียนโค้ด อ่าน code review และทดสอบก่อนปล่อย', 'ติดตาม defect, reliability และ feedback หลัง deploy'],
    learn: ['พื้นฐานภาษาและ data structures', 'การออกแบบซอฟต์แวร์และ version control', 'การทดสอบ, CI/CD, security และการทำงานเป็นทีม'],
    references: [
      { name: 'roadmap.sh — Software Design and Architecture', url: 'https://roadmap.sh/software-design-architecture' },
      { name: 'CS50x — Harvard University', url: 'https://cs50.harvard.edu/x/' },
      { name: 'OSSU — Computer Science curriculum', url: 'https://github.com/ossu/computer-science' },
      { name: 'SWEBOK Guide — IEEE Computer Society', url: 'https://www.computer.org/education/bodies-of-knowledge/software-engineering' },
      { name: 'OWASP Top 10', url: 'https://owasp.org/www-project-top-ten/' },
    ],
  },
  'Backend Developer': {
    overview: 'สร้างระบบฝั่ง server ที่รับและตรวจ request จัดการกฎธุรกิจ อ่าน/เขียนข้อมูล และให้บริการผ่าน API ที่ปลอดภัยและเชื่อถือได้ งานจริงครอบคลุมตั้งแต่เลือกภาษาและ framework ไปจนถึง deploy, monitor และแก้ปัญหา production',
    work: [
      'แปลง requirement ให้เป็น endpoint, data model และพฤติกรรมที่ทดสอบได้',
      'ออกแบบ HTTP/REST API, validation, error responses และการเข้าถึงข้อมูล',
      'ใช้ฐานข้อมูล relational ทำ CRUD, schema changes, transactions และ query ที่มีประสิทธิภาพ',
      'จัดการ authentication, authorization, secret, input validation และความเสี่ยงของ API',
      'ทดสอบและดูแลระบบ: logs, metrics, error handling, deployment และ incident fixes',
    ],
    learn: [
      'พื้นฐานภาษาและเครื่องมือของ ecosystem: Python/Django หรือ JavaScript/Node.js พร้อม package manager, dependencies และ Git',
      'Web/HTTP: request-response, methods, status codes, routing, REST API, serialization และ API documentation',
      'ฐานข้อมูล: SQL, relational modeling, CRUD, constraints, indexes, transactions และ migrations',
      'Framework: request routing, handlers/views, models, forms/validation, configuration และ separation of concerns',
      'Identity และ security: registration/login, session/token concepts, authorization, password handling และ input protection',
      'คุณภาพและ production: unit/integration tests, error handling, logs, caching, background work, deployment และการทำ portfolio projects',
    ],
    sourceNotes: [
      'roadmap.sh จัดลำดับเริ่มจากภาษาและ package manager ต่อด้วย relational database/CRUD, framework, REST, authentication/authorization, Git และการทำโปรเจกต์',
      'บทความ freeCodeCamp เรื่อง Python/Django ระบุหัวข้อ Python เบื้องต้น, Django routing, GET/POST, models, registration/login/logout, การสร้าง web projects และ Django REST Framework',
      'หลักสูตร freeCodeCamp Back End Development and APIs เชื่อมไว้เป็นแหล่งเรียนโดยตรง หน้าหลักสูตรเป็น interactive client-rendered จึงยังไม่ยืนยัน syllabus รายบทจากหน้าเว็บที่ดึงได้',
      'หัวข้อเพิ่มเติมเรื่อง API security, HTTP และ PostgreSQL เชื่อมไปยังเอกสารทางการ/แหล่งอ้างอิงเฉพาะ ไม่ได้อ้างว่าอยู่ในหลักสูตร freeCodeCamp',
    ],
    references: [
      { name: 'roadmap.sh — Backend Developer Roadmap', url: 'https://roadmap.sh/backend' },
      { name: 'freeCodeCamp — Back End Development and APIs', url: 'https://www.freecodecamp.org/learn/back-end-development-and-apis-v9' },
      { name: 'freeCodeCamp — Backend Web Development with Python (Django course outline)', url: 'https://www.freecodecamp.org/news/backend-web-development-with-python-full-course/' },
      { name: 'Django Documentation — Getting started', url: 'https://docs.djangoproject.com/en/stable/intro/' },
      { name: 'MDN — HTTP overview', url: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Overview' },
      { name: 'OpenAPI Specification', url: 'https://spec.openapis.org/oas/latest.html' },
      { name: 'OWASP API Security Project', url: 'https://owasp.org/www-project-api-security/' },
      { name: 'PostgreSQL Documentation', url: 'https://www.postgresql.org/docs/' },
    ],
  },
  'Frontend Developer': {
    overview: 'สร้างประสบการณ์ใช้งานบนเว็บที่เข้าถึงได้ ทำงานได้ดีบนอุปกรณ์หลากหลาย และเชื่อมต่อ backend อย่างถูกต้อง',
    work: ['แปลง design และ user flows เป็น interface', 'จัดการ state, forms, navigation และ API errors', 'ทดสอบ responsive behavior และ accessibility', 'วัด performance และแก้ปัญหาการโหลด/interaction'],
    learn: ['HTML, CSS, JavaScript และ browser fundamentals', 'component architecture และ state management', 'web accessibility, performance และ security'],
    references: [
      { name: 'roadmap.sh — Frontend Developer Roadmap', url: 'https://roadmap.sh/frontend' },
      { name: 'freeCodeCamp — Responsive Web Design', url: 'https://www.freecodecamp.org/learn/2022/responsive-web-design/' },
      { name: 'The Odin Project', url: 'https://www.theodinproject.com/' },
      { name: 'MDN Web Docs', url: 'https://developer.mozilla.org/en-US/docs/Web' },
      { name: 'W3C Web Accessibility Initiative', url: 'https://www.w3.org/WAI/standards-guidelines/wcag/' },
      { name: 'web.dev', url: 'https://web.dev/learn/' },
    ],
  },
  'Full-Stack Web Developer': {
    overview: 'ทำงานข้ามส่วนติดต่อผู้ใช้ API และฐานข้อมูล โดยเชื่อมแต่ละชั้นผ่านสัญญาที่ชัดเจนและปลอดภัย',
    work: ['ออกแบบ flow ตั้งแต่ browser ถึง database', 'สร้าง UI และ API ที่ตรวจสอบข้อมูลทั้ง client/server', 'จัดการ persistence, deployment และ environment', 'ทดสอบเส้นทางใช้งาน end-to-end'],
    learn: ['พื้นฐาน web platform และ frontend framework', 'API, database และ identity/security', 'testing, deployment, observability และการแก้ production issues'],
    sourceNotes: [
      'freeCodeCamp Machine Learning with Python เป็นหลักสูตรด้าน machine learning ไม่ใช่หลักสูตร Full-Stack โดยตรง จึงแสดงเป็นแหล่งเสริมข้ามสาย ไม่ใช้กำหนดลำดับเรียน Full-Stack',
    ],
    references: [
      { name: 'roadmap.sh — Full Stack Developer Roadmap', url: 'https://roadmap.sh/full-stack' },
      { name: 'Full Stack Open — University of Helsinki', url: 'https://fullstackopen.com/en/' },
      { name: 'freeCodeCamp — Machine Learning with Python (เสริมข้ามสาย)', url: 'https://www.freecodecamp.org/learn/machine-learning-with-python/' },
      { name: 'MDN Web Docs', url: 'https://developer.mozilla.org/en-US/docs/Web' },
      { name: 'OpenAPI Specification', url: 'https://spec.openapis.org/oas/latest.html' },
      { name: 'OWASP Top 10', url: 'https://owasp.org/www-project-top-ten/' },
    ],
  },
  'Mobile App Developer': {
    overview: 'สร้างแอปบนอุปกรณ์พกพา โดยพิจารณาวงจรชีวิตหน้าจอ เครือข่ายไม่เสถียร การเก็บข้อมูลในเครื่อง และแนวทางของแต่ละแพลตฟอร์ม',
    work: ['ออกแบบ navigation และ state ของแอป', 'เชื่อม API และจัดการ offline/error states', 'ทดสอบบนอุปกรณ์และขนาดหน้าจอต่างกัน', 'จัดการ privacy, permissions และการเผยแพร่เวอร์ชัน'],
    learn: ['เลือก native หรือ cross-platform ตามข้อกำหนด', 'platform lifecycle, UI patterns และ persistence', 'accessibility, app security และ automated testing'],
    references: [
      { name: 'roadmap.sh — Android Developer Roadmap', url: 'https://roadmap.sh/android' },
      { name: 'Apple — SwiftUI tutorials', url: 'https://developer.apple.com/tutorials/swiftui/' },
      { name: 'Android Developers — Android Development with Kotlin course', url: 'https://developers.google.com/profile/badges/tier/courses/android/android-development-with-kotlin?hl=th' },
      { name: 'Android Developers — Get started', url: 'https://developer.android.com/get-started/overview?hl=th' },
      { name: 'Android Developers — Teach', url: 'https://developer.android.com/teach?hl=th' },
      { name: 'Android Developers — Guide to app architecture', url: 'https://developer.android.com/topic/architecture' },
      { name: 'Apple Human Interface Guidelines', url: 'https://developer.apple.com/design/human-interface-guidelines/' },
      { name: 'OWASP MASVS', url: 'https://mas.owasp.org/MASVS/' },
    ],
  },
  'Data Engineer': {
    overview: 'ออกแบบระบบรวบรวม แปลง ตรวจสอบ และส่งมอบข้อมูลที่เชื่อถือได้ เพื่อให้ทีม analytics และผลิตภัณฑ์นำไปใช้ได้',
    work: ['ออกแบบ batch/stream ingestion และ data contracts', 'สร้าง transformation ที่ทำซ้ำได้และตรวจสอบคุณภาพข้อมูล', 'จัดการ orchestration, lineage และการกู้คืน pipeline', 'คุม access, retention และต้นทุนข้อมูล'],
    learn: ['SQL, data modeling และ distributed processing', 'ETL/ELT, orchestration และ data quality', 'privacy, governance, monitoring และ cloud data platforms'],
    references: [
      { name: 'roadmap.sh — Data Engineer Roadmap', url: 'https://roadmap.sh/data-engineer' },
      { name: 'Data Engineering Zoomcamp — DataTalks.Club', url: 'https://github.com/DataTalksClub/data-engineering-zoomcamp' },
      { name: 'freeCodeCamp — Data Engineering articles', url: 'https://www.freecodecamp.org/news/tag/data-engineering/' },
      { name: 'Apache Airflow Documentation', url: 'https://airflow.apache.org/docs/' },
      { name: 'Apache Spark Documentation', url: 'https://spark.apache.org/docs/latest/' },
      { name: 'PostgreSQL Documentation', url: 'https://www.postgresql.org/docs/' },
    ],
  },
  'Machine Learning Engineer': {
    overview: 'พัฒนาและดูแลระบบที่ใช้โมเดล machine learning โดยเชื่อมข้อมูล การทดลอง การประเมิน และการ deploy เข้ากับซอฟต์แวร์จริง',
    work: ['กำหนดปัญหาและ baseline ที่วัดผลได้', 'เตรียมข้อมูลและป้องกัน data leakage', 'ประเมินคุณภาพ, fairness และ failure modes', 'deploy, monitor drift และวางแผน retraining/rollback'],
    learn: ['สถิติ, supervised/unsupervised learning และ evaluation', 'data pipelines, reproducible experiments และ model serving', 'ความเป็นส่วนตัว ความเสี่ยง และ human oversight'],
    references: [
      { name: 'roadmap.sh — AI and Data Scientist Roadmap', url: 'https://roadmap.sh/ai-data-scientist' },
      { name: 'Kaggle Learn', url: 'https://www.kaggle.com/learn' },
      { name: 'freeCodeCamp — Machine Learning with Python', url: 'https://www.freecodecamp.org/learn/machine-learning-with-python/' },
      { name: 'Google Machine Learning Crash Course', url: 'https://developers.google.com/machine-learning/crash-course' },
      { name: 'NIST AI Risk Management Framework', url: 'https://www.nist.gov/itl/ai-risk-management-framework' },
      { name: 'Rules of Machine Learning — Google', url: 'https://developers.google.com/machine-learning/guides/rules-of-ml' },
    ],
  },
  'QA / Test Engineer': {
    overview: 'ลดความเสี่ยงของผลิตภัณฑ์ด้วยการวาง test strategy ออกแบบกรณีทดสอบ และให้ข้อมูลที่ทีมใช้ตัดสินใจปล่อยซอฟต์แวร์',
    work: ['วิเคราะห์ risk และ acceptance criteria', 'ออกแบบ test cases รวม positive, negative และ boundary cases', 'ทำ automation ในระดับ unit, API และ end-to-end ที่เหมาะสม', 'รายงาน defect ให้ทำซ้ำได้และวิเคราะห์แนวโน้มคุณภาพ'],
    learn: ['test design techniques และ exploratory testing', 'automation, CI integration และ test data', 'accessibility, performance และ security testing basics'],
    references: [
      { name: 'roadmap.sh — QA Engineer Roadmap', url: 'https://roadmap.sh/qa' },
      { name: 'Ministry of Testing', url: 'https://www.ministryoftesting.com/' },
      { name: 'freeCodeCamp — Quality Assurance', url: 'https://www.freecodecamp.org/learn/quality-assurance/' },
      { name: 'ISTQB Certified Tester Foundation Level', url: 'https://www.istqb.org/certifications/certified-tester-foundation-level' },
      { name: 'Playwright Documentation', url: 'https://playwright.dev/docs/intro' },
      { name: 'OWASP Web Security Testing Guide', url: 'https://owasp.org/www-project-web-security-testing-guide/' },
    ],
  },
  'Database Administrator': {
    overview: 'ดูแลความพร้อมใช้งาน ความถูกต้อง ความปลอดภัย และประสิทธิภาพของฐานข้อมูล พร้อมเตรียมรับมือการสำรองและกู้คืน',
    work: ['จัดการ roles, permissions, schema และ migrations', 'วิเคราะห์ query plans, locks และ resource usage', 'ทดสอบ backup/restore และกำหนด recovery objectives', 'ติดตาม replication, capacity และ operational incidents'],
    learn: ['SQL, indexing, transactions และ concurrency', 'backup/recovery, replication และ high availability', 'least privilege, audit, monitoring และ performance tuning'],
    sourceNotes: [
      'แหล่ง Stanford อธิบาย relational databases และ SQL ส่วน AWS RDS เป็นบริการฐานข้อมูลแบบ managed; ใช้เป็นแหล่งเสริมคนละขอบเขต ไม่ถือว่าเป็นหลักสูตร DBA เดียวกัน',
    ],
    references: [
      { name: 'roadmap.sh — PostgreSQL DBA Roadmap', url: 'https://roadmap.sh/postgresql-dba' },
      { name: 'freeCodeCamp — Relational Database', url: 'https://www.freecodecamp.org/learn/relational-database/' },
      { name: 'Amazon RDS', url: 'https://aws.amazon.com/rds/' },
      { name: 'Stanford — Relational Databases and SQL lecture slides', url: 'https://web.stanford.edu/class/cs102/lectureslides/RelationalDBandSQL.pdf' },
      { name: 'Stanford Online — Databases: Relational Databases and SQL', url: 'https://online.stanford.edu/courses/soe-ydatabases0005-databases-relational-databases-and-sql' },
      { name: 'edX — Databases: Relational Databases and SQL (Stanford University)', url: 'https://www.edx.org/learn/relational-databases/stanford-university-databases-relational-databases-and-sql' },
      { name: 'PostgreSQL Documentation — Backup and Restore', url: 'https://www.postgresql.org/docs/current/backup.html' },
      { name: 'PostgreSQL Documentation — Monitoring', url: 'https://www.postgresql.org/docs/current/monitoring.html' },
      { name: 'OWASP Database Security Cheat Sheet', url: 'https://cheatsheetseries.owasp.org/cheatsheets/Database_Security_Cheat_Sheet.html' },
    ],
  },
  'Cybersecurity Analyst': {
    overview: 'ช่วยให้องค์กรเข้าใจความเสี่ยง ตรวจจับกิจกรรมผิดปกติ สืบค้นเหตุการณ์ และประสานการตอบสนองโดยรักษาหลักฐาน',
    work: ['วิเคราะห์ alert และ log พร้อมแยก false positives', 'เชื่อมเหตุการณ์กับ asset, identity และ threat context', 'ใช้ playbook เพื่อ triage และ containment', 'บันทึกหลักฐาน สื่อสารผล และเสนอการลดความเสี่ยง'],
    learn: ['network, operating systems, identity และ security fundamentals', 'incident response, threat analysis และ detection engineering', 'ความเป็นส่วนตัว การเก็บหลักฐาน และการสื่อสารความเสี่ยง'],
    references: [
      { name: 'roadmap.sh — Cyber Security Roadmap', url: 'https://roadmap.sh/cyber-security' },
      { name: 'freeCodeCamp — Information Security', url: 'https://www.freecodecamp.org/learn/information-security/' },
      { name: 'Cisco Networking Academy — Introduction to Cybersecurity', url: 'https://www.netacad.com/courses/introduction-to-cybersecurity?courseLang=en-US' },
      { name: 'NIST NICE Framework', url: 'https://www.nist.gov/itl/applied-cybersecurity/nice/nice-framework-resource-center' },
      { name: 'NIST Cybersecurity Framework 2.0', url: 'https://www.nist.gov/cyberframework' },
      { name: 'CISA Incident Response resources', url: 'https://www.cisa.gov/resources-tools/resources/incident-response' },
    ],
  },
  'Cloud Platform Engineer': {
    overview: 'สร้างและดูแลแพลตฟอร์ม cloud ที่ทีมผลิตภัณฑ์ใช้ deploy ระบบ โดยเน้นความปลอดภัย ความทนทาน การสังเกตการณ์ และต้นทุน',
    work: ['ออกแบบ network, IAM และ environment boundaries', 'ทำ infrastructure as code และ reusable platform modules', 'บริหาร container/orchestration, deployment และ observability', 'วาง capacity, backup, recovery และ cost controls'],
    learn: ['Linux, networking, cloud primitives และ identity', 'containers, Kubernetes, IaC และ CI/CD', 'reliability, security, incident response และ cost management'],
    sourceNotes: [
      'หลักสูตร Google ที่ให้มาเน้น Generative AI ไม่ใช่เนื้อหา Cloud Platform Engineering โดยตรง จึงระบุเป็นแหล่งเสริมเฉพาะด้าน ไม่ใช้เป็นแกนหลักของลำดับเรียน',
    ],
    references: [
      { name: 'roadmap.sh — DevOps Roadmap', url: 'https://roadmap.sh/devops' },
      { name: 'AWS Skill Builder — Digital Training', url: 'https://aws.amazon.com/training/digital/' },
      { name: 'Google Cloud — 12 days of no-cost Generative AI training (เสริมเฉพาะด้าน)', url: 'https://cloud.google.com/blog/topics/training-certifications/12-days-of-no-cost-generative-ai-training' },
      { name: 'Kubernetes Documentation', url: 'https://kubernetes.io/docs/home/' },
      { name: 'AWS Well-Architected Framework', url: 'https://docs.aws.amazon.com/wellarchitected/latest/framework/welcome.html' },
      { name: 'Terraform Documentation', url: 'https://developer.hashicorp.com/terraform/docs' },
    ],
  },
  'DevSecOps Engineer': {
    overview: 'ผสานแนวปฏิบัติด้านความปลอดภัยเข้ากับการพัฒนาและส่งมอบซอฟต์แวร์ ตั้งแต่ source code และ dependency ไปจนถึง runtime และ incident response',
    work: ['ทำ threat modeling และ secure design ร่วมกับทีมพัฒนา', 'เพิ่ม secret/dependency/code scanning ใน CI/CD พร้อมจัดการข้อยกเว้น', 'ทำ artifact provenance, signing และ deployment controls', 'ติดตาม production signals และฝึก incident response'],
    learn: ['Linux, networking, scripting และ cloud IAM', 'containers, infrastructure as code และ delivery pipelines', 'secure SDLC, software supply chain และ monitoring/response'],
    sourceNotes: [
      'ลิงก์ Google ที่ส่งมาเป็น ad-click redirect ซึ่งไม่แสดงเว็บไซต์ปลายทางอย่างชัดเจน จึงไม่นำมาแสดงเพื่อหลีกเลี่ยงลิงก์ที่ตรวจสอบไม่ได้',
    ],
    references: [
      { name: 'roadmap.sh — DevSecOps Roadmap', url: 'https://roadmap.sh/devsecops' },
      { name: 'GitLab — DevSecOps', url: 'https://about.gitlab.com/topics/devsecops/' },
      { name: 'AWS Training — Learn about DevOps', url: 'https://aws.amazon.com/training/learn-about/devops/' },
      { name: 'freeCodeCamp — DevSecOps articles', url: 'https://www.freecodecamp.org/news/tag/devsecops/' },
      { name: 'freeCodeCamp — Learn DevSecOps and API Security', url: 'https://www.freecodecamp.org/news/learn-devsecops-and-api-security/' },
      { name: 'NIST Secure Software Development Framework (SSDF)', url: 'https://csrc.nist.gov/Projects/ssdf' },
      { name: 'SLSA Supply-chain Levels for Software Artifacts', url: 'https://slsa.dev/' },
      { name: 'OWASP Top 10 CI/CD Security Risks', url: 'https://owasp.org/www-project-top-10-ci-cd-security-risks/' },
      { name: 'NIST NICE Framework', url: 'https://www.nist.gov/itl/applied-cybersecurity/nice/nice-framework-resource-center' },
    ],
  },
};
