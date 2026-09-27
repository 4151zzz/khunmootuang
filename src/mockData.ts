import { Student, Assignment, Submission, AttendanceRecord, ExamSession, WordCloudItem, LivePoll } from './types';

export const INITIAL_STUDENTS: Student[] = [
  {
    id: 'std-1',
    studentNumber: 1,
    name: 'ด.ช. ภัทรพล สุขสวัสดิ์',
    nickname: 'ต้นกล้า',
    avatar: '👦',
    classroom: 'ม.4/1',
    lineUserId: 'U1001',
    exp: 240,
    level: 3,
    streakDays: 5,
    unopenedEggs: 2,
    seatRow: 1,
    seatCol: 1,
    pets: [
      {
        id: 'p-1',
        petId: 'pet-piglet',
        name: 'คุณหมูชมพูมีมง',
        type: 'pig',
        rarity: 'Rare',
        level: 2,
        imageUrl: '🐷👑',
        description: 'เจ้าหมูตัวน้อยที่มีความตั้งใจส่งงานตรงเวลาเสมอ!',
        obtainedAt: '2026-09-20'
      }
    ]
  },
  {
    id: 'std-2',
    studentNumber: 2,
    name: 'ด.ญ. กัญญารัตน์ วงศ์สว่าง',
    nickname: 'ฟ้าใส',
    avatar: '👧',
    classroom: 'ม.4/1',
    lineUserId: 'U1002',
    exp: 380,
    level: 4,
    streakDays: 7,
    unopenedEggs: 1,
    seatRow: 1,
    seatCol: 2,
    pets: [
      {
        id: 'p-2',
        petId: 'pet-chick-ninja',
        name: 'ลูกเจี๊ยบนินจา',
        type: 'chicken',
        rarity: 'Epic',
        level: 3,
        imageUrl: '🐣🥷',
        description: 'วิ่งส่งงานอย่างรวดเร็วดั่งสายลม ไม่เคยสายแม้แต่วินาทีเดียว',
        obtainedAt: '2026-09-18'
      }
    ]
  },
  {
    id: 'std-3',
    studentNumber: 3,
    name: 'ด.ช. ธนกร เมฆาพิสุทธิ์',
    nickname: 'วิน',
    avatar: '🧒',
    classroom: 'ม.4/1',
    lineUserId: 'U1003',
    exp: 150,
    level: 2,
    streakDays: 3,
    unopenedEggs: 0,
    seatRow: 1,
    seatCol: 3,
    pets: []
  },
  {
    id: 'std-4',
    studentNumber: 4,
    name: 'ด.ญ. ปรียาภรณ์ เลิศวิไล',
    nickname: 'มิวสิค',
    avatar: '👧',
    classroom: 'ม.4/1',
    lineUserId: 'U1004',
    exp: 420,
    level: 5,
    streakDays: 9,
    unopenedEggs: 3,
    seatRow: 1,
    seatCol: 4,
    pets: [
      {
        id: 'p-3',
        petId: 'pet-golden-pig',
        name: 'หมูทองคำเทวดา',
        type: 'pig',
        rarity: 'Legendary',
        level: 4,
        imageUrl: '✨🐷🪽',
        description: 'หมูเทพที่ปรากฏเฉพาะคนที่ส่งงานครบและคะแนนเต็ม 3 ชิ้นติด!',
        obtainedAt: '2026-09-15'
      }
    ]
  },
  {
    id: 'std-5',
    studentNumber: 5,
    name: 'ด.ช. อัครเดช เกรียงไกร',
    nickname: 'บอส',
    avatar: '👦',
    classroom: 'ม.4/1',
    lineUserId: 'U1005',
    exp: 90,
    level: 1,
    streakDays: 1,
    unopenedEggs: 1,
    seatRow: 2,
    seatCol: 1,
    pets: []
  },
  {
    id: 'std-6',
    studentNumber: 6,
    name: 'ด.ญ. ชนิกานต์ ดวงแก้ว',
    nickname: 'น้ำมนต์',
    avatar: '👧',
    classroom: 'ม.4/1',
    lineUserId: 'U1006',
    exp: 310,
    level: 3,
    streakDays: 6,
    unopenedEggs: 1,
    seatRow: 2,
    seatCol: 2,
    pets: [
      {
        id: 'p-4',
        petId: 'pet-dino-egg',
        name: 'ไดโนเขียวจอมขยัน',
        type: 'dino',
        rarity: 'Rare',
        level: 2,
        imageUrl: '🦕🌿',
        description: 'เคี้ยวใบไม้ไปด้วย ทำการบ้านส่งคุณครูไปด้วย',
        obtainedAt: '2026-09-22'
      }
    ]
  },
  {
    id: 'std-7',
    studentNumber: 7,
    name: 'ด.ช. ณัฐวุฒิ สิริวัฒนา',
    nickname: 'นนท์',
    avatar: '👦',
    classroom: 'ม.4/1',
    lineUserId: 'U1007',
    exp: 210,
    level: 3,
    streakDays: 4,
    unopenedEggs: 0,
    seatRow: 2,
    seatCol: 3,
    pets: []
  },
  {
    id: 'std-8',
    studentNumber: 8,
    name: 'ด.ญ. ณัชชา ธรรมดา',
    nickname: 'พลอย',
    avatar: '👧',
    classroom: 'ม.4/1',
    lineUserId: 'U1008',
    exp: 280,
    level: 3,
    streakDays: 5,
    unopenedEggs: 1,
    seatRow: 2,
    seatCol: 4,
    pets: []
  },
  {
    id: 'std-9',
    studentNumber: 9,
    name: 'ด.ช. ศิวกร ทรัพย์อนันต์',
    nickname: 'เต้',
    avatar: '👦',
    classroom: 'ม.4/1',
    lineUserId: 'U1009',
    exp: 110,
    level: 2,
    streakDays: 2,
    unopenedEggs: 1,
    seatRow: 3,
    seatCol: 1,
    pets: []
  },
  {
    id: 'std-10',
    studentNumber: 10,
    name: 'ด.ญ. วรินทร ศรีประเสริฐ',
    nickname: 'มายด์',
    avatar: '👧',
    classroom: 'ม.4/1',
    lineUserId: 'U1010',
    exp: 340,
    level: 4,
    streakDays: 6,
    unopenedEggs: 2,
    seatRow: 3,
    seatCol: 2,
    pets: []
  },
  {
    id: 'std-11',
    studentNumber: 11,
    name: 'ด.ช. พงศกร มณีวรรณ',
    nickname: 'เจมส์',
    avatar: '👦',
    classroom: 'ม.4/1',
    lineUserId: 'U1011',
    exp: 180,
    level: 2,
    streakDays: 3,
    unopenedEggs: 0,
    seatRow: 3,
    seatCol: 3,
    pets: []
  },
  {
    id: 'std-12',
    studentNumber: 12,
    name: 'ด.ญ. ธัญญา เรืองเดช',
    nickname: 'เบล',
    avatar: '👧',
    classroom: 'ม.4/1',
    lineUserId: 'U1012',
    exp: 260,
    level: 3,
    streakDays: 4,
    unopenedEggs: 1,
    seatRow: 3,
    seatCol: 4,
    pets: []
  }
];

export const INITIAL_ASSIGNMENTS: Assignment[] = [
  {
    id: 'asg-1',
    title: 'ใบงานที่ 3: การออกแบบผังงาน (Flowchart) และขั้นตอนวิธี',
    subject: 'วิทยาการคำนวณ',
    classroom: 'ม.4/1',
    description: 'ให้นักเรียนออกแบบโฟลว์ชาร์ตแสดงขั้นตอนการแก้ปัญหาตู้กดน้ำอัตโนมัติ โดยระบุจุดเริ่มต้น เงื่อนไข และจุดสิ้นสุดให้ถูกต้อง พร้อมระบายสีหรือเขียนคำอธิบายเพิ่มเติม',
    dueDate: '2026-09-29 17:00',
    maxScore: 10,
    rubrics: ['ความถูกต้องของสัญลักษณ์ Flowchart', 'การครอบคลุมกรณีเงื่อนไข', 'ความเรียบร้อยและความคิดสร้างสรรค์'],
    createdAt: '2026-09-25 09:00',
    step: 2, // กำลังทวงงาน
    reminderSentCount: 2
  },
  {
    id: 'asg-2',
    title: 'โครงงานขนาดเล็ก: เขียนสตอรี่บอร์ดแอนิเมชันรณรงค์ลดโลกร้อน',
    subject: 'การสื่อสารและการนำเสนอ (IS)',
    classroom: 'ม.4/1',
    description: 'วาดสตอรี่บอร์ดอย่างน้อย 6 ช่อง บรรยายการเล่าเรื่องและข้อคิดที่ต้องการส่งสาร',
    dueDate: '2026-10-02 23:59',
    maxScore: 20,
    rubrics: ['ความคิดริเริ่ม', 'การลำดับภาพและการเล่าเรื่อง', 'ความสมบูรณ์ของชิ้นงาน'],
    createdAt: '2026-09-26 13:00',
    step: 1, // มอบหมายแล้ว
    reminderSentCount: 0
  },
  {
    id: 'asg-3',
    title: 'แบบฝึกหัดที่ 2: ระบบสมการเชิงเส้นสองตัวแปร',
    subject: 'คณิตศาสตร์พื้นฐาน',
    classroom: 'ม.4/1',
    description: 'แสดงวิธีทำข้อ 1-5 จากเอกสารประกอบการเรียน พร้อมตรวจคำตอบ',
    dueDate: '2026-09-24 16:30',
    maxScore: 10,
    rubrics: ['ขั้นตอนการแก้สมการ', 'ความถูกต้องของคำตอบ', 'การตรวจคำตอบ'],
    createdAt: '2026-09-20 08:30',
    step: 4, // ตรวจแล้ว แจ้งผลเรียบร้อย
    reminderSentCount: 1
  }
];

export const SAMPLE_SUBMISSION_IMAGES = [
  'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=800&q=80'
];

export const INITIAL_SUBMISSIONS: Submission[] = [
  {
    id: 'sub-1',
    assignmentId: 'asg-1',
    studentId: 'std-2',
    submittedAt: '2026-09-26 14:20',
    fileUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80',
    status: 'graded',
    score: 10,
    maxScore: 10,
    teacherComment: 'ยอดเยี่ยมมาก ผังงานเขียนสัญลักษณ์ถูกต้อง และครอบคลุมกรณีเงินทอนครบถ้วน 🌟',
    aiFeedback: {
      strengths: 'ใช้สัญลักษณ์ Flowchart มาตรฐานได้ถูกต้องอย่างสมบูรณ์ ลอจิกการตัดสินใจกรณีเงินไม่พอชัดเจนมาก',
      suggestions: 'สามารถเพิ่ม Loop การยกเลิกรายการเพื่อให้สมบูรณ์แบบยิ่งขึ้น',
      suggestedScore: 10,
      criteriaReview: [
        { criteria: 'ความถูกต้องของสัญลักษณ์ Flowchart', passed: true, note: 'ถูกต้อง 100%' },
        { criteria: 'การครอบคลุมกรณีเงื่อนไข', passed: true, note: 'มีเงื่อนไขเงินครบ/ไม่ครบ' },
        { criteria: 'ความเรียบร้อยและความคิดสร้างสรรค์', passed: true, note: 'ลายเส้นชัดเจนอ่านง่าย' }
      ]
    },
    peerLikes: 6,
    peerComments: [
      { id: 'c-1', studentName: 'ฟ้าใส', text: 'วาดสวยและเข้าใจง่ายมากเลยเพื่อน!', time: '1 วันที่แล้ว' },
      { id: 'c-2', studentName: 'ต้นกล้า', text: 'ขอเอาเป็นตัวอย่างแนวคิดนะครับ 👍', time: '12 ชม.ที่แล้ว' }
    ]
  },
  {
    id: 'sub-2',
    assignmentId: 'asg-1',
    studentId: 'std-4',
    submittedAt: '2026-09-26 18:05',
    fileUrl: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=800&q=80',
    status: 'submitted_ontime',
    maxScore: 10,
    peerLikes: 4,
    peerComments: []
  },
  {
    id: 'sub-3',
    assignmentId: 'asg-1',
    studentId: 'std-1',
    submittedAt: '2026-09-27 10:15',
    fileUrl: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=800&q=80',
    status: 'submitted_ontime',
    maxScore: 10,
    peerLikes: 2,
    peerComments: []
  },
  {
    id: 'sub-4',
    assignmentId: 'asg-1',
    studentId: 'std-6',
    submittedAt: '2026-09-27 15:30',
    fileUrl: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=800&q=80',
    status: 'submitted_ontime',
    maxScore: 10,
    peerLikes: 3,
    peerComments: []
  },
  // Other students are still pending (asg-1)
  {
    id: 'sub-5',
    assignmentId: 'asg-1',
    studentId: 'std-3',
    status: 'pending',
    maxScore: 10,
    peerLikes: 0,
    peerComments: []
  },
  {
    id: 'sub-6',
    assignmentId: 'asg-1',
    studentId: 'std-5',
    status: 'pending',
    maxScore: 10,
    peerLikes: 0,
    peerComments: []
  },
  {
    id: 'sub-7',
    assignmentId: 'asg-1',
    studentId: 'std-7',
    status: 'pending',
    maxScore: 10,
    peerLikes: 0,
    peerComments: []
  },
  {
    id: 'sub-8',
    assignmentId: 'asg-1',
    studentId: 'std-8',
    status: 'pending',
    maxScore: 10,
    peerLikes: 0,
    peerComments: []
  },
  {
    id: 'sub-9',
    assignmentId: 'asg-1',
    studentId: 'std-9',
    status: 'pending',
    maxScore: 10,
    peerLikes: 0,
    peerComments: []
  },
  {
    id: 'sub-10',
    assignmentId: 'asg-1',
    studentId: 'std-10',
    status: 'pending',
    maxScore: 10,
    peerLikes: 0,
    peerComments: []
  },
  {
    id: 'sub-11',
    assignmentId: 'asg-1',
    studentId: 'std-11',
    status: 'pending',
    maxScore: 10,
    peerLikes: 0,
    peerComments: []
  },
  {
    id: 'sub-12',
    assignmentId: 'asg-1',
    studentId: 'std-12',
    status: 'pending',
    maxScore: 10,
    peerLikes: 0,
    peerComments: []
  }
];

export const INITIAL_ATTENDANCE: AttendanceRecord = {
  id: 'att-today',
  date: '2026-09-27',
  classroom: 'ม.4/1',
  records: [
    { studentId: 'std-1', status: 'present', checkInTime: '08:15' },
    { studentId: 'std-2', status: 'present', checkInTime: '08:10' },
    { studentId: 'std-3', status: 'late', checkInTime: '08:35' },
    { studentId: 'std-4', status: 'present', checkInTime: '08:05' },
    { studentId: 'std-5', status: 'absent' },
    { studentId: 'std-6', status: 'present', checkInTime: '08:18' },
    { studentId: 'std-7', status: 'present', checkInTime: '08:22' },
    { studentId: 'std-8', status: 'leave' },
    { studentId: 'std-9', status: 'present', checkInTime: '08:25' },
    { studentId: 'std-10', status: 'present', checkInTime: '08:12' },
    { studentId: 'std-11', status: 'present', checkInTime: '08:20' },
    { studentId: 'std-12', status: 'present', checkInTime: '08:14' }
  ]
};

export const INITIAL_EXAM: ExamSession = {
  id: 'exam-1',
  title: 'สอบเก็บคะแนนบทที่ 1: ขั้นตอนวิธีและการแก้ปัญหาเชิงคำนวณ',
  subject: 'วิทยาการคำนวณ',
  classroom: 'ม.4/1',
  durationMinutes: 15,
  active: true,
  questions: [
    {
      id: 1,
      question: 'ข้อใดคือขั้นตอนแรกในการแก้ปัญหาด้วยแนวคิดเชิงคำนวณ (Computational Thinking)?',
      options: ['การออกแบบอัลกอริทึม', 'การแยกย่อยปัญหา (Decomposition)', 'การหารูปแบบ (Pattern Recognition)', 'การคิดเชิงนามธรรม (Abstraction)'],
      correctIndex: 1
    },
    {
      id: 2,
      question: 'สัญลักษณ์รูปสี่เหลี่ยมขนมเปียกปูน (Diamond) ในผังงาน (Flowchart) ใช้แสดงสิ่งใด?',
      options: ['จุดเริ่มต้นและจุดสิ้นสุด', 'กระบวนการประมวลผล', 'การตัดสินใจหรือการเปรียบเทียบเงื่อนไข', 'การรับค่าข้อมูลเข้า'],
      correctIndex: 2
    },
    {
      id: 3,
      question: 'กรณีที่มีข้อมูล [5, 3, 8, 4, 2] เมื่อจัดเรียงแบบ Bubble Sort รอบแรกสุด ตัวเลขใดจะถูกย้ายไปอยู่ตำแหน่งขวาสุด?',
      options: ['2', '3', '5', '8'],
      correctIndex: 3
    }
  ],
  logs: [
    { studentId: 'std-1', studentName: 'ด.ช. ภัทรพล (ต้นกล้า)', switchCount: 0, status: 'in_progress' },
    { studentId: 'std-2', studentName: 'ด.ญ. กัญญารัตน์ (ฟ้าใส)', switchCount: 0, status: 'submitted', score: 3 },
    { studentId: 'std-3', studentName: 'ด.ช. ธนกร (วิน)', switchCount: 2, lastBlurTime: '20:31:14', status: 'flagged' },
    { studentId: 'std-4', studentName: 'ด.ญ. ปรียาภรณ์ (มิวสิค)', switchCount: 0, status: 'submitted', score: 3 },
    { studentId: 'std-7', studentName: 'ด.ช. ณัฐวุฒิ (นนท์)', switchCount: 1, lastBlurTime: '20:34:02', status: 'in_progress' }
  ]
};

export const INITIAL_WORD_CLOUD: WordCloudItem[] = [
  { id: 'w-1', word: 'สนุกสนาน', count: 12, color: '#f43f5e' },
  { id: 'w-2', word: 'ได้คิดวิเคราะห์', count: 9, color: '#0ea5e9' },
  { id: 'w-3', word: 'คุณหมูทวงน่ารัก', count: 14, color: '#ec4899' },
  { id: 'w-4', word: 'ไม่อยากมีงานค้าง', count: 8, color: '#10b981' },
  { id: 'w-5', word: 'Flowchart', count: 7, color: '#8b5cf6' },
  { id: 'w-6', word: 'ท้าทาย', count: 6, color: '#f59e0b' },
  { id: 'w-7', word: 'ได้คะแนน EXP', count: 11, color: '#06b6d4' },
  { id: 'w-8', word: 'สะสมสัตว์เลี้ยง', count: 10, color: '#84cc16' }
];

export const INITIAL_POLL: LivePoll = {
  question: 'ข้อใดคือส่วนที่ท้าทายที่สุดในการทำโจทย์ Flowchart วันนี้?',
  options: [
    { label: 'A: การแยกกรณีเงื่อนไข Yes / No', count: 7, color: '#ef4444' },
    { label: 'B: การจำสัญลักษณ์ผังงาน', count: 2, color: '#3b82f6' },
    { label: 'C: การวนซ้ำ Loop ตรวจสอบเงิน', count: 8, color: '#10b981' },
    { label: 'D: เข้าใจง่าย สบายมาก!', count: 4, color: '#f59e0b' }
  ],
  totalVotes: 21
};

export const PET_CATALOG = [
  {
    petId: 'pet-piglet',
    name: 'คุณหมูชมพูมีมง',
    type: 'pig',
    rarity: 'Common',
    imageUrl: '🐷👑',
    description: 'หมูน้อยน่ารัก ผู้ไม่เคยกลัวการบ้าน!',
  },
  {
    petId: 'pet-chick-ninja',
    name: 'ลูกเจี๊ยบนินจา',
    type: 'chicken',
    rarity: 'Rare',
    imageUrl: '🐣🥷',
    description: 'จอมยุทธ์แห่งความไว ส่งงานก่อนเดดไลน์เสมอ',
  },
  {
    petId: 'pet-dino-egg',
    name: 'ไดโนเขียวจอมขยัน',
    type: 'dino',
    rarity: 'Epic',
    imageUrl: '🦕🌿',
    description: 'ไดโนเสาร์ยุคดึกดำบรรพ์ ผู้เชี่ยวชาญการวาด Flowchart',
  },
  {
    petId: 'pet-golden-pig',
    name: 'หมูทองคำเทวดา',
    type: 'pig',
    rarity: 'Legendary',
    imageUrl: '✨🐷🪽',
    description: 'ตำนานหมูทองผู้คุ้มครองเกรด 4 ให้กับทุกคน',
  },
  {
    petId: 'pet-phoenix-chick',
    name: 'ไก่ฟีนิกซ์เปลวเพลิง',
    type: 'chicken',
    rarity: 'Legendary',
    imageUrl: '🔥🐔✨',
    description: 'ไก่เปลวเพลิง ปลุกพลังแห่งความตั้งใจในตัวเด็กทุกคน',
  }
];
