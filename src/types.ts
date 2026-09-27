export type MascotType = 'pig' | 'chicken';

export type UserRole = 'teacher' | 'student';

export interface Classroom {
  id: string;
  name: string;
  gradeLevel?: string;
  academicYear?: string;
  description?: string;
}

export interface Student {
  id: string;
  studentNumber: number;
  name: string;
  nickname: string;
  avatar: string;
  classroom: string;
  lineUserId?: string;
  exp: number;
  level: number;
  streakDays: number;
  unopenedEggs: number;
  pets: OwnedPet[];
  seatRow: number;
  seatCol: number;
}

export interface OwnedPet {
  id: string;
  petId: string;
  name: string;
  type: string;
  rarity: 'Common' | 'Rare' | 'Epic' | 'Legendary';
  level: number;
  imageUrl: string;
  description: string;
  obtainedAt: string;
}

export type SubmissionStatus = 'pending' | 'submitted_ontime' | 'submitted_late' | 'graded';

export interface Submission {
  id: string;
  assignmentId: string;
  studentId: string;
  submittedAt?: string;
  fileUrl?: string;
  annotatedImageUrl?: string;
  status: SubmissionStatus;
  score?: number;
  maxScore: number;
  teacherComment?: string;
  aiFeedback?: {
    strengths: string;
    suggestions: string;
    suggestedScore: number;
    criteriaReview: { criteria: string; passed: boolean; note: string }[];
  };
  peerLikes: number;
  peerComments: { id: string; studentName: string; text: string; time: string }[];
}

export interface Assignment {
  id: string;
  title: string;
  subject: string;
  classroom: string;
  description: string;
  dueDate: string;
  maxScore: number;
  rubrics: string[];
  createdAt: string;
  step: 1 | 2 | 3 | 4 | 5 | 6; // 1:มอบหมาย, 2:ทวงงาน, 3:ตรวจงาน, 4:แจ้งผล, 5:เข้าDrive, 6:ทำคะแนน
  reminderSentCount: number;
}

export type AttendanceStatus = 'present' | 'late' | 'leave' | 'absent';

export interface AttendanceRecord {
  id: string;
  date: string;
  classroom: string;
  records: {
    studentId: string;
    status: AttendanceStatus;
    checkInTime?: string;
  }[];
}

export interface ExamSession {
  id: string;
  title: string;
  subject: string;
  classroom: string;
  durationMinutes: number;
  questions: {
    id: number;
    question: string;
    options: string[];
    correctIndex: number;
  }[];
  active: boolean;
  logs: {
    studentId: string;
    studentName: string;
    switchCount: number;
    lastBlurTime?: string;
    status: 'in_progress' | 'submitted' | 'flagged';
    score?: number;
  }[];
}

export interface WordCloudItem {
  id: string;
  word: string;
  count: number;
  color: string;
}

export interface LivePoll {
  question: string;
  options: { label: string; count: number; color: string }[];
  totalVotes: number;
}

export interface LineSettings {
  channelAccessToken: string;
  channelSecret: string;
  liffId: string;
  webhookUrl: string;
  geminiApiKey: string;
}
