import { Student, Assignment, Submission, AttendanceRecord, ExamSession, WordCloudItem, LivePoll } from './types';

// Clean initial data - No mockups!
export const INITIAL_STUDENTS: Student[] = [];

export const INITIAL_ASSIGNMENTS: Assignment[] = [];

export const SAMPLE_SUBMISSION_IMAGES = [
  'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=800&q=80'
];

export const INITIAL_SUBMISSIONS: Submission[] = [];

export const INITIAL_ATTENDANCE: AttendanceRecord = {
  id: 'att-1',
  date: new Date().toISOString().split('T')[0],
  classroom: 'ม.4/1',
  records: []
};

export const INITIAL_EXAM: ExamSession = {
  id: 'exam-1',
  title: 'แบบทดสอบออนไลน์',
  subject: 'วิทยาการคำนวณ',
  classroom: 'ม.4/1',
  durationMinutes: 20,
  active: false,
  questions: [
    {
      id: 1,
      question: 'ข้อใดคือสัญลักษณ์เริ่มต้นและสิ้นสุดของ Flowchart?',
      options: ['วงรี (Terminator)', 'สี่เหลี่ยมผืนผ้า (Process)', 'สี่เหลี่ยมขนมเปียกปูน (Decision)', 'วงกลม (Connector)'],
      correctIndex: 0
    }
  ],
  logs: []
};

export const INITIAL_WORD_CLOUD: WordCloudItem[] = [];

export const INITIAL_POLL: LivePoll = {
  question: 'ความเข้าใจในบทเรียนวันนี้',
  options: [
    { label: 'A: เข้าใจดีมาก พร้อมลุยต่อ 🚀', count: 0, color: '#10b981' },
    { label: 'B: พอเข้าใจ ขอกลับไปทบทวน 📖', count: 0, color: '#3b82f6' },
    { label: 'C: ยังงงๆ อยากให้ครูอธิบายเพิ่ม 🙋', count: 0, color: '#f59e0b' }
  ],
  totalVotes: 0
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
    petId: 'pet-pig-ninja',
    name: 'คุณหมูนินจา',
    type: 'pig',
    rarity: 'Rare',
    imageUrl: '🐷🥷',
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
    petId: 'pet-galaxy-pig',
    name: 'หมูกาแล็กซีติดจรวด',
    type: 'pig',
    rarity: 'Legendary',
    imageUrl: '🚀🐷⭐',
    description: 'หมูท่องอวกาศ พลังแห่งความสำเร็จและคะแนนเต็ม!',
  }
];
