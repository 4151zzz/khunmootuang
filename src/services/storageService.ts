import { Student, Assignment, Submission, AttendanceRecord, ExamSession, WordCloudItem, LivePoll, LineSettings, MascotType, Classroom } from '../types';
import { INITIAL_STUDENTS, INITIAL_ASSIGNMENTS, INITIAL_SUBMISSIONS, INITIAL_ATTENDANCE, INITIAL_EXAM, INITIAL_WORD_CLOUD, INITIAL_POLL } from '../mockData';

const STORAGE_KEYS = {
  CLASSROOMS: 'khunmoo_classrooms',
  STUDENTS: 'khunmoo_students',
  ASSIGNMENTS: 'khunmoo_assignments',
  SUBMISSIONS: 'khunmoo_submissions',
  ATTENDANCE: 'khunmoo_attendance',
  EXAM: 'khunmoo_exam',
  WORD_CLOUD: 'khunmoo_wordcloud',
  POLL: 'khunmoo_poll',
  SETTINGS: 'khunmoo_settings',
  MASCOT: 'khunmoo_mascot_theme',
};

export const INITIAL_CLASSROOMS: Classroom[] = [
  { id: 'cls-1', name: 'ม.4/1', gradeLevel: 'ม.4', academicYear: '2569', description: 'ห้องเรียนวิทย์-คอมพิวเตอร์ (12 คน)' },
  { id: 'cls-2', name: 'ม.4/2', gradeLevel: 'ม.4', academicYear: '2569', description: 'ห้องเรียนวิทย์-คณิต' },
  { id: 'cls-3', name: 'ม.5/3', gradeLevel: 'ม.5', academicYear: '2569', description: 'ห้องเรียนศิลป์-คำนวณ' },
];

export const defaultSettings: LineSettings = {
  channelAccessToken: 'mock_line_channel_access_token_1234567890abcdef',
  channelSecret: 'mock_channel_secret_987654',
  liffId: '2001234567-AbCdEfGh',
  webhookUrl: 'https://api.khunmootuang.app/webhook/line',
  geminiApiKey: '',
};

export const storageService = {
  getClassrooms(): Classroom[] {
    const raw = localStorage.getItem(STORAGE_KEYS.CLASSROOMS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.CLASSROOMS, JSON.stringify(INITIAL_CLASSROOMS));
      return INITIAL_CLASSROOMS;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return INITIAL_CLASSROOMS;
    }
  },

  saveClassrooms(classrooms: Classroom[]) {
    localStorage.setItem(STORAGE_KEYS.CLASSROOMS, JSON.stringify(classrooms));
  },

  getStudents(): Student[] {
    const raw = localStorage.getItem(STORAGE_KEYS.STUDENTS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(INITIAL_STUDENTS));
      return INITIAL_STUDENTS;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return INITIAL_STUDENTS;
    }
  },

  saveStudents(students: Student[]) {
    localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(students));
  },

  getAssignments(): Assignment[] {
    const raw = localStorage.getItem(STORAGE_KEYS.ASSIGNMENTS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.ASSIGNMENTS, JSON.stringify(INITIAL_ASSIGNMENTS));
      return INITIAL_ASSIGNMENTS;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return INITIAL_ASSIGNMENTS;
    }
  },

  saveAssignments(assignments: Assignment[]) {
    localStorage.setItem(STORAGE_KEYS.ASSIGNMENTS, JSON.stringify(assignments));
  },

  getSubmissions(): Submission[] {
    const raw = localStorage.getItem(STORAGE_KEYS.SUBMISSIONS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.SUBMISSIONS, JSON.stringify(INITIAL_SUBMISSIONS));
      return INITIAL_SUBMISSIONS;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return INITIAL_SUBMISSIONS;
    }
  },

  saveSubmissions(submissions: Submission[]) {
    localStorage.setItem(STORAGE_KEYS.SUBMISSIONS, JSON.stringify(submissions));
  },

  getAttendance(): AttendanceRecord {
    const raw = localStorage.getItem(STORAGE_KEYS.ATTENDANCE);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.ATTENDANCE, JSON.stringify(INITIAL_ATTENDANCE));
      return INITIAL_ATTENDANCE;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return INITIAL_ATTENDANCE;
    }
  },

  saveAttendance(attendance: AttendanceRecord) {
    localStorage.setItem(STORAGE_KEYS.ATTENDANCE, JSON.stringify(attendance));
  },

  getExam(): ExamSession {
    const raw = localStorage.getItem(STORAGE_KEYS.EXAM);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.EXAM, JSON.stringify(INITIAL_EXAM));
      return INITIAL_EXAM;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return INITIAL_EXAM;
    }
  },

  saveExam(exam: ExamSession) {
    localStorage.setItem(STORAGE_KEYS.EXAM, JSON.stringify(exam));
  },

  getWordCloud(): WordCloudItem[] {
    const raw = localStorage.getItem(STORAGE_KEYS.WORD_CLOUD);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.WORD_CLOUD, JSON.stringify(INITIAL_WORD_CLOUD));
      return INITIAL_WORD_CLOUD;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return INITIAL_WORD_CLOUD;
    }
  },

  saveWordCloud(items: WordCloudItem[]) {
    localStorage.setItem(STORAGE_KEYS.WORD_CLOUD, JSON.stringify(items));
  },

  getPoll(): LivePoll {
    const raw = localStorage.getItem(STORAGE_KEYS.POLL);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.POLL, JSON.stringify(INITIAL_POLL));
      return INITIAL_POLL;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return INITIAL_POLL;
    }
  },

  savePoll(poll: LivePoll) {
    localStorage.setItem(STORAGE_KEYS.POLL, JSON.stringify(poll));
  },

  getSettings(): LineSettings {
    const raw = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(defaultSettings));
      return defaultSettings;
    }
    try {
      return { ...defaultSettings, ...JSON.parse(raw) };
    } catch {
      return defaultSettings;
    }
  },

  saveSettings(settings: LineSettings) {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  },

  getMascot(): MascotType {
    const raw = localStorage.getItem(STORAGE_KEYS.MASCOT);
    return (raw === 'chicken' ? 'chicken' : 'pig') as MascotType;
  },

  saveMascot(mascot: MascotType) {
    localStorage.setItem(STORAGE_KEYS.MASCOT, mascot);
  },

  resetAll() {
    localStorage.clear();
    location.reload();
  }
};
