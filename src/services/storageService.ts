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

// Automatic cleanup of old mock data from browser localStorage
if (typeof window !== 'undefined') {
  const CLEAN_FLAG = 'khunmoo_mock_cleaned_final_v5';
  if (!localStorage.getItem(CLEAN_FLAG)) {
    localStorage.removeItem(STORAGE_KEYS.STUDENTS);
    localStorage.removeItem(STORAGE_KEYS.ASSIGNMENTS);
    localStorage.removeItem(STORAGE_KEYS.SUBMISSIONS);
    localStorage.removeItem(STORAGE_KEYS.ATTENDANCE);
    localStorage.removeItem(STORAGE_KEYS.WORD_CLOUD);
    localStorage.removeItem(STORAGE_KEYS.POLL);
    localStorage.removeItem('khunmoo_bound_student_id');
    localStorage.setItem(CLEAN_FLAG, 'true');
  }
}

export const INITIAL_CLASSROOMS: Classroom[] = [
  { id: 'cls-1', name: 'ม.4/1', gradeLevel: 'ม.4', academicYear: '2569', description: 'ห้องเรียนเริ่มต้น' },
];

export const defaultSettings: LineSettings = {
  channelAccessToken: '',
  channelSecret: '',
  liffId: '',
  webhookUrl: '',
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
      localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify([]));
      return [];
    }
    try {
      return JSON.parse(raw);
    } catch {
      return [];
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
    return 'pig';
  },

  saveMascot(_mascot: MascotType) {
    localStorage.setItem(STORAGE_KEYS.MASCOT, 'pig');
  },

  resetAll() {
    localStorage.clear();
    location.reload();
  }
};
