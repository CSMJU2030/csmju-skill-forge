export interface AssessmentQuestion {
  id: string;
  skill: string;
  prompt: string;
  options: { id: string; text: string }[];
  answer: string;
  explanation: string;
}

export const BACKEND_DEVELOPER_QUESTIONS: AssessmentQuestion[] = [
  {
    id: 'backend-http-method',
    skill: 'HTTP & REST APIs',
    prompt: 'ระบบมี endpoint เปลี่ยนสถานะคำสั่งซื้อ การออกแบบใดสื่อความหมาย HTTP ได้เหมาะสมที่สุด?',
    options: [
      { id: 'a', text: 'ใช้ POST เพื่อเปลี่ยนสถานะ โดยส่งค่าใหม่ใน body ของ request' },
      { id: 'b', text: 'ใช้ PATCH กับ resource และตรวจสิทธิ์ก่อนบันทึกสถานะ' },
      { id: 'c', text: 'ใช้ GET พร้อมส่งสถานะใหม่ใน query string' },
      { id: 'd', text: 'ใช้ POST ซ้ำทุกครั้งโดยไม่ตรวจสถานะเดิม' },
    ],
    answer: 'b',
    explanation: 'การเปลี่ยนบางส่วนของ resource เหมาะกับ PATCH; GET ควรใช้ดึงข้อมูลโดยไม่มี side effect และทุกคำขอต้องตรวจ authorization',
  },
  {
    id: 'backend-status-code',
    skill: 'HTTP & REST APIs',
    prompt: 'API สร้าง resource สำเร็จและ client ต้องรู้ URL ของ resource ใหม่ ควรตอบอย่างไร?',
    options: [
      { id: 'a', text: 'ตอบ 200 โดยไม่มี body หรือ URL อ้างอิง resource ที่สร้างขึ้น' },
      { id: 'b', text: 'ตอบ 201 พร้อมข้อมูล resource หรือ Location header' },
      { id: 'c', text: 'ตอบ 204 พร้อม body ที่มีรายละเอียดทั้งหมด' },
      { id: 'd', text: 'ตอบ 302 ไปหน้า login เสมอ' },
    ],
    answer: 'b',
    explanation: '201 Created สื่อว่ามี resource ใหม่แล้ว และ response อาจระบุ resource ผ่าน body หรือ Location header',
  },
  {
    id: 'backend-input-validation',
    skill: 'API Validation & Security',
    prompt: 'endpoint รับจำนวนสินค้าจาก client สิ่งใดควรทำก่อนนำค่าไปใช้สร้างคำสั่งซื้อ?',
    options: [
      { id: 'a', text: 'ตรวจชนิด ช่วงค่าที่อนุญาต และกฎธุรกิจบน server' },
      { id: 'b', text: 'เชื่อค่า client เพราะหน้าเว็บมี number input' },
      { id: 'c', text: 'แปลงค่าเป็น string แล้วบันทึกโดยไม่ตรวจเพิ่ม' },
      { id: 'd', text: 'ซ่อนข้อผิดพลาดไว้ แต่ประมวลผลค่าที่ส่งมาทุกแบบ' },
    ],
    answer: 'a',
    explanation: 'client สามารถถูกข้ามหรือแก้ request ได้ จึงต้องตรวจ input และ business rules ที่ server',
  },
  {
    id: 'backend-object-authorization',
    skill: 'API Validation & Security',
    prompt: 'ผู้ใช้ที่ login แล้วส่ง order ID ของคนอื่นมาเรียก API ยกเลิกคำสั่งซื้อ ควรป้องกันอย่างไร?',
    options: [
      { id: 'a', text: 'ใช้ ID ที่เดายากและตรวจว่าผู้ใช้ login แล้วก่อนยกเลิกคำสั่งซื้อ' },
      { id: 'b', text: 'ตรวจว่า resource อยู่ในขอบเขตที่ผู้ใช้นั้นมีสิทธิ์จัดการ' },
      { id: 'c', text: 'ซ่อนปุ่มยกเลิกจากหน้าเว็บของผู้ใช้อื่น' },
      { id: 'd', text: 'ตรวจเฉพาะว่าผู้ใช้มี session ที่ยังไม่หมดอายุ' },
    ],
    answer: 'b',
    explanation: 'การ authentication บอกว่าเป็นใคร ส่วน authorization ต้องตรวจสิทธิ์ต่อ resource ทุกครั้งที่ร้องขอ',
  },
  {
    id: 'backend-password',
    skill: 'Identity & Authentication',
    prompt: 'ระบบต้องเก็บข้อมูลสำหรับตรวจรหัสผ่านผู้ใช้ แนวทางใดเหมาะสมที่สุด?',
    options: [
      { id: 'a', text: 'เก็บรหัสผ่านเป็นข้อความเพื่อให้ support อ่านได้' },
      { id: 'b', text: 'เก็บ Argon2id password hash พร้อม salt เฉพาะบัญชี' },
      { id: 'c', text: 'เข้ารหัสรหัสผ่านแบบ reversible เพื่อให้ระบบถอดกลับมาเปรียบเทียบตอน login' },
      { id: 'd', text: 'ใช้ SHA-256 รอบเดียวโดยไม่ใช้ salt เพราะเป็น hash มาตรฐาน' },
    ],
    answer: 'b',
    explanation: 'รหัสผ่านควรจัดเก็บด้วย adaptive password hashing เช่น Argon2id, bcrypt หรือ scrypt ไม่ใช่ plaintext หรือ hash ทั่วไปเพียงรอบเดียว',
  },
  {
    id: 'backend-sql-injection',
    skill: 'Data & SQL',
    prompt: 'ค้นหาผู้ใช้ด้วยค่าที่มาจาก query parameter วิธีสร้าง database query แบบใดปลอดภัยกว่า?',
    options: [
      { id: 'a', text: 'ต่อ input เข้า SQL string แล้วลบอักขระ quote บางตัว' },
      { id: 'b', text: 'bind input ด้วย parameterized query แยกค่าจาก SQL command' },
      { id: 'c', text: 'แปลง input เป็น Base64 ก่อนต่อเข้า SQL string แล้ว decode ตอนบันทึก' },
      { id: 'd', text: 'ซ่อน error message แล้วคง SQL string interpolation ไว้' },
    ],
    answer: 'b',
    explanation: 'การ bind parameter ทำให้ฐานข้อมูลแยก input ออกจากโครงสร้าง SQL ไม่ควรพึ่ง blacklist หรือการซ่อน error',
  },
  {
    id: 'backend-transaction',
    skill: 'Data & SQL',
    prompt: 'การโอนเงินต้องหักยอดจากบัญชีหนึ่งและเพิ่มอีกบัญชีหนึ่ง วิธีใดช่วยรักษาความสอดคล้องของข้อมูล?',
    options: [
      { id: 'a', text: 'อัปเดตบัญชีแรกแล้วส่ง request แยกไปบัญชีที่สอง หากล้มเหลวค่อยลองส่งซ้ำ' },
      { id: 'b', text: 'เปลี่ยนยอดทั้งสองบัญชีใน transaction เดียว' },
      { id: 'c', text: 'บันทึกเฉพาะบัญชีต้นทางก่อน แล้วค่อยตรวจสอบยอดภายหลัง' },
      { id: 'd', text: 'ใช้ cache เป็นแหล่งข้อมูลหลักและไม่เขียนฐานข้อมูล' },
    ],
    answer: 'b',
    explanation: 'transaction ทำให้ชุดการเปลี่ยนแปลงสำเร็จหรือย้อนกลับตามขอบเขตที่กำหนด ลดโอกาสยอดเงินไม่สมดุล',
  },
  {
    id: 'backend-index',
    skill: 'Data & SQL',
    prompt: 'endpoint อ่านตารางขนาดใหญ่ช้าเมื่อค้นด้วยคอลัมน์ที่ใช้บ่อย ควรทำอย่างไรต่อ?',
    options: [
      { id: 'a', text: 'เพิ่ม index ทันทีทุกคอลัมน์โดยไม่วัดผล' },
      { id: 'b', text: 'ตรวจ query plan ก่อนเพิ่ม index และวัดผลกับ workload จริง' },
      { id: 'c', text: 'cache ผล query ทั้งตารางในทุก instance เพื่อให้ค้นหาได้เร็วขึ้น' },
      { id: 'd', text: 'เพิ่ม timeout ให้ยาวขึ้นโดยไม่ตรวจ query' },
    ],
    answer: 'b',
    explanation: 'query plan และรูปแบบ workload ช่วยชี้ว่าควรใช้ index แบบใด; index เพิ่มต้นทุน storage และการเขียน',
  },
  {
    id: 'backend-django-routing',
    skill: 'Python & Django',
    prompt: 'ใน Django ควรใช้ URL configuration ทำหน้าที่หลักใด?',
    options: [
      { id: 'a', text: 'จับคู่ request path กับ view ที่จะจัดการคำขอ' },
      { id: 'b', text: 'เก็บข้อมูลทุก model ไว้ใน URL' },
      { id: 'c', text: 'ทำหน้าที่แทน database transaction' },
      { id: 'd', text: 'ตรวจสิทธิ์ทุก resource โดยไม่ต้องใช้ view หรือ middleware' },
    ],
    answer: 'a',
    explanation: 'URL dispatcher จับคู่ path กับ view; business logic และ authorization ยังต้องออกแบบในชั้นที่เหมาะสม',
  },
  {
    id: 'backend-django-model',
    skill: 'Python & Django',
    prompt: 'โครงการ Django เปลี่ยน field ใน model และต้องปรับ schema ของฐานข้อมูล ขั้นตอนที่เหมาะสมคืออะไร?',
    options: [
      { id: 'a', text: 'แก้ model แล้วลบฐานข้อมูลเดิมทุกครั้ง' },
      { id: 'b', text: 'สร้าง migration ที่ตรวจทานแล้ว และ apply ตามขั้นตอน deploy' },
      { id: 'c', text: 'แก้ schema production ด้วยมือ แล้วค่อยปรับ model ให้ตรงภายหลัง' },
      { id: 'd', text: 'เปลี่ยน template เพื่อให้ฐานข้อมูลเห็น field ใหม่' },
    ],
    answer: 'b',
    explanation: 'migration ทำให้ schema change ถูกติดตาม ทบทวน และนำไปใช้ซ้ำได้ระหว่าง environment',
  },
  {
    id: 'backend-git-config',
    skill: 'Tooling & Delivery',
    prompt: 'โปรเจกต์ backend ต้องใช้ API secret ใน local และ production ควรจัดการอย่างไร?',
    options: [
      { id: 'a', text: 'commit secret ตัวอย่างที่ใช้งานได้ลง Git เพื่อให้ทีมเริ่มงานง่าย' },
      { id: 'b', text: 'เก็บ secret นอก Git แล้ว inject จาก secret store ตาม environment' },
      { id: 'c', text: 'ใส่ secret ใน URL query เพื่อส่งให้ทุก service' },
      { id: 'd', text: 'เปลี่ยนชื่อ secret variable แต่ commit ค่าเดิมไว้ใน repository' },
    ],
    answer: 'b',
    explanation: 'แยก secret ออกจาก source code ใช้ค่าตาม environment และหมุน secret หากเคยเผยแพร่ไปแล้ว',
  },
  {
    id: 'backend-project-tests',
    skill: 'Testing & Reliability',
    prompt: 'แก้ endpoint สร้างบัญชีแล้ว ต้องการลดโอกาสทำ behavior เดิมพังในอนาคต ควรเพิ่มอะไร?',
    options: [
      { id: 'a', text: 'ทดสอบ success, validation และ error cases สำคัญแบบทำซ้ำได้' },
      { id: 'b', text: 'ทดสอบ end-to-end เฉพาะเส้นทางสำเร็จ เพราะ framework จัดการ validation และ error ให้แล้ว' },
      { id: 'c', text: 'ลบ error handling เพื่อให้ test ผ่านง่ายขึ้น' },
      { id: 'd', text: 'เพิ่มจำนวน log โดยไม่ตรวจผลลัพธ์ของ endpoint' },
    ],
    answer: 'a',
    explanation: 'test ที่ครอบคลุม success, invalid input และ failure modes ช่วยจับ regression และกำหนด contract ที่คาดหวัง',
  },
];

export const DEVSECOPS_QUESTIONS: AssessmentQuestion[] = [
  {
    id: 'linux-permissions',
    skill: 'Linux Administration',
    prompt: 'เว็บเซิร์ฟเวอร์อ่านไฟล์ config ไม่ได้ หลังทีม deploy เปลี่ยนเจ้าของไฟล์ วิธีตรวจสอบและแก้ที่เหมาะสมที่สุดคืออะไร?',
    options: [
      { id: 'a', text: 'ตรวจ owner/group และ permission แล้วให้ service account ได้สิทธิ์เท่าที่จำเป็น' },
      { id: 'b', text: 'ตั้ง permission เป็น 777 ชั่วคราวให้ทุก process อ่านได้เพื่อให้บริการกลับมาทำงานก่อน' },
      { id: 'c', text: 'ปิด SELinux/AppArmor บนเครื่องที่มีปัญหา แล้วค่อยตรวจ log หลัง deploy เสร็จ' },
      { id: 'd', text: 'เปลี่ยน service ให้รันด้วย root เพื่อให้อ่าน config ได้ โดยไม่ต้องแก้ permission ของไฟล์' },
    ],
    answer: 'a',
    explanation: 'ตรวจสอบสิทธิ์ของไฟล์และ directory ก่อน แล้วให้เฉพาะบัญชีที่จำเป็นเข้าถึงได้ หลีกเลี่ยงการเปิดสิทธิ์กว้างหรือรัน service ด้วย root',
  },
  {
    id: 'linux-disk',
    skill: 'Linux Administration',
    prompt: 'เครื่อง Linux แจ้งว่าเขียน log ไม่ได้ ขั้นตอนแรกที่ช่วยแยกสาเหตุได้ตรงจุดที่สุดคืออะไร?',
    options: [
      { id: 'a', text: 'ลบ log เก่าทั้งหมดทันทีเพื่อให้มีพื้นที่ โดยยังไม่ตรวจว่าต้องเก็บไว้หรือไม่' },
      { id: 'b', text: 'ตรวจพื้นที่ว่าง, inode, mount และ permission ของ path log ก่อนเลือกวิธีแก้' },
      { id: 'c', text: 'เพิ่ม RAM ให้เครื่องแล้ว restart service เพื่อให้การเขียน log กลับมาทำงาน' },
      { id: 'd', text: 'รีสตาร์ตเครื่องก่อน แล้วตรวจ filesystem ภายหลังหากปัญหายังเกิดซ้ำ' },
    ],
    answer: 'b',
    explanation: 'การตรวจพื้นที่, inode, mount และ permission ช่วยระบุสาเหตุที่พบบ่อยได้ก่อนแก้ไขโดยไม่ทำลายหลักฐาน',
  },
  {
    id: 'cloud-iam',
    skill: 'Cloud Platforms & IAM',
    prompt: 'แอปบน cloud ต้องอ่าน object จาก storage bucket เดียว ทีมควรให้สิทธิ์อย่างไร?',
    options: [
      { id: 'a', text: 'ใช้ access key ของผู้ดูแลระบบร่วมกัน แล้วเก็บไว้ใน configuration ของแอป' },
      { id: 'b', text: 'ให้ workload ใช้ role อายุสั้น และจำกัดสิทธิ์เฉพาะ bucket ที่ต้องอ่าน' },
      { id: 'c', text: 'เปิด bucket เป็น public แล้วใช้ชื่อ object ที่เดายากแทนการกำหนดสิทธิ์' },
      { id: 'd', text: 'ให้ workload แก้ไขทุก resource ในบัญชี เพื่อรองรับการเปลี่ยนแปลงในอนาคต' },
    ],
    answer: 'b',
    explanation: 'ใช้ workload identity/role และหลัก least privilege โดยจำกัด resource และ action เท่าที่จำเป็น',
  },
  {
    id: 'cloud-exposure',
    skill: 'Cloud Platforms & IAM',
    prompt: 'พบฐานข้อมูลทดสอบเปิดรับ connection จากอินเทอร์เน็ตทั้งหมด วิธีตอบสนองที่เหมาะสมที่สุดคืออะไร?',
    options: [
      { id: 'a', text: 'ปิด public access จำกัด network และตรวจ log ที่เกี่ยวข้อง' },
      { id: 'b', text: 'เปลี่ยนชื่อฐานข้อมูล แต่คง network access เดิมไว้เพื่อไม่ให้ระบบทดสอบสะดุด' },
      { id: 'c', text: 'ปล่อย public access ไว้เพราะเป็นฐานข้อมูลทดสอบ และยังไม่มีข้อมูล production' },
      { id: 'd', text: 'ลบ audit log ที่สร้าง alert ก่อน แล้วค่อยพิจารณาจำกัด network ในรอบถัดไป' },
    ],
    answer: 'a',
    explanation: 'ลดการเปิดเผยทันที รักษาและตรวจหลักฐาน รวมถึงประเมินว่ามีการเข้าถึงผิดปกติหรือไม่',
  },
  {
    id: 'container-secret',
    skill: 'Containers & Orchestration',
    prompt: 'ทีมพบ API token อยู่ใน Docker image ที่ push ไป registry แล้ว ควรทำอะไรเป็นอันดับแรก?',
    options: [
      { id: 'a', text: 'หมุน token ทันที ตรวจการใช้ แล้วเก็บ secret แยกจาก image' },
      { id: 'b', text: 'ลบ token จาก source แล้ว build image ใหม่ โดยยังใช้ token เดิมต่อไป' },
      { id: 'c', text: 'เปลี่ยนชื่อ image tag แล้วปล่อย image เดิมไว้ใน registry เพื่อไม่กระทบ deployment' },
      { id: 'd', text: 'เปลี่ยน repository เป็น private แล้วถือว่า token ใน image ใช้งานต่อได้อย่างปลอดภัย' },
    ],
    answer: 'a',
    explanation: 'secret ใน image อาจถูกดึงหรือคัดลอกไปแล้ว จึงต้องถือว่ารั่วไหลและหมุน credential ก่อนแก้กระบวนการจัดเก็บ',
  },
  {
    id: 'container-debug',
    skill: 'Containers & Orchestration',
    prompt: 'container เริ่มทำงานแล้วหยุดวนซ้ำ สิ่งใดควรตรวจเพื่อหาสาเหตุ?',
    options: [
      { id: 'a', text: 'ตรวจสถานะ, exit code, logs, events และ health check เพื่อหาสาเหตุก่อนแก้' },
      { id: 'b', text: 'เพิ่ม privileged mode ให้ทุก container แล้ว deploy ใหม่เพื่อดูว่ายังหยุดหรือไม่' },
      { id: 'c', text: 'ลบ image จาก registry แล้ว build ใหม่ โดยยังไม่ตรวจ logs ของ container' },
      { id: 'd', text: 'ปิด restart policy เพื่อหยุดการวนซ้ำ โดยไม่ตรวจสาเหตุที่ process จบ' },
    ],
    answer: 'a',
    explanation: 'สถานะ, exit code, logs และ events ช่วยระบุปัญหา command, configuration, dependency หรือ health check ได้',
  },
  {
    id: 'cicd-dependency',
    skill: 'CI/CD Supply Chain',
    prompt: 'pipeline พบ dependency มีช่องโหว่ระดับร้ายแรง แต่ทีมยังต้องส่ง hotfix วันนี้ ควรทำอย่างไร?',
    options: [
      { id: 'a', text: 'ปิดการสแกน dependency ถาวร เพื่อให้ hotfix ผ่าน pipeline ได้ทันกำหนด' },
      { id: 'b', text: 'ประเมินผล แก้หรือบรรเทา และขออนุมัติ exception ชั่วคราว' },
      { id: 'c', text: 'ซ่อนผล scan จาก reviewer แล้วค่อยแจ้งทีมหลัง hotfix ถูก deploy สำเร็จ' },
      { id: 'd', text: 'ดาวน์โหลด dependency เวอร์ชันใหม่จาก mirror ใดก็ได้ โดยไม่ต้องตรวจที่มา' },
    ],
    answer: 'b',
    explanation: 'จัดการความเสี่ยงอย่างตรวจสอบย้อนหลังได้ ใช้ข้อยกเว้นเฉพาะกรณีและชั่วคราว ไม่ปิด guardrail ทั้งระบบ',
  },
  {
    id: 'cicd-secrets',
    skill: 'CI/CD Supply Chain',
    prompt: 'นักพัฒนาเผลอ commit cloud key ลง git แล้วลบออกใน commit ถัดไป การดำเนินการใดจำเป็น?',
    options: [
      { id: 'a', text: 'ถือว่า key ปลอดภัยเพราะ commit ล่าสุดลบไฟล์ออกจาก branch แล้ว' },
      { id: 'b', text: 'เพิกถอน key ตรวจการใช้ และเพิ่ม secret scanning' },
      { id: 'c', text: 'เปลี่ยนชื่อ branch แล้ว force push โดยยังไม่หมุน key ที่เคย commit' },
      { id: 'd', text: 'แจ้งทีมไม่ให้เปิด commit เก่า แล้วเก็บ key เดิมไว้เพื่อไม่ให้ระบบหยุด' },
    ],
    answer: 'b',
    explanation: 'ประวัติ git ยังเก็บ secret เก่าไว้ และอาจถูกคัดลอกไปแล้ว จึงต้องหมุน key และปรับขั้นตอนป้องกัน',
  },
  {
    id: 'appsec-injection',
    skill: 'Application Security',
    prompt: 'API นำค่าค้นหาจากผู้ใช้ไปต่อเป็น SQL string โดยตรง วิธีแก้ที่เหมาะสมที่สุดคืออะไร?',
    options: [
      { id: 'a', text: 'ซ่อน error จากหน้าเว็บ แต่ยังนำ input ไปต่อ SQL string เหมือนเดิม' },
      { id: 'b', text: 'ใช้ parameterized query เพื่อแยก input ออกจาก SQL command' },
      { id: 'c', text: 'เข้ารหัสรหัสผ่านฐานข้อมูลเพิ่ม โดยไม่เปลี่ยนวิธีประกอบ SQL query' },
      { id: 'd', text: 'กรอง quote บางตัวด้วย regex แล้วต่อ input เป็น SQL string ตามเดิม' },
    ],
    answer: 'a',
    explanation: 'parameterized query แยกข้อมูลออกจากคำสั่ง SQL ได้โดยตรง การกรอง input อย่างเดียวไม่ใช่การป้องกันหลักที่เชื่อถือได้',
  },
  {
    id: 'appsec-authz',
    skill: 'Application Security',
    prompt: 'ผู้ใช้เปลี่ยนเลข ID ใน URL แล้วอ่านข้อมูลของบัญชีอื่นได้ ควรแก้ที่ใด?',
    options: [
      { id: 'a', text: 'ซ่อนเลข ID จากหน้าเว็บ แต่ให้ API อ่าน resource ตาม ID ที่ส่งมา' },
      { id: 'b', text: 'ตรวจ authorization ฝั่ง server สำหรับ resource ทุก request' },
      { id: 'c', text: 'เปลี่ยนเป็น UUID เพื่อให้เดายาก โดยไม่ตรวจสิทธิ์เจ้าของข้อมูล' },
      { id: 'd', text: 'ตรวจสิทธิ์ตอน login ครั้งเดียว แล้วเชื่อ ID ที่ client ส่งมาภายหลัง' },
    ],
    answer: 'a',
    explanation: 'การอนุญาตต้องตรวจทุก request ที่เข้าถึง resource; การเดายากหรือซ่อน ID ไม่ทดแทน authorization',
  },
  {
    id: 'incident-triage',
    skill: 'Security Monitoring & Incident Response',
    prompt: 'ระบบแจ้งเตือนว่ามีการ login ล้มเหลวจำนวนมากจากหลาย IP และตามด้วย login สำเร็จหนึ่งครั้ง ขั้นตอนแรกที่เหมาะสมคืออะไร?',
    options: [
      { id: 'a', text: 'ตรวจ alert/log ประเมินขอบเขต แล้ว containment ตาม playbook' },
      { id: 'b', text: 'ลบ log ที่เกี่ยวข้องเพื่อคืนพื้นที่ แล้วรอว่า alert จะเกิดซ้ำหรือไม่' },
      { id: 'c', text: 'ประกาศว่า account ถูกยึดแน่นอน แล้วปิดระบบทั้งหมดก่อนตรวจสอบเหตุการณ์' },
      { id: 'd', text: 'ปิด monitoring ชั่วคราวเพื่อหยุด alert แล้วค่อยตรวจบัญชีในวันถัดไป' },
    ],
    answer: 'a',
    explanation: 'ต้องตรวจสอบความน่าเชื่อถือและขอบเขตของเหตุการณ์ รักษาหลักฐาน และใช้ playbook ในการ containment',
  },
  {
    id: 'incident-evidence',
    skill: 'Security Monitoring & Incident Response',
    prompt: 'หลังพบเครื่องหนึ่งอาจถูกบุกรุก ทีมควรทำอย่างไรกับหลักฐานก่อน reimage เครื่อง?',
    options: [
      { id: 'a', text: 'ล้างเครื่องทันทีเพื่อคืนบริการ แล้วค่อยรวบรวมข้อมูลจากเครื่องอื่นภายหลัง' },
      { id: 'b', text: 'รักษาหลักฐานและเวลา/บริบทก่อน reimage ตาม incident process' },
      { id: 'c', text: 'แชร์ disk image ที่มีข้อมูลผู้ใช้ในช่องสาธารณะ เพื่อให้ทีมช่วยวิเคราะห์ได้เร็ว' },
      { id: 'd', text: 'แก้ timestamp ใน log ให้ตรงกับเวลาที่คาดไว้ ก่อนส่งหลักฐานให้ทีมตรวจ' },
    ],
    answer: 'a',
    explanation: 'การเก็บหลักฐานและบันทึก chain of custody ตามนโยบายช่วยให้วิเคราะห์เหตุการณ์ได้ โดยต้องคำนึงถึงข้อมูลส่วนบุคคลด้วย',
  },
];

function question(
  id: string,
  skill: string,
  prompt: string,
  answer: string,
  distractors: [string, string, string],
  explanation: string,
): AssessmentQuestion {
  return {
    id,
    skill,
    prompt,
    options: [answer, ...distractors].map((text, index) => ({
      id: String.fromCharCode(97 + index),
      text,
    })),
    answer: 'a',
    explanation,
  };
}

export const SOFTWARE_ENGINEER_QUESTIONS: AssessmentQuestion[] = [
  question('se-requirements', 'Requirements & Design', 'ผู้ใช้สองกลุ่มต้องการพฤติกรรมต่างกันในขั้นตอนชำระเงิน ทีมควรเริ่มอย่างไร?', 'เก็บ use case และ acceptance criteria ของแต่ละกลุ่มก่อนออกแบบ', ['เลือกพฤติกรรมตามความเห็นของผู้พัฒนาที่อาวุโสที่สุด', 'รวมทุกความต้องการเป็นหน้าจอเดียวโดยไม่ตรวจข้อขัดแย้ง', 'เริ่มเขียนโค้ดแล้วค่อยถามผู้ใช้หลังส่งขึ้น production'], 'เกณฑ์ยอมรับที่ชัดเจนช่วยให้ทีมออกแบบและทดสอบพฤติกรรมที่ตรงกับผู้ใช้'),
  question('se-modularity', 'Software Design', 'โมดูลคำนวณภาษีถูกเรียกจากหลายส่วนและกฎภาษีเปลี่ยนบ่อย ควรปรับอย่างไร?', 'แยกกฎคำนวณไว้หลัง interface ที่ชัดเจนและทดสอบแยกได้', ['คัดลอกสูตรไปทุกหน้าที่ต้องใช้', 'เพิ่มเงื่อนไขพิเศษใน controller ทุกตัว', 'เก็บสูตรไว้ในข้อความที่แสดงบน UI'], 'การรวมกฎธุรกิจไว้ในโมดูลที่มีขอบเขตชัดลดการแก้ซ้ำและทำให้ทดสอบได้'),
  question('se-oop', 'Object-Oriented Programming', 'หลายคลาสคัดลอกขั้นตอนตรวจความถูกต้องของข้อมูลเหมือนกัน ควรทำอย่างไร?', 'ดึงพฤติกรรมร่วมไปไว้ใน abstraction ที่เหมาะสมโดยไม่สร้างลำดับชั้นเกินจำเป็น', ['คัดลอกโค้ดต่อไปเพื่อให้แต่ละคลาสเป็นอิสระ', 'สร้าง base class เดียวที่รวมทุกพฤติกรรมของระบบ', 'เปลี่ยนทุกคลาสเป็น global singleton'], 'ใช้ abstraction เมื่อมีพฤติกรรมร่วมจริงและรักษาความรับผิดชอบของแต่ละคลาส'),
  question('se-api', 'API & Integration', 'บริการภายนอกตอบช้าเป็นบางครั้ง ระบบเรียกบริการนั้นใน request ของผู้ใช้ ควรทำอย่างไร?', 'กำหนด timeout และจัดการความล้มเหลวอย่างชัดเจน พร้อม retry ที่มีขอบเขตเมื่อเหมาะสม', ['รอ response โดยไม่จำกัดเวลา', 'retry ทันทีไม่จำกัดจำนวนครั้ง', 'แสดงข้อมูลสำเร็จปลอมเมื่อบริการไม่ตอบ'], 'timeout และ retry แบบจำกัดช่วยป้องกันการค้างและการเพิ่มภาระให้ระบบปลายทาง'),
  question('se-database', 'Data & Persistence', 'การบันทึกคำสั่งซื้อประกอบด้วย order และรายการสินค้า หากการบันทึกรายการล้มเหลวควรเกิดอะไร?', 'ใช้ transaction เพื่อให้บันทึกทั้งหมดสำเร็จหรือ rollback ทั้งชุด', ['คง order เปล่าไว้แล้วแจ้งว่าสำเร็จ', 'บันทึกแต่ละรายการโดยไม่ตรวจผลลัพธ์', 'ลบข้อมูลลูกค้าทั้งหมดแล้วลองใหม่'], 'transaction รักษาความสอดคล้องของข้อมูลที่ต้องเปลี่ยนเป็นชุดเดียวกัน'),
  question('se-tests', 'Testing & Quality', 'แก้ฟังก์ชันคำนวณส่วนลดแล้วควรเพิ่มการทดสอบแบบใดก่อน?', 'ทดสอบกรณีขอบเขตและผลลัพธ์สำคัญของกฎส่วนลด', ['ทดสอบเฉพาะว่าโปรแกรมเปิดได้', 'ทดสอบเฉพาะสีของปุ่มส่วนลด', 'ข้ามการทดสอบเพราะแก้โค้ดเพียงไม่กี่บรรทัด'], 'กรณีขอบเขตมักเปิดเผยข้อผิดพลาดของกฎคำนวณได้ดีกว่าตรวจเพียงว่าโปรแกรมเริ่มทำงาน'),
  question('se-git', 'Version Control', 'มีการแก้ไขไฟล์หลายส่วนและต้องส่งเฉพาะงานฟีเจอร์หนึ่งเข้า review ควรทำอย่างไร?', 'แยก commit ให้มีขอบเขตชัดและตรวจ diff ก่อนส่ง', ['commit ทุกไฟล์โดยไม่ดู diff', 'แก้ประวัติของ branch หลักโดยตรง', 'ส่งโฟลเดอร์ source ผ่านแชตแทน version control'], 'commit ที่เล็กและสอดคล้องกับงานช่วยให้ review และย้อนกลับได้ง่าย'),
  question('se-logging', 'Observability', 'เกิดข้อผิดพลาดเฉพาะผู้ใช้บางรายใน production ควรเก็บข้อมูลใดใน log?', 'เหตุการณ์และ context ที่จำเป็นโดยหลีกเลี่ยง secret และข้อมูลส่วนบุคคลเกินจำเป็น', ['รหัสผ่านและ access token เพื่อให้ debug ได้สะดวก', 'เฉพาะข้อความว่า error โดยไม่มีเวลาและ request context', 'เนื้อหาทุก field ของ request โดยไม่มีการจำกัด'], 'log ที่มี context พอเหมาะช่วยวิเคราะห์เหตุและต้องไม่เปิดเผยข้อมูลอ่อนไหว'),
  question('se-deploy', 'Release & Reliability', 'รุ่นใหม่เกิดปัญหากับผู้ใช้หลังปล่อยแบบทยอย ควรเตรียมการอย่างไร?', 'มี health checks, monitoring และวิธีย้อนกลับรุ่นที่ชัดเจน', ['ลบรุ่นเก่าทันทีเพื่อบังคับให้ใช้รุ่นใหม่', 'ปิด monitoring ระหว่าง deploy เพื่อลด alert', 'รอรายงานผู้ใช้ก่อนค่อยตรวจระบบ'], 'การตรวจสุขภาพและ rollback ช่วยจำกัดผลกระทบเมื่อ release มีปัญหา'),
  question('se-security', 'Secure Development', 'ระบบรับไฟล์จากผู้ใช้ก่อนนำไปประมวลผล ควรทำอย่างไร?', 'ตรวจชนิด ขนาด และสิทธิ์การเข้าถึง พร้อมเก็บไฟล์ในตำแหน่งที่ไม่ execute ได้', ['เชื่อชื่อไฟล์และนามสกุลที่ client ส่งมา', 'เก็บไฟล์ใน public web root และเปิด execute', 'ตรวจเฉพาะใน browser โดยไม่ตรวจ server'], 'การตรวจฝั่ง server และแยกพื้นที่จัดเก็บลดความเสี่ยงจากไฟล์อันตราย'),
];

export const FRONTEND_DEVELOPER_QUESTIONS: AssessmentQuestion[] = [
  question('fe-state', 'UI State & Components', 'หน้ารายการสินค้ามีข้อมูลเดียวกันแสดงทั้งรายการและ badge จำนวน ควรจัดการ state อย่างไร?', 'เก็บ source of truth จุดเดียวและคำนวณค่าที่แสดงจากข้อมูลนั้น', ['เก็บสำเนาแยกในแต่ละ component แล้ว sync ด้วย timer', 'อ่านค่าจาก DOM เพื่อใช้เป็น state หลัก', 'reload ทั้งหน้าเมื่อ badge เปลี่ยนทุกครั้ง'], 'state ที่มีแหล่งจริงเพียงจุดเดียวลดข้อมูลไม่ตรงกัน'),
  question('fe-keys', 'UI State & Components', 'รายการแถวถูก reorder ได้ key แบบใดเหมาะสมที่สุด?', 'ใช้ identifier ที่คงที่และไม่ซ้ำของแต่ละรายการ', ['ใช้ index ของแถวทุกกรณี', 'ใช้เลขสุ่มใหม่ทุก render', 'ไม่ต้องกำหนด key'], 'stable key ทำให้ framework จับคู่ component กับข้อมูลเดิมได้ถูกต้อง'),
  question('fe-a11y', 'Accessibility', 'ปุ่มไอคอนค้นหาไม่มีข้อความ ควรทำอย่างไรให้ผู้ใช้ screen reader เข้าใจ?', 'กำหนด accessible name ที่อธิบายการทำงานให้ปุ่ม', ['ใส่ tooltip อย่างเดียวเมื่อ hover', 'ลดขนาดไอคอนให้เล็กลง', 'ใช้ div ที่คลิกได้โดยไม่มี role หรือชื่อ'], 'controls ต้องมีชื่อที่เข้าถึงได้และสื่อความหมาย'),
  question('fe-forms', 'Forms & Validation', 'ฟอร์มส่งข้อมูลผิดพลาดจาก API ควรนำเสนออย่างไร?', 'แสดงข้อความผิดพลาดที่สัมพันธ์กับ field และรักษาค่าที่ผู้ใช้กรอกไว้', ['ล้างทุก field แล้วไม่แจ้งเหตุผล', 'แสดงเฉพาะสีแดงโดยไม่มีข้อความ', 'กลืน error แล้วเปลี่ยนหน้าเหมือนสำเร็จ'], 'feedback ที่ชัดเจนและรักษาข้อมูลช่วยให้แก้ไขได้โดยไม่ต้องกรอกซ้ำ'),
  question('fe-loading', 'Async UI', 'ผู้ใช้พิมพ์ค้นหาทุกตัวอักษรและ request เก่าตอบช้ากว่า request ใหม่ ควรป้องกันผลลัพธ์สลับกันอย่างไร?', 'ยกเลิก request เก่าหรือรับเฉพาะผลลัพธ์ของ query ล่าสุด', ['แสดงทุก response ตามลำดับที่มาถึง', 'หน่วงการ render แต่ยังใช้ response ใดก็ได้', 'ปิดช่องค้นหาหลังตัวอักษรแรก'], 'request cancellation หรือการตรวจ query ปัจจุบันป้องกัน stale response ทับผลล่าสุด'),
  question('fe-performance', 'Web Performance', 'หน้าแรกดาวน์โหลด JavaScript จำนวนมากทั้งที่หลายส่วนอยู่ด้านล่าง ควรปรับอะไร?', 'แยกโหลดส่วนที่ไม่จำเป็นต่อ first view เมื่อผู้ใช้ต้องใช้', ['เพิ่ม bundle เดียวให้ใหญ่ขึ้นเพื่อให้ cache ง่าย', 'โหลดรูปทั้งหมดแบบไม่กำหนดขนาด', 'ปิดการ cache ของ static assets'], 'code splitting และ lazy loading ลดงานเริ่มต้นโดยไม่จำเป็น'),
  question('fe-responsive', 'Responsive Design', 'หน้า dashboard ล้นจอบนมือถือเพราะตารางหลายคอลัมน์ ควรทำอย่างไร?', 'กำหนดรูปแบบ responsive เช่น เลื่อนแนวนอนหรือแสดงข้อมูลสำคัญเป็น card', ['กำหนดความกว้างหน้าให้เท่าจอ desktop', 'ซ่อนเนื้อหาทั้งหมดบนมือถือ', 'ลด font ทุกจุดจนอ่านไม่ออก'], 'รูปแบบที่ปรับตาม viewport รักษาการเข้าถึงข้อมูลบนอุปกรณ์ต่างกัน'),
  question('fe-security', 'Browser Security', 'frontend ได้รับ HTML จากผู้ใช้และต้องแสดงในหน้า ควรทำอย่างไร?', 'หลีกเลี่ยงการ render HTML ดิบ หรือ sanitize ด้วยแนวทางที่เชื่อถือได้', ['แทรก string ลง DOM โดยตรง', 'เข้ารหัส HTML ด้วย Base64 แล้วถือว่าปลอดภัย', 'ซ่อน element หลัง render'], 'การแสดง HTML ที่ไม่น่าเชื่อถือโดยไม่ sanitize เสี่ยงต่อ XSS'),
  question('fe-tests', 'Frontend Testing', 'component ฟอร์มมี validation และ callback submit ควรทดสอบอะไร?', 'ตรวจการกรอกข้อมูล valid/invalid และผลการ submit จากการโต้ตอบ', ['ตรวจเพียงว่าไฟล์ component มีอยู่', 'ทดสอบเฉพาะ class CSS โดยไม่ render', 'ตรวจว่า snapshot ผ่านแล้วถือว่าทุก flow ใช้งานได้'], 'ทดสอบพฤติกรรมจากมุมผู้ใช้ครอบคลุม validation และการทำงานหลัก'),
  question('fe-network', 'API Integration', 'การส่งข้อมูลสำเร็จช้าหลายวินาที ควรปรับ UX อย่างไร?', 'แสดงสถานะกำลังทำงาน ป้องกัน submit ซ้ำ และรายงานผลสำเร็จหรือผิดพลาด', ['ไม่แสดงอะไรจนกว่า response จะมาถึง', 'แสดง success ทันทีโดยไม่รอ server', 'ส่งซ้ำทุกวินาทีจนกว่าจะมี response'], 'สถานะที่ชัดเจนช่วยให้ผู้ใช้เข้าใจการทำงานและลดการส่งซ้ำ'),
];

export const FULL_STACK_DEVELOPER_QUESTIONS: AssessmentQuestion[] = [
  question('fs-contract', 'Frontend & API', 'ทีม frontend และ backend พัฒนาฟีเจอร์พร้อมกัน ควรลดปัญหา contract ไม่ตรงกันอย่างไร?', 'ตกลง API schema และตัวอย่าง request/response ก่อนเชื่อมระบบ', ['ให้แต่ละทีมเดา field name เอง', 'ใช้ response จริงจาก production เป็นเอกสารโดยไม่กำหนด', 'แก้ API ให้เข้ากับ client ทีละ request'], 'contract ที่ชัดเจนทำให้แต่ละส่วนพัฒนาและทดสอบแยกกันได้'),
  question('fs-ui-state', 'Frontend Engineering', 'ผู้ใช้เปลี่ยน filter แล้ว URL ควรแชร์ให้เพื่อนเปิดซ้ำได้ ควรเก็บ filter ที่ใด?', 'สะท้อนสถานะที่ต้องแชร์ลง URL และ sync กับหน้าจอ', ['เก็บในตัวแปรชั่วคราวของ component เท่านั้น', 'เก็บเฉพาะใน local variable', 'ซ่อน filter ไว้ใน CSS'], 'URL state ทำให้ deep link, refresh และการแชร์สถานะทำงานได้'),
  question('fs-validation', 'API & Validation', 'ข้อมูลจาก browser ผ่าน validation แล้ว backend ยังต้องทำอะไร?', 'ตรวจชนิด ค่า และกฎธุรกิจซ้ำที่ server ก่อนเปลี่ยนข้อมูล', ['เชื่อ browser เพราะผู้ใช้เห็น error แล้ว', 'ปิด validation ฝั่ง server เพื่อให้เร็วขึ้น', 'ตรวจเฉพาะเมื่อเกิด database error'], 'client validation เพิ่ม UX แต่ server เป็นขอบเขตที่เชื่อถือได้'),
  question('fs-auth', 'Authentication & Authorization', 'ผู้ใช้ login แล้วเรียก endpoint แก้ข้อมูลของทีมอื่น ควรตรวจอะไร?', 'ตรวจสิทธิ์ของผู้ใช้ต่อ resource และ action ใน backend', ['ซ่อนปุ่มแก้ไขฝั่ง frontend เท่านั้น', 'ตรวจเฉพาะว่า token ยังไม่หมดอายุ', 'เปลี่ยน ID เป็นค่าที่เดายากแทนการตรวจสิทธิ์'], 'การยืนยันตัวตนไม่เท่ากับการมีสิทธิ์ทำทุก action'),
  question('fs-data', 'Database & Transactions', 'ฟอร์มสร้าง invoice และรายการหลายรายการ ต้องบันทึกพร้อมกัน ควรใช้วิธีใด?', 'ทำ write ที่เกี่ยวข้องภายใน transaction', ['บันทึก invoice ก่อนและไม่ตรวจ write รายการ', 'ส่ง write แยกโดยไม่จัดการความล้มเหลว', 'เก็บยอดรวมใน browser เป็นข้อมูลหลัก'], 'transaction ป้องกันข้อมูลบางส่วนค้างเมื่อขั้นตอนใดขั้นตอนหนึ่งล้มเหลว'),
  question('fs-cors', 'Web Integration', 'frontend จาก origin ที่อนุญาตเรียก API ไม่ได้ ควรแก้ CORS อย่างไร?', 'กำหนด allowed origins และ methods ให้ตรงกับ environment ที่ตั้งใจ', ['เปิดทุก origin พร้อม credentials โดยไม่จำกัด', 'ปิด authentication ที่ API', 'ให้ browser ปิด security policy'], 'CORS ควรจำกัด origin และความสามารถตามความจำเป็น'),
  question('fs-observability', 'Operations & Observability', 'ปัญหาเกิดระหว่าง browser, API และ database ควรช่วย trace อย่างไร?', 'ใช้ request/correlation ID เชื่อม log ของแต่ละชั้นโดยไม่ใส่ secret', ['บันทึก password ในทุก log เพื่อไล่ request', 'บันทึกเฉพาะ log จาก browser', 'ปิด log ฝั่ง server เพื่อลดข้อมูล'], 'correlation ID ช่วยเชื่อมเหตุการณ์ระหว่างบริการได้อย่างปลอดภัย'),
  question('fs-testing', 'End-to-End Quality', 'ฟีเจอร์ login แล้วสร้างรายการใหม่ทำงานข้ามหลายชั้น ควรมีการทดสอบอะไร?', 'มี integration หรือ end-to-end test สำหรับ flow สำคัญควบคู่ unit tests', ['ทดสอบเฉพาะสีของหน้า login', 'ทดสอบเฉพาะฟังก์ชัน utility โดยไม่เชื่อม API', 'พึ่งการทดสอบด้วยมือครั้งเดียวก่อน release'], 'การทดสอบหลายระดับช่วยตรวจทั้งกฎย่อยและการเชื่อมต่อจริง'),
  question('fs-deploy', 'Deployment & Reliability', 'schema database ใหม่อาจไม่เข้ากับ application รุ่นเก่าระหว่าง deploy ควรวางแผนอย่างไร?', 'ใช้ migration แบบ backward-compatible และ deploy เป็นลำดับที่รองรับทั้งสองรุ่น', ['ลบ column เก่าพร้อม deploy โดยไม่ตรวจการใช้งาน', 'deploy schema และ app พร้อมกันโดยไม่มี rollback', 'แก้ database production ด้วยมือหลังพบ error'], 'การเปลี่ยน schema แบบค่อยเป็นค่อยไปลด downtime ในช่วงที่หลายรุ่นทำงานพร้อมกัน'),
  question('fs-security', 'Application Security', 'session cookie สำหรับเว็บควรกำหนดอย่างไร?', 'ใช้ Secure, HttpOnly และ SameSite ให้เหมาะกับรูปแบบการใช้งาน', ['เก็บ session token ใน URL', 'ตั้ง cookie ให้ JavaScript ทุกหน้าอ่านได้โดยไม่จำเป็น', 'ใช้ HTTP ใน production เพื่อ debug ง่าย'], 'cookie flags ลดโอกาสถูกอ่านจาก script และจำกัดการส่งข้าม site'),
];

export const MOBILE_APP_DEVELOPER_QUESTIONS: AssessmentQuestion[] = [
  question('mobile-lifecycle', 'Mobile App Lifecycle', 'แอปกำลังบันทึกข้อมูลและระบบปฏิบัติการส่งแอปไป background ควรทำอย่างไร?', 'จัดการ lifecycle และบันทึก state สำคัญให้กลับมาทำต่อได้', ['สมมติว่า process จะไม่ถูกหยุด', 'เริ่ม flow ใหม่ทุกครั้งโดยทิ้งข้อมูลเดิม', 'ปิดการแจ้งเตือน lifecycle'], 'ระบบปฏิบัติการอาจพักหรือหยุดแอป จึงต้องจัดการ state ให้เหมาะสม'),
  question('mobile-network', 'Mobile Networking', 'แอปส่งคำสั่งชำระเงินแล้ว connection ขาดก่อนรับ response ควรทำอย่างไร?', 'ใช้ idempotency key หรือสอบถามสถานะก่อน retry เพื่อไม่ให้เรียกเก็บซ้ำ', ['ส่งคำสั่งใหม่ทันทีโดยใช้ request ใหม่', 'แสดงว่าชำระสำเร็จแม้ยังไม่ทราบผล', 'retry ไม่จำกัดจนกว่าจะได้ response'], 'การ retry operation ที่เปลี่ยนข้อมูลต้องป้องกันผลซ้ำ'),
  question('mobile-storage', 'Local Data & Security', 'แอปต้องเก็บ refresh token ในเครื่อง ควรเก็บที่ใด?', 'ใช้ secure storage ที่ระบบปฏิบัติการจัดให้', ['เก็บเป็น plain text ใน shared preferences ทั่วไป', 'ฝัง token ไว้ใน source code', 'เก็บ token ใน log เพื่อกู้คืนได้ง่าย'], 'credential ควรใช้ keychain/keystore หรือ secure storage ที่เหมาะสม'),
  question('mobile-ui', 'Mobile UX', 'ปุ่มหลักอยู่ชิดขอบและแตะยากบนมือถือ ควรปรับอย่างไร?', 'เพิ่ม touch target และระยะห่าง พร้อมรักษาการรองรับ screen reader', ['ลดขนาดปุ่มเพื่อให้ใส่ข้อมูลได้มากขึ้น', 'ใช้ gesture ลับแทนปุ่มที่มองเห็น', 'กำหนดตำแหน่งให้เหมาะกับอุปกรณ์เดียวเท่านั้น'], 'touch target ที่เหมาะสมและ accessibility ช่วยให้ผู้ใช้หลากหลายกลุ่มใช้งานได้'),
  question('mobile-offline', 'Offline & Sync', 'ผู้ใช้เพิ่มรายการขณะไม่มีสัญญาณ ควรออกแบบอย่างไร?', 'เก็บการเปลี่ยนแปลงอย่างปลอดภัยและ sync เมื่อเชื่อมต่อ พร้อมจัดการ conflict', ['ทิ้งข้อมูลจนกว่าจะออนไลน์', 'แสดงว่าซิงก์แล้วทั้งที่ยังไม่ส่ง', 'ส่ง request ซ้ำทุกวินาทีโดยไม่เก็บสถานะ'], 'การรองรับ offline ต้องแยกสถานะ local/synced และกำหนดวิธีจัดการ conflict'),
  question('mobile-permissions', 'Platform Permissions', 'ฟีเจอร์หนึ่งต้องใช้ตำแหน่งเฉพาะตอนใช้งาน ควรขอ permission เมื่อใด?', 'อธิบายเหตุผลและขอสิทธิ์ใกล้เวลาที่ผู้ใช้เริ่มใช้ฟีเจอร์นั้น', ['ขอทุก permission ตอนเปิดแอปครั้งแรก', 'ขอสิทธิ์ทั้งหมดโดยไม่แจ้งเหตุผล', 'ใช้ตำแหน่งโดยไม่ตรวจผลการอนุญาต'], 'การขอสิทธิ์ตามบริบททำให้ผู้ใช้เข้าใจและลดการขอข้อมูลเกินจำเป็น'),
  question('mobile-performance', 'Mobile Performance', 'หน้ารายการยาวทำให้เลื่อนกระตุก ควรตรวจและปรับอะไร?', 'ใช้ virtualized list และวัด performance บนอุปกรณ์เป้าหมาย', ['render ทุกรายการซ้ำทุก frame', 'โหลดภาพความละเอียดเต็มทั้งหมดก่อนแสดง', 'ปิดการอัปเดตหน้าจอทั้งหมด'], 'virtualization และการวัดบนอุปกรณ์จริงช่วยลดงาน render ที่ไม่จำเป็น'),
  question('mobile-push', 'Notifications', 'push notification มีข้อมูลส่วนบุคคลที่ไม่ควรแสดงบน lock screen ควรทำอย่างไร?', 'ส่งข้อความทั่วไปและดึงรายละเอียดหลังผู้ใช้ยืนยันตัวตนในแอป', ['ใส่ข้อมูลทั้งหมดใน notification payload', 'ส่ง session token ในข้อความแจ้งเตือน', 'แสดงข้อมูลลับโดยไม่สนใจการตั้งค่าความเป็นส่วนตัว'], 'notification อาจมองเห็นจากหน้าจอล็อก จึงควรจำกัดข้อมูล'),
  question('mobile-testing', 'Mobile Testing', 'แอปทำงานบน Android รุ่นใหม่แต่ crash บนอุปกรณ์เก่า ควรทำอย่างไร?', 'ทดสอบบนชุด OS และอุปกรณ์ที่รองรับ พร้อมตรวจ crash report', ['ทดสอบเฉพาะ emulator รุ่นเดียว', 'ประกาศว่าอุปกรณ์เก่าทั้งหมดไม่รองรับโดยไม่ตรวจนโยบาย', 'ปิด crash reporting'], 'matrix การทดสอบและ crash reports ช่วยระบุปัญหาความเข้ากันได้'),
  question('mobile-release', 'App Release', 'อัปเดตแอปต้องเพิ่ม field ที่ server ใหม่ส่งมา ควรรองรับอย่างไร?', 'ทำ parsing แบบทนต่อ field ที่ขาดหรือเพิ่ม และรักษาความเข้ากันได้ตามแผนรุ่น', ['บังคับให้ client ทุกคนอัปเดตก่อน server เปลี่ยน', 'crash เมื่อมี field เพิ่มที่ไม่รู้จัก', 'นำข้อมูล field ใหม่ไปใช้โดยไม่ตรวจชนิด'], 'การรองรับ schema evolution ช่วยให้ client หลายรุ่นทำงานได้ต่อเนื่อง'),
];

export const DATA_ENGINEER_QUESTIONS: AssessmentQuestion[] = [
  question('data-etl', 'ETL & Data Pipelines', 'pipeline ถูกเรียกซ้ำหลัง timeout และอาจประมวลผลไฟล์เดิมอีกครั้ง ควรออกแบบอย่างไร?', 'ทำขั้นตอนให้ idempotent และติดตามสถานะการประมวลผล', ['เพิ่มข้อมูลซ้ำทุกครั้งที่ retry', 'ลบข้อมูลทั้งหมดก่อนทุก run โดยไม่มี backup', 'ปิด retry แม้เป็นความผิดพลาดชั่วคราว'], 'idempotency ทำให้ retry ได้โดยไม่สร้างผลซ้ำ'),
  question('data-quality', 'Data Quality', 'จำนวนแถวใน output ลดลงผิดปกติหลัง pipeline สำเร็จ ควรทำอย่างไร?', 'เพิ่ม validation และ quality checks เช่น count, null, และช่วงค่าก่อนเผยแพร่', ['ถือว่า job exit code 0 แปลว่าข้อมูลถูกต้องเสมอ', 'ปรับ dashboard ให้ไม่แสดงจำนวนแถว', 'เติมแถวสุ่มให้จำนวนใกล้เดิม'], 'การตรวจคุณภาพข้อมูลจับความผิดปกติที่สถานะงานสำเร็จเพียงอย่างเดียวไม่พบ'),
  question('data-model', 'Data Modeling', 'มีการวิเคราะห์ยอดขายแยกตามวันและสินค้า ควรออกแบบตารางอย่างไร?', 'กำหนด grain ของ fact ให้ชัดและเชื่อม dimension ที่เหมาะสม', ['รวมทุกข้อมูลในคอลัมน์ข้อความเดียว', 'ทำซ้ำยอดขายในทุกตารางโดยไม่กำหนด key', 'เก็บเฉพาะค่าเฉลี่ยโดยทิ้งข้อมูลต้นทาง'], 'grain และ dimension ที่ชัดช่วยให้ query มีความหมายและตรวจสอบได้'),
  question('data-sql', 'SQL & Warehousing', 'รายงาน join ตารางธุรกรรมแล้วจำนวนแถวเพิ่มมากผิดคาด ควรตรวจอะไร?', 'ตรวจ cardinality และ key ของ join รวมถึง grain ของแต่ละตาราง', ['เพิ่ม DISTINCT ทันทีโดยไม่ตรวจสาเหตุ', 'ลบแถวซ้ำแบบสุ่ม', 'เปลี่ยนทุก join เป็น cross join'], 'join หลายต่อหลายหรือ key ไม่ตรงทำให้เกิด row multiplication'),
  question('data-stream', 'Streaming & Batch', 'consumer ประมวลผล event ซ้ำจาก message broker ได้ ควรทำอย่างไร?', 'ออกแบบการประมวลผลให้ deduplicate หรือ idempotent ด้วย event key', ['สมมติว่า broker ส่งแต่ละครั้งเพียงครั้งเดียว', 'ละทิ้งทุก event ที่มาถึงหลังตัวแรก', 'commit offset ก่อนทำงานโดยไม่จัดการ failure'], 'consumer ต้องรับมือการส่งซ้ำและกำหนดจุด commit ให้สอดคล้องกับผลการประมวลผล'),
  question('data-orchestration', 'Orchestration', 'งานรายวันเริ่มก่อน upstream พร้อมและใช้ข้อมูลไม่ครบ ควรแก้อย่างไร?', 'กำหนด dependency และ readiness checks ใน orchestrator', ['ตั้งเวลาให้ช้าลงแบบเดาสุ่มโดยไม่มีการตรวจ', 'รันซ้ำทุกนาทีตลอดวัน', 'ให้ downstream เติมข้อมูลที่ขาดด้วยค่า default'], 'dependency และ sensor/check ยืนยันความพร้อมก่อนเริ่มงาน'),
  question('data-schema', 'Schema Evolution', 'ต้นทางเพิ่ม field ใหม่ใน event ควรจัดการอย่างไร?', 'กำหนด schema compatibility และทดสอบ consumer กับ schema ใหม่', ['เปลี่ยน schema production ทันทีโดยไม่แจ้งผู้ใช้ข้อมูล', 'ทิ้งข้อมูลทั้งหมดเมื่อพบ field ที่ไม่รู้จัก', 'แปลงทุก field เป็นข้อความโดยไม่บันทึก schema'], 'การจัดการ schema version ช่วยป้องกัน producer และ consumer ใช้รูปแบบไม่ตรงกัน'),
  question('data-security', 'Data Governance & Security', 'dataset มีข้อมูลส่วนบุคคลและหลายทีมต้องใช้ ควรเปิดให้เข้าถึงอย่างไร?', 'กำหนดสิทธิ์ตามบทบาทและใช้ข้อมูลเท่าที่จำเป็น พร้อมบันทึกการเข้าถึง', ['เปิด bucket ให้ public เพื่อสะดวก', 'แชร์บัญชีผู้ดูแลร่วมกันทุกทีม', 'คัดลอกข้อมูลเต็มชุดไปยังเครื่องส่วนตัว'], 'least privilege และ audit ช่วยคุ้มครองข้อมูลระหว่างการใช้งาน'),
  question('data-observe', 'Pipeline Reliability', 'pipeline ล้มเหลวเฉพาะบาง partition แต่ job รวมแสดงสำเร็จ ควรเพิ่มอะไร?', 'ติดตามสถานะและ metrics แยกตาม partition พร้อมแจ้งเตือนกรณีข้อมูลไม่ครบ', ['บันทึกเฉพาะสถานะรวมของ scheduler', 'ปิด alert ของ partition', 'ถือว่า partition ที่หายไม่มีข้อมูล'], 'การแยกสถานะตามหน่วยประมวลผลช่วยตรวจพบ partial failure'),
  question('data-cost', 'Cloud & Cost Optimization', 'query อ่านตารางขนาดใหญ่ทั้งชุดทุกวันแต่ใช้ข้อมูลใหม่เพียงวันเดียว ควรปรับอย่างไร?', 'ประมวลผลแบบ incremental และใช้ partition pruning ตามวันที่', ['เพิ่มขนาดเครื่องให้ใหญ่ที่สุด', 'คัดลอกตารางซ้ำทุกวัน', 'ปิดการตรวจผลลัพธ์เพื่อลดเวลา'], 'incremental processing ลด I/O และต้นทุนเมื่อมีข้อมูลใหม่เพียงบางส่วน'),
];

export const MACHINE_LEARNING_ENGINEER_QUESTIONS: AssessmentQuestion[] = [
  question('ml-split', 'Model Evaluation', 'ข้อมูลมีหลายแถวจากผู้ใช้คนเดียวกันและต้องวัดผลกับผู้ใช้ใหม่ ควรแบ่ง train/test อย่างไร?', 'แบ่งตาม user หรือ group เพื่อไม่ให้ข้อมูลของคนเดียวกันรั่วข้ามชุด', ['สุ่มแถวโดยไม่สนใจ user', 'ฝึกและทดสอบบนชุดข้อมูลเดียวกัน', 'เลือก test จากแถวที่โมเดลทำนายถูกแล้ว'], 'group split วัด generalization กับกลุ่มที่ไม่เคยเห็นและลด leakage'),
  question('ml-leakage', 'Data Leakage', 'feature ถูกคำนวณจากเหตุการณ์ที่เกิดหลังเวลาที่ต้องทำนาย ควรทำอย่างไร?', 'ตัด feature ที่เกิดหลัง prediction time ออกและสร้างข้อมูลตามเวลาจริง', ['ใช้ feature ต่อเพราะคะแนนสูงขึ้น', 'เพิ่มจำนวน epoch', 'นำ label ไปใส่ใน feature โดยตรง'], 'ข้อมูลอนาคตที่ไม่มีในเวลาทำนายทำให้ผลประเมินดีเกินจริง'),
  question('ml-metrics', 'Metrics & Objectives', 'ชุดข้อมูลมีเหตุการณ์ผิดปกติน้อยมากและต้องลด false negative ควรประเมินอย่างไร?', 'เลือก metrics และ threshold ที่สะท้อนต้นทุน false negative บน validation set', ['ใช้ accuracy อย่างเดียว', 'ตั้ง threshold เป็นศูนย์โดยไม่วัดผล', 'วัดเฉพาะ training loss'], 'metric ต้องสอดคล้องกับ class imbalance และเป้าหมายการใช้งาน'),
  question('ml-baseline', 'Model Development', 'โมเดลซับซ้อนใช้เวลานานแต่ยังไม่รู้ว่าช่วยงานได้หรือไม่ ควรทำอะไร?', 'สร้าง baseline ที่เรียบง่ายและเปรียบเทียบด้วย split/metric เดียวกัน', ['เพิ่มชั้นโมเดลก่อนตรวจข้อมูล', 'ปรับ hyperparameter จาก test set', 'ข้ามการเปรียบเทียบแล้ว deploy โมเดลที่ซับซ้อน'], 'baseline แสดงว่าความซับซ้อนเพิ่มคุณค่าจริงหรือไม่'),
  question('ml-repro', 'Experiment Tracking', 'ทีมต้องทำซ้ำผลการทดลองรุ่นก่อน ควรบันทึกอะไร?', 'ข้อมูลและ version, code, config, seed และ metrics ของแต่ละ run', ['บันทึกเฉพาะชื่อโมเดล', 'พึ่งประวัติ terminal ของผู้พัฒนา', 'เก็บไฟล์ model โดยไม่รู้ว่าใช้ข้อมูลใด'], 'การติดตาม artifact และ configuration ช่วยทำซ้ำและตรวจสอบผลได้'),
  question('ml-serving', 'Model Serving', 'โมเดลมี latency สูงเกิน SLA เมื่อรับ request พร้อมกันจำนวนมาก ควรทำอย่างไร?', 'วัด bottleneck ภายใต้โหลดจริงและปรับ batching, resource หรือ serving strategy', ['เพิ่ม timeout ให้ยาวขึ้นโดยไม่วัด', 'ตอบผลลัพธ์แบบสุ่มเมื่อช้า', 'รัน training ใหม่ทุก request'], 'วัด latency และ throughput ก่อนเลือกแนวทาง optimize'),
  question('ml-monitoring', 'Monitoring & Drift', 'คุณภาพ prediction ลดลงหลังข้อมูลผู้ใช้เปลี่ยนพฤติกรรม ควรติดตามอะไร?', 'monitor input/prediction drift และคุณภาพจริงเมื่อ label พร้อม', ['ติดตามเฉพาะ CPU ของเครื่อง', 'สมมติว่าโมเดลไม่เปลี่ยนจึงไม่ต้อง monitor', 'ฝึกโมเดลใหม่ทุกชั่วโมงโดยไม่ตรวจข้อมูล'], 'drift และ delayed performance signal ช่วยระบุว่าโมเดลเสื่อมลงจริงหรือไม่'),
  question('ml-version', 'Deployment & Rollback', 'โมเดลใหม่ทดสอบผ่าน offline แต่ยังไม่แน่ใจผลกับ traffic จริง ควรปล่อยอย่างไร?', 'ใช้ shadow หรือ canary และกำหนดเกณฑ์ rollback ก่อนขยาย traffic', ['เปลี่ยนทุก traffic ทันทีโดยไม่มี metric', 'ลบ artifact รุ่นเดิมหลัง deploy', 'ปิดการเก็บ metrics เพื่อลด overhead'], 'การ rollout แบบค่อยเป็นค่อยไปช่วยเปรียบเทียบและจำกัดความเสี่ยง'),
  question('ml-privacy', 'Responsible ML', 'dataset มีข้อมูลส่วนบุคคลที่ไม่จำเป็นต่อการทำนาย ควรทำอย่างไร?', 'ลดหรือเอาข้อมูลที่ไม่จำเป็นออกและกำหนดการเข้าถึง/เก็บรักษา', ['เก็บทุก field เผื่อใช้ในอนาคต', 'แชร์ dataset ให้ทีมสาธารณะเพื่อ review', 'ใส่ข้อมูลส่วนบุคคลลง log ของ prediction'], 'data minimization ลดความเสี่ยงและสอดคล้องกับการใช้ข้อมูลอย่างรับผิดชอบ'),
  question('ml-pipeline', 'ML Data Pipeline', 'training pipeline อ่านข้อมูลใหม่ซ้ำทุกครั้งและใช้เวลานาน ควรทำอย่างไร?', 'version และ validate input พร้อม incremental/cache ขั้นตอนที่ทำซ้ำได้', ['ใช้ไฟล์ local ล่าสุดโดยไม่บันทึก version', 'ข้าม validation เพื่อประหยัดเวลา', 'เขียนทับข้อมูลต้นทางหลัง train ทุกครั้ง'], 'pipeline ที่ reproducible และมี validation ลดความผิดพลาดและต้นทุน'),
];

export const QA_TEST_ENGINEER_QUESTIONS: AssessmentQuestion[] = [
  question('qa-risk', 'Test Strategy', 'ทีมมีเวลาทดสอบจำกัดและมีการเปลี่ยนแปลงระบบชำระเงิน ควรจัดลำดับอย่างไร?', 'จัดลำดับตามความเสี่ยง ผลกระทบ และโอกาสเกิด พร้อมทดสอบ critical flows ก่อน', ['ทดสอบเฉพาะหน้าที่แก้ง่าย', 'สุ่มคลิกหน้าจอโดยไม่กำหนดเป้าหมาย', 'ข้าม regression เพราะ deploy ใกล้แล้ว'], 'risk-based testing ใช้เวลาจำกัดกับส่วนที่มีผลกระทบสูง'),
  question('qa-boundary', 'Test Design', 'ช่องจำนวนสินค้ารับค่าได้ตั้งแต่ 1 ถึง 99 ควรเลือก test case แบบใด?', 'ทดสอบค่าขอบเขตและค่าที่อยู่นอกช่วง เช่น 0, 1, 99, 100', ['ทดสอบเฉพาะค่า 50', 'ทดสอบเฉพาะค่าตัวอักษร', 'ทดสอบเฉพาะหน้าว่าง'], 'boundary value analysis มักพบข้อผิดพลาดรอบขอบเขต'),
  question('qa-bug-report', 'Defect Reporting', 'รายงาน bug ที่ช่วยให้ developer แก้ซ้ำได้ควรมีอะไร?', 'ขั้นตอนทำซ้ำ ผลที่คาด ผลจริง environment และหลักฐานที่จำเป็น', ['เขียนว่าใช้ไม่ได้โดยไม่ระบุวิธี', 'แนบข้อมูลลับของผู้ใช้จริงทั้งหมด', 'แจ้งเฉพาะชื่อ developer ที่ควรแก้'], 'รายละเอียดที่ทำซ้ำได้ช่วยวิเคราะห์สาเหตุและยืนยันการแก้'),
  question('qa-automation', 'Test Automation', 'มี automated test เปราะบางเพราะเลือก element ด้วยตำแหน่ง CSS ลึก ๆ ควรแก้อย่างไร?', 'เลือก locator ที่เสถียรและสื่อความหมาย เช่น role หรือ test id ที่ตั้งใจรองรับ', ['เพิ่ม sleep ให้ยาวขึ้นทุก test', 'ปิด test ที่ fail เป็นครั้งคราว', 'อ้างอิงลำดับ child element ที่เปลี่ยนได้'], 'locator ที่เสถียรลดการผูก test กับรายละเอียด layout'),
  question('qa-flaky', 'Test Reliability', 'test ผ่านบ้างล้มเหลวบ้างใน CI แต่ผ่านบนเครื่องผู้พัฒนา ควรทำอย่างไร?', 'หาสาเหตุ race, shared state, timing และ environment ก่อนแก้ที่ root cause', ['รันซ้ำจนกว่าจะผ่านแล้วไม่รายงาน', 'เพิ่ม retry ไม่จำกัด', 'ปิด test ใน CI'], 'การปกปิด flaky test ทำให้สัญญาณคุณภาพเชื่อถือไม่ได้'),
  question('qa-api', 'API Testing', 'API สร้างรายการแล้วควรตรวจมากกว่า status code อย่างไร?', 'ตรวจ schema, business outcome, persistence และกรณี error/authorization', ['ตรวจเฉพาะว่า response ไม่ว่าง', 'ตรวจเฉพาะเวลาตอบหนึ่งครั้ง', 'ทดสอบเฉพาะ happy path ด้วย admin'], 'API contract และผลข้างเคียงต้องตรงตามข้อกำหนด ไม่ใช่แค่ตอบสำเร็จ'),
  question('qa-regression', 'Regression Testing', 'แก้ shared component ซึ่งใช้ในหลายหน้าควรทำอย่างไร?', 'รันทดสอบ component และ regression ของ flows ที่เกี่ยวข้องกับทุกหน้าสำคัญ', ['ทดสอบเฉพาะหน้าที่แก้ตรง ๆ โดยไม่ดูผู้ใช้ร่วม', 'ลบ snapshot ทุกหน้าก่อนรัน', 'รอให้ผู้ใช้รายงานปัญหา'], 'shared component อาจกระทบหลาย flow จึงต้องตรวจพื้นที่ใช้งานร่วม'),
  question('qa-ci', 'CI/CD Quality Gates', 'suite สำคัญ fail ใน pipeline ก่อน release ควรทำอย่างไร?', 'ตรวจ failure และ block release ตาม policy จนเข้าใจหรือได้รับ exception ที่อนุมัติ', ['merge โดยไม่สนใจผล test', 'ซ่อนผล CI จาก reviewer', 'ลบ test ที่ fail โดยไม่วิเคราะห์'], 'quality gate ช่วยป้องกัน regression และ exception ต้องตรวจสอบย้อนหลังได้'),
  question('qa-accessibility', 'Accessibility Testing', 'จะตรวจว่าฟอร์มใช้งานด้วย keyboard ได้อย่างไร?', 'เดิน focus ด้วย keyboard ตรวจลำดับ focus, visible focus และการประกาศ label/error', ['ใช้ mouse เท่านั้น', 'ตรวจเฉพาะสีของปุ่ม', 'ซ่อน focus outline ทุก element'], 'การทดสอบด้วย keyboard ตรวจการเข้าถึงที่ automated scan อาจไม่ครอบคลุม'),
  question('qa-exploratory', 'Exploratory Testing', 'ผู้ใช้รายงานปัญหาเฉพาะลำดับการกระทำที่ไม่อยู่ใน test case ควรทำอย่างไร?', 'สำรวจตาม charter บันทึก session และเพิ่ม regression test เมื่อพบเงื่อนไขซ้ำได้', ['ปฏิเสธเพราะไม่มี test case เดิม', 'เปลี่ยนข้อมูล production เพื่อทดลอง', 'ปิด bug โดยไม่ตรวจขั้นตอน'], 'exploratory testing ใช้การเรียนรู้ระหว่างทดสอบและควรเปลี่ยนสิ่งที่พบเป็นความรู้ซ้ำได้'),
];

export const DATABASE_ADMINISTRATOR_QUESTIONS: AssessmentQuestion[] = [
  question('dba-backup', 'Backup & Recovery', 'ระบบฐานข้อมูลสำรองข้อมูลทุกคืนแต่ไม่เคยทดสอบ restore ควรทำอะไร?', 'ทดสอบ restore เป็นระยะและตรวจว่า RPO/RTO ที่กำหนดทำได้จริง', ['เพิ่มจำนวน backup โดยไม่เคย restore', 'เก็บ backup ไว้บนเครื่องเดียวกับฐานข้อมูลเท่านั้น', 'ถือว่าไฟล์ backup ใช้ได้จากขนาดไฟล์'], 'การทดสอบ restore ยืนยันว่า backup ใช้งานได้และกู้คืนตามเป้าหมายได้'),
  question('dba-index', 'Performance & Indexing', 'query ช้าหลังตารางโตขึ้น ควรเริ่มวิเคราะห์อย่างไร?', 'ตรวจ query plan, selectivity และ workload ก่อนตัดสินใจเพิ่ม index', ['เพิ่ม index ทุก column', 'เพิ่ม RAM โดยไม่วัด bottleneck', 'ปิด constraint ทั้งหมด'], 'execution plan ช่วยเลือกการปรับที่ตรงสาเหตุและประเมินผลข้างเคียง'),
  question('dba-lock', 'Transactions & Concurrency', 'transaction ค้าง lock จนงานอื่นรอ ควรทำอย่างไร?', 'ตรวจ blocker/waiter และ transaction duration ก่อนยุติ session ตามขั้นตอน', ['kill ทุก connection ทันที', 'ปิด database เพื่อให้ lock หาย', 'เพิ่ม retry ให้ client ไม่จำกัด'], 'การตรวจ lock chain ลดผลกระทบและช่วยระบุ application ที่ค้าง transaction'),
  question('dba-migration', 'Schema Changes', 'ต้องเปลี่ยน column ที่มีข้อมูลจำนวนมากใน production ควรทำอย่างไร?', 'วางแผน migration แบบ incremental พร้อมทดสอบ lock, runtime และ rollback', ['รันคำสั่งแก้ schema โดยตรงช่วง peak', 'ลบตารางแล้วสร้างใหม่โดยไม่มีแผนย้ายข้อมูล', 'แก้ production ด้วย SQL ที่ไม่ได้ review'], 'การทดสอบและ rollout แบบ incremental ช่วยลด downtime และความเสี่ยงข้อมูล'),
  question('dba-access', 'Database Security', 'application ต้องอ่านและเขียนเฉพาะ schema หนึ่ง ควรกำหนดบัญชีอย่างไร?', 'สร้าง service account แยกและให้สิทธิ์เฉพาะ database/schema/action ที่จำเป็น', ['ใช้ root account ร่วมกับทุก service', 'เปิด remote access โดยไม่มี authentication', 'ใช้บัญชีส่วนตัวของ DBA ใน application'], 'least privilege และบัญชีเฉพาะงานช่วยจำกัดผลกระทบ credential รั่ว'),
  question('dba-monitor', 'Monitoring & Capacity', 'พื้นที่ disk database ใกล้เต็ม ควรทำอย่างไร?', 'ตรวจ growth, retention, log และ capacity trend พร้อมวางแผนขยายอย่างปลอดภัย', ['ลบไฟล์ฐานข้อมูลที่ใหญ่ที่สุดทันที', 'ปิด alert เพื่อไม่รบกวนทีม', 'รอให้เขียนไม่ได้ก่อนค่อยดำเนินการ'], 'ตรวจสาเหตุและแนวโน้มช่วยป้องกัน outage โดยไม่ทำลายข้อมูล'),
  question('dba-replica', 'High Availability', 'read replica มี replication lag เพิ่มขึ้นต่อเนื่อง ควรตอบสนองอย่างไร?', 'ตรวจ throughput, long transactions และ replication metrics ก่อน route read ที่ต้องทันสมัย', ['บังคับอ่านทุกอย่างจาก replica โดยไม่สนใจ lag', 'ลบ replica แล้วถือว่าแก้แล้ว', 'ปิดการแจ้งเตือน lag'], 'lag ส่งผลต่อความถูกต้องของ read และต้องหาคอขวดก่อนเปลี่ยน routing'),
  question('dba-integrity', 'Data Integrity', 'พบ foreign key violation หลัง import ข้อมูล ควรทำอย่างไร?', 'ตรวจ mapping และลำดับข้อมูลต้นทาง แก้ความผิดปกติก่อนโหลดซ้ำ', ['ปิด foreign key ถาวร', 'สร้าง parent ปลอมให้ทุกแถว', 'กลืนข้อผิดพลาดและรายงานสำเร็จ'], 'constraint ช่วยรักษาความถูกต้องและความผิดพลาดควรถูกแก้ที่ข้อมูล/ขั้นตอน import'),
  question('dba-audit', 'Operations & Auditing', 'ต้องตรวจว่าใครแก้ข้อมูลสำคัญใน production ควรเตรียมอะไร?', 'เปิด audit trail ที่เหมาะสมและควบคุมสิทธิ์/การเก็บรักษา log', ['แชร์บัญชี admin เพื่อให้จำง่าย', 'เก็บรหัสผ่านผู้ใช้ใน audit log', 'ใช้ shell history อย่างเดียวเป็นหลักฐาน'], 'audit log ช่วยตรวจสอบการเปลี่ยนแปลงและต้องป้องกันการแก้ไขโดยไม่เหมาะสม'),
  question('dba-restore-point', 'Disaster Recovery', 'ก่อนทำ maintenance เสี่ยงสูงควรยืนยันอะไร?', 'ตรวจ backup/restore point และกำหนดขั้นตอน rollback กับผู้รับผิดชอบ', ['เริ่มทันทีเพราะมี backup อัตโนมัติ', 'ลบ backup เก่าเพื่อเพิ่มพื้นที่ก่อนเริ่ม', 'ปิด monitoring ระหว่าง maintenance'], 'restore point และ rollback plan ลดผลกระทบหาก maintenance ล้มเหลว'),
];

export const CYBERSECURITY_ANALYST_QUESTIONS: AssessmentQuestion[] = [
  question('cyber-alert', 'Security Monitoring', 'SIEM แจ้ง login ผิดปกติแต่ข้อมูลยังไม่พอยืนยัน incident ควรทำอย่างไร?', 'ตรวจแหล่งข้อมูลและบริบท ประเมิน severity แล้วบันทึกการตัดสินใจตาม playbook', ['ปิด alert ทันทีเพราะอาจเป็น false positive', 'ประกาศ breach ต่อสาธารณะก่อนตรวจสอบ', 'ลบ event เพื่อไม่ให้เกิด alert ซ้ำ'], 'การ triage ต้องตรวจความน่าเชื่อถือและเก็บบริบทโดยไม่ด่วนสรุป'),
  question('cyber-containment', 'Incident Response', 'พบ endpoint ทำงานเชื่อมต่อกับ command-and-control ที่น่าเชื่อถือ ควรทำอย่างไร?', 'ทำ containment ตาม playbook พร้อมรักษาหลักฐานและแจ้งทีมรับผิดชอบ', ['ล้าง disk ทันทีโดยไม่เก็บหลักฐาน', 'ปล่อยเครื่องออนไลน์เพื่อดูว่าจะเกิดอะไร', 'โพสต์ข้อมูลเหตุการณ์และ IP สาธารณะทันที'], 'containment ลดผลกระทบและการรักษาหลักฐานช่วยวิเคราะห์ incident'),
  question('cyber-network', 'Network Security', 'พบ service ภายในเปิดพอร์ตบริหารจัดการสู่ internet ควรลดความเสี่ยงอย่างไร?', 'จำกัด ingress ผ่าน network policy/VPN และตรวจ log การเข้าถึง', ['เปลี่ยนหมายเลขพอร์ตแต่เปิด public เหมือนเดิม', 'พึ่งชื่อ host ที่เดายาก', 'ปิดระบบ log เพื่อไม่บันทึกการโจมตี'], 'การจำกัด network exposure ลด attack surface มากกว่าการซ่อนพอร์ต'),
  question('cyber-phishing', 'Threat Analysis', 'พนักงานส่งอีเมลน่าสงสัยมาให้ตรวจ ควรทำอย่างไร?', 'วิเคราะห์ header/link/attachment ในสภาพแวดล้อมปลอดภัยและแจ้งผู้ใช้ตามขั้นตอน', ['เปิด attachment บนเครื่องงานปกติเพื่อตรวจ', 'forward ไปทุกคนในองค์กรให้ช่วยคลิก', 'ลบอีเมลโดยไม่เก็บตัวอย่างหรือแจ้งทีม'], 'การวิเคราะห์ใน sandbox และการแจ้งเตือนลดโอกาสแพร่กระจาย'),
  question('cyber-ioc', 'Threat Intelligence', 'พบ IOC จากแหล่งภายนอกที่ไม่ทราบความน่าเชื่อถือ ควรทำอย่างไร?', 'ตรวจแหล่งที่มา อายุ และบริบทก่อนใช้เป็น detection หรือ block rule', ['บล็อกทุกค่าทันทีโดยไม่ประเมินผลกระทบ', 'ถือว่า IOC รับประกันว่าเครื่องติดมัลแวร์', 'ละทิ้งทุก threat intelligence'], 'IOC ต้องประเมินคุณภาพและบริบทเพื่อหลีกเลี่ยง false positive และ disruption'),
  question('cyber-access', 'Identity & Access', 'บัญชีพนักงานที่พ้นสภาพยังมี session ใช้งาน ควรทำอย่างไร?', 'เพิกถอน session/credential และปิดสิทธิ์ตาม offboarding process พร้อมตรวจ log', ['เปลี่ยนชื่อบัญชีแต่คง session ไว้', 'รอให้ session หมดอายุเองโดยไม่ประเมิน', 'ปิด MFA ขององค์กรเพื่อลดปัญหา'], 'การปิดสิทธิ์ทันทีและตรวจการใช้งานช่วยลดโอกาสเข้าถึงต่อ'),
  question('cyber-vuln', 'Vulnerability Management', 'ช่องโหว่ร้ายแรงพบในระบบที่เปิด internet ควรจัดลำดับแก้อย่างไร?', 'ประเมิน exposure, exploitability และผลกระทบ แล้วกำหนด mitigation/patch ตาม SLA', ['จัดลำดับตามหมายเลขระบบอย่างเดียว', 'รอรอบ maintenance ปกติโดยไม่มี mitigation', 'ปิด scanner เพราะพบช่องโหว่มากเกินไป'], 'บริบทการเปิดเผยและความเสี่ยงช่วยจัดลำดับการแก้ไขอย่างมีเหตุผล'),
  question('cyber-crypto', 'Cryptography', 'บริการภายในส่งข้อมูลสำคัญผ่านเครือข่าย ควรป้องกันอย่างไร?', 'ใช้ TLS ที่ตั้งค่าถูกต้องและตรวจ certificate/identity ของปลายทาง', ['เข้ารหัสข้อมูลด้วย Base64', 'ส่งผ่าน HTTP แล้วเปลี่ยนชื่อ field', 'ปิดการตรวจ certificate เพื่อแก้ connection error'], 'TLS ปกป้องความลับและความถูกต้องเมื่อมีการตรวจ identity ปลายทาง'),
  question('cyber-forensics', 'Evidence Handling', 'ต้องเก็บหลักฐานจากเครื่องที่อาจถูกบุกรุก ควรทำอย่างไร?', 'บันทึกผู้เก็บ เวลา วิธีการ และรักษา chain of custody ตามนโยบาย', ['แก้ timestamp เพื่อให้อ่านง่าย', 'คัดลอกข้อมูลไปยัง public file share', 'วิเคราะห์บนเครื่องต้นฉบับโดยไม่บันทึกการกระทำ'], 'chain of custody รักษาความน่าเชื่อถือและตรวจสอบย้อนกลับของหลักฐาน'),
  question('cyber-reporting', 'Security Communication', 'ผู้บริหารต้องการสรุป incident ขณะสอบสวนยังไม่เสร็จ ควรรายงานอย่างไร?', 'แยกข้อเท็จจริง สมมติฐาน ผลกระทบที่ทราบ และการดำเนินการถัดไป', ['ระบุสาเหตุแน่ชัดก่อนมีหลักฐาน', 'ปกปิดความไม่แน่นอนทั้งหมด', 'ส่ง raw logs ที่มีข้อมูลส่วนบุคคลโดยไม่มีการควบคุม'], 'การสื่อสารที่แยกข้อเท็จจริงและสิ่งที่ยังไม่ทราบช่วยตัดสินใจโดยไม่กล่าวเกินหลักฐาน'),
];

export const CLOUD_PLATFORM_ENGINEER_QUESTIONS: AssessmentQuestion[] = [
  question('cloud-iam', 'Cloud IAM', 'application ต้องอ่าน object จาก bucket เดียว ควรให้ credential แบบใด?', 'ใช้ workload identity/role อายุสั้นและจำกัด resource/action เท่าที่ต้องใช้', ['ใช้ access key ของ admin ฝังใน image', 'เปิด bucket เป็น public', 'ให้สิทธิ์ owner ทุก resource เผื่ออนาคต'], 'least privilege และ credential อายุสั้นลดโอกาสนำ credential ไปใช้ผิด'),
  question('cloud-network', 'Cloud Networking', 'ฐานข้อมูลไม่ควรเข้าถึงจาก internet แต่ต้องให้ application ใช้งาน ควรวางอย่างไร?', 'วางใน private network และอนุญาตเฉพาะ security group/subnet ของ application', ['เปิด 0.0.0.0/0 แล้วพึ่งรหัสผ่าน', 'เปลี่ยนพอร์ตมาตรฐานโดยไม่จำกัด network', 'เปิด public IP แต่ซ่อน DNS'], 'การแบ่ง network และจำกัด source ลดพื้นที่โจมตี'),
  question('cloud-iac', 'Infrastructure as Code', 'ต้องเปลี่ยน infrastructure production ควรทำอย่างไร?', 'review IaC diff และ plan ใน pipeline ก่อน apply ด้วยสิทธิ์ที่ควบคุมได้', ['แก้ resource ด้วย console โดยไม่มีบันทึก', 'apply ทุก environment พร้อมกันโดยไม่ตรวจ plan', 'เก็บ state file ใน public repository'], 'การ review plan และควบคุม state ช่วยให้การเปลี่ยนแปลงทำซ้ำและตรวจสอบได้'),
  question('cloud-containers', 'Containers & Orchestration', 'pod ขึ้น CrashLoopBackOff ควรเริ่มตรวจอะไร?', 'ดู events, exit code, logs, probe และ resource limits ก่อนแก้', ['เพิ่ม privileged mode ให้ pod ทันที', 'ลบ cluster แล้วสร้างใหม่', 'ปิด liveness/readiness probe โดยไม่ตรวจเหตุ'], 'ข้อมูลสถานะและ logs ช่วยแยกปัญหา config, process, probe หรือ resource'),
  question('cloud-scaling', 'Scalability & Reliability', 'โหลดเพิ่มขึ้นเป็นช่วงเวลาและ service stateless ควรจัดการอย่างไร?', 'กำหนด autoscaling จาก metrics ที่เหมาะสม พร้อม capacity floor/ceiling และ alert', ['สร้าง instance สูงสุดถาวรโดยไม่วัด', 'ปิด rate limit ทุก service', 'ให้ผู้ใช้ retry request ไม่จำกัด'], 'autoscaling ตาม metric และขอบเขตช่วยตอบสนองโหลดโดยควบคุมต้นทุน'),
  question('cloud-observe', 'Monitoring & Observability', 'หลัง deploy ค่า error rate เพิ่ม แต่ CPU ปกติ ควรทำอย่างไร?', 'เชื่อม metrics, logs, traces และ deployment marker เพื่อระบุบริการ/รุ่นที่เปลี่ยน', ['สรุปว่าไม่มีปัญหาเพราะ CPU ปกติ', 'รีสตาร์ตทุก resource โดยไม่ตรวจ', 'ปิด error alert'], 'สัญญาณหลายแบบและบริบทการ deploy ช่วย pinpoint ปัญหาได้'),
  question('cloud-secrets', 'Secrets Management', 'พบ secret ใน IaC state ที่ถูกแชร์ผิดที่ ควรทำอย่างไร?', 'จำกัดการเข้าถึง state และหมุน secret ที่อาจรั่ว พร้อมแก้การจัดเก็บ', ['ลบข้อความจากไฟล์ล่าสุดแล้วใช้ secret เดิมต่อ', 'ทำ repository เป็น private แล้วไม่ตรวจการเข้าถึง', 'โพสต์ state ให้ทีมตรวจโดยไม่มี access control'], 'ถือ secret ที่เปิดเผยว่า compromised และป้องกัน state ที่มีข้อมูลละเอียดอ่อน'),
  question('cloud-cost', 'Cloud Cost Management', 'ค่าใช้จ่าย storage เพิ่มขึ้นต่อเนื่อง ควรเริ่มจากอะไร?', 'แยกต้นทุนตาม service/tag ตรวจ retention และ lifecycle policy ก่อนเปลี่ยน', ['ลบข้อมูลที่ใหญ่ที่สุดทันที', 'ปิด billing alert', 'ปิด backup ทั้งหมดเพื่อประหยัด'], 'ข้อมูลต้นทุนและ retention ช่วยลดค่าใช้จ่ายโดยไม่ทำลายความพร้อมใช้งาน'),
  question('cloud-deploy', 'CI/CD & Release', 'ต้อง deploy service หลาย instance โดยไม่หยุดให้บริการ ควรวางแผนอย่างไร?', 'ใช้ rolling/canary deployment พร้อม health checks และ rollback criteria', ['หยุดทุก instance แล้วค่อยเริ่มรุ่นใหม่', 'แทนที่ทั้งหมดพร้อมกันโดยไม่ตรวจ readiness', 'ลบรุ่นก่อน deploy รุ่นใหม่'], 'การทยอยปล่อยพร้อม health checks ลด downtime และจำกัด blast radius'),
  question('cloud-recovery', 'Disaster Recovery', 'ระบบสำคัญต้องกู้คืนเมื่อ region ใช้งานไม่ได้ ควรเตรียมอย่างไร?', 'กำหนด RPO/RTO และซ้อม failover/restore ในสภาพแวดล้อมที่ควบคุมได้', ['ถือว่าการมี multi-region แปลว่ากู้คืนได้แน่นอน', 'เก็บ backup ใน region เดียวกับระบบหลักเท่านั้น', 'รอเกิดเหตุจริงจึงค่อยเขียนขั้นตอน'], 'การซ้อมตาม RPO/RTO ยืนยันว่าแผนและข้อมูลสำรองใช้งานได้จริง'),
];

export const ASSESSMENT_BANKS: Partial<Record<string, AssessmentQuestion[]>> = {
  'Software Engineer': SOFTWARE_ENGINEER_QUESTIONS,
  'Backend Developer': BACKEND_DEVELOPER_QUESTIONS,
  'Frontend Developer': FRONTEND_DEVELOPER_QUESTIONS,
  'Full-Stack Web Developer': FULL_STACK_DEVELOPER_QUESTIONS,
  'Mobile App Developer': MOBILE_APP_DEVELOPER_QUESTIONS,
  'Data Engineer': DATA_ENGINEER_QUESTIONS,
  'Machine Learning Engineer': MACHINE_LEARNING_ENGINEER_QUESTIONS,
  'QA / Test Engineer': QA_TEST_ENGINEER_QUESTIONS,
  'Database Administrator': DATABASE_ADMINISTRATOR_QUESTIONS,
  'Cybersecurity Analyst': CYBERSECURITY_ANALYST_QUESTIONS,
  'Cloud Platform Engineer': CLOUD_PLATFORM_ENGINEER_QUESTIONS,
  'DevSecOps Engineer': DEVSECOPS_QUESTIONS,
};
