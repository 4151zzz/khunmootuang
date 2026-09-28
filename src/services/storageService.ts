import { Student, Assignment, Submission, AttendanceRecord, ExamSession, WordCloudItem, LivePoll, LineSettings, MascotType, Classroom } from '../types';
import { INITIAL_ASSIGNMENTS, INITIAL_SUBMISSIONS, INITIAL_ATTENDANCE, INITIAL_EXAM, INITIAL_WORD_CLOUD, INITIAL_POLL } from '../mockData';
import { db } from '../firebase';
import { doc, getDoc, setDoc, onSnapshot, Unsubscribe } from 'firebase/firestore';

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

// Clean undefined values for Firestore
function sanitizeForFirestore<T>(data: T): T {
  return JSON.parse(JSON.stringify(data));
}

// Cache of last saved JSON to prevent redundant Firestore writes and cycles
const lastSavedJson: Record<string, string> = {};

// Helper to push to Firestore
async function syncToFirestore(key: string, data: unknown) {
  try {
    const jsonStr = JSON.stringify(data);
    if (lastSavedJson[key] === jsonStr) return;
    lastSavedJson[key] = jsonStr;

    const docRef = doc(db, 'classroom_data', key);
    await setDoc(docRef, { data: sanitizeForFirestore(data), updatedAt: Date.now() }, { merge: true });
  } catch (err) {
    console.warn(`Firestore sync error for ${key}:`, err);
  }
}

export interface RealtimeSyncCallbacks {
  onClassroomsChange?: (classrooms: Classroom[]) => void;
  onStudentsChange?: (students: Student[]) => void;
  onAssignmentsChange?: (assignments: Assignment[]) => void;
  onSubmissionsChange?: (submissions: Submission[]) => void;
  onAttendanceChange?: (attendance: AttendanceRecord) => void;
  onExamChange?: (exam: ExamSession) => void;
  onWordCloudChange?: (items: WordCloudItem[]) => void;
  onPollChange?: (poll: LivePoll) => void;
  onSettingsChange?: (settings: LineSettings) => void;
}

export const storageService = {
  // Real-time synchronization with Firebase Cloud Firestore
  initRealtimeSync(callbacks: RealtimeSyncCallbacks): Unsubscribe {
    const unsubscribes: Unsubscribe[] = [];

    const bindDoc = <T>(
      key: string,
      storageKey: string,
      fallbackValue: T,
      callback?: (data: T) => void
    ) => {
      if (!callback) return;

      const docRef = doc(db, 'classroom_data', key);
      const unsub = onSnapshot(docRef, (snapshot) => {
        if (snapshot.exists()) {
          const val = snapshot.data()?.data as T;
          if (val !== undefined) {
            const jsonStr = JSON.stringify(val);
            if (lastSavedJson[key] !== jsonStr) {
              lastSavedJson[key] = jsonStr;
              localStorage.setItem(storageKey, jsonStr);
              callback(val);
            }
          }
        } else {
          // If doc does not exist in Firestore yet, seed it with current local value
          const currentLocal = localStorage.getItem(storageKey);
          if (currentLocal) {
            try {
              syncToFirestore(key, JSON.parse(currentLocal));
            } catch {
              syncToFirestore(key, fallbackValue);
            }
          } else {
            syncToFirestore(key, fallbackValue);
          }
        }
      }, (error) => {
        console.warn(`Realtime sync listener warning (${key}):`, error);
      });

      unsubscribes.push(unsub);
    };

    bindDoc('classrooms', STORAGE_KEYS.CLASSROOMS, INITIAL_CLASSROOMS, callbacks.onClassroomsChange);
    bindDoc('students', STORAGE_KEYS.STUDENTS, [], callbacks.onStudentsChange);
    bindDoc('assignments', STORAGE_KEYS.ASSIGNMENTS, INITIAL_ASSIGNMENTS, callbacks.onAssignmentsChange);
    bindDoc('submissions', STORAGE_KEYS.SUBMISSIONS, INITIAL_SUBMISSIONS, callbacks.onSubmissionsChange);
    bindDoc('attendance', STORAGE_KEYS.ATTENDANCE, INITIAL_ATTENDANCE, callbacks.onAttendanceChange);
    bindDoc('exam', STORAGE_KEYS.EXAM, INITIAL_EXAM, callbacks.onExamChange);
    bindDoc('wordCloud', STORAGE_KEYS.WORD_CLOUD, INITIAL_WORD_CLOUD, callbacks.onWordCloudChange);
    bindDoc('poll', STORAGE_KEYS.POLL, INITIAL_POLL, callbacks.onPollChange);
    bindDoc('settings', STORAGE_KEYS.SETTINGS, defaultSettings, callbacks.onSettingsChange);

    return () => {
      unsubscribes.forEach((fn) => fn());
    };
  },

  // Add or update student directly in Firestore to prevent overwrite conflicts
  async addOrUpdateStudent(newStudent: Student): Promise<Student[]> {
    try {
      const docRef = doc(db, 'classroom_data', 'students');
      const snap = await getDoc(docRef);
      let list: Student[] = snap.exists() && snap.data()?.data ? snap.data().data : this.getStudents();

      const existingIdx = list.findIndex(
        (s) => s.id === newStudent.id || (s.lineUserId && newStudent.lineUserId && s.lineUserId === newStudent.lineUserId)
      );

      if (existingIdx >= 0) {
        list[existingIdx] = { ...list[existingIdx], ...newStudent };
      } else {
        list.push(newStudent);
      }

      this.saveStudents(list);
      return list;
    } catch (err) {
      console.warn('Error in addOrUpdateStudent, falling back to local:', err);
      const list = this.getStudents();
      const existingIdx = list.findIndex((s) => s.id === newStudent.id);
      if (existingIdx >= 0) {
        list[existingIdx] = newStudent;
      } else {
        list.push(newStudent);
      }
      this.saveStudents(list);
      return list;
    }
  },

  // Add or update submission directly in Firestore
  async addOrUpdateSubmission(submission: Submission): Promise<Submission[]> {
    try {
      const docRef = doc(db, 'classroom_data', 'submissions');
      const snap = await getDoc(docRef);
      let list: Submission[] = snap.exists() && snap.data()?.data ? snap.data().data : this.getSubmissions();

      const idx = list.findIndex((s) => s.id === submission.id);
      if (idx >= 0) {
        list[idx] = submission;
      } else {
        list.push(submission);
      }

      this.saveSubmissions(list);
      return list;
    } catch (err) {
      console.warn('Error in addOrUpdateSubmission, falling back to local:', err);
      const list = this.getSubmissions();
      const idx = list.findIndex((s) => s.id === submission.id);
      if (idx >= 0) {
        list[idx] = submission;
      } else {
        list.push(submission);
      }
      this.saveSubmissions(list);
      return list;
    }
  },

  // Add classroom directly to Firestore & local storage
  async addClassroom(newClass: Classroom): Promise<Classroom[]> {
    try {
      const docRef = doc(db, 'classroom_data', 'classrooms');
      const snap = await getDoc(docRef);
      let list: Classroom[] = snap.exists() && snap.data()?.data ? snap.data().data : this.getClassrooms();

      if (!list.some((c) => c.id === newClass.id || c.name === newClass.name)) {
        list.push(newClass);
      }
      this.saveClassrooms(list);
      return list;
    } catch (err) {
      console.warn('Error in addClassroom, saving locally:', err);
      const list = this.getClassrooms();
      if (!list.some((c) => c.id === newClass.id || c.name === newClass.name)) {
        list.push(newClass);
      }
      this.saveClassrooms(list);
      return list;
    }
  },

  // Delete classroom
  async deleteClassroom(classId: string): Promise<Classroom[]> {
    const list = this.getClassrooms().filter((c) => c.id !== classId);
    this.saveClassrooms(list);
    return list;
  },

  // Delete student
  async deleteStudent(studentId: string): Promise<Student[]> {
    const list = this.getStudents().filter((s) => s.id !== studentId);
    this.saveStudents(list);
    return list;
  },

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
    syncToFirestore('classrooms', classrooms);
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
    syncToFirestore('students', students);
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
    syncToFirestore('assignments', assignments);
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
    syncToFirestore('submissions', submissions);
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
    syncToFirestore('attendance', attendance);
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
    syncToFirestore('exam', exam);
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
    syncToFirestore('wordCloud', items);
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
    syncToFirestore('poll', poll);
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
    syncToFirestore('settings', settings);
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
