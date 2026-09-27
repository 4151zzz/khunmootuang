import React, { useState, useEffect } from 'react';
import {
  Student,
  Assignment,
  Submission,
  AttendanceRecord,
  ExamSession,
  WordCloudItem,
  LivePoll,
  LineSettings,
  MascotType,
  UserRole,
  OwnedPet,
  Classroom
} from './types';
import { storageService } from './services/storageService';
import { sound } from './services/soundService';
import { Navbar } from './components/Navbar';
import { MascotBanner } from './components/MascotBanner';
import { AssignmentsTab } from './components/tabs/AssignmentsTab';
import { AttendanceTab } from './components/tabs/AttendanceTab';
import { SeatingGridTab } from './components/tabs/SeatingGridTab';
import { ExamGuardTab } from './components/tabs/ExamGuardTab';
import { LiveRoomTab } from './components/tabs/LiveRoomTab';
import { GamificationTab } from './components/tabs/GamificationTab';
import { GalleryTab } from './components/tabs/GalleryTab';
import { RandomizerTab } from './components/tabs/RandomizerTab';
import { StudentPortal } from './components/StudentPortal';

// Modals
import { AiGradingModal } from './components/modals/AiGradingModal';
import { CanvasAnnotateModal } from './components/modals/CanvasAnnotateModal';
import { EggHatchModal } from './components/modals/EggHatchModal';
import { LineSimulatorModal } from './components/modals/LineSimulatorModal';
import { SettingsModal } from './components/modals/SettingsModal';
import { ManageClassModal } from './components/modals/ManageClassModal';
import { LineConnectGuideModal } from './components/modals/LineConnectGuideModal';

// Icons
import {
  FileText,
  UserCheck,
  Grid,
  ShieldAlert,
  Radio,
  Sparkles,
  Image,
  Shuffle
} from 'lucide-react';

export function App() {
  // Auto-detect role: If opened inside LINE app or URL param specifies ?role=student, default to student view!
  const [role, setRole] = useState<UserRole>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const paramRole = params.get('role') || params.get('mode');
      if (paramRole === 'student') return 'student';
      if (paramRole === 'teacher') return 'teacher';
      // If opened inside LINE In-App Browser, default to student!
      if (/Line/i.test(navigator.userAgent)) {
        return 'student';
      }
    }
    return 'teacher';
  });
  const [mascot, setMascot] = useState<MascotType>(() => storageService.getMascot());
  const [classrooms, setClassrooms] = useState<Classroom[]>(() => storageService.getClassrooms());
  const [selectedClass, setSelectedClass] = useState(() => classrooms[0]?.name || 'ม.4/1');
  const [activeStep, setActiveStep] = useState(2); // default 2: ทวงงาน

  const [students, setStudents] = useState<Student[]>(() => storageService.getStudents());
  const [assignments, setAssignments] = useState<Assignment[]>(() => storageService.getAssignments());
  const [submissions, setSubmissions] = useState<Submission[]>(() => storageService.getSubmissions());
  const [attendance, setAttendance] = useState<AttendanceRecord>(() => storageService.getAttendance());
  const [exam, setExam] = useState<ExamSession>(() => storageService.getExam());
  const [wordCloud, setWordCloud] = useState<WordCloudItem[]>(() => storageService.getWordCloud());
  const [poll, setPoll] = useState<LivePoll>(() => storageService.getPoll());
  const [settings, setSettings] = useState<LineSettings>(() => storageService.getSettings());

  const [showManageClassModal, setShowManageClassModal] = useState(false);
  const [showLineGuideModal, setShowLineGuideModal] = useState(false);

  // Active teacher tab
  const [activeTab, setActiveTab] = useState<
    'assignments' | 'attendance' | 'seating' | 'exam' | 'liveroom' | 'gamification' | 'gallery' | 'randomizer'
  >('assignments');

  // Active student for Student Portal view
  const [activeStudentId, setActiveStudentId] = useState<string>(students[0]?.id || 'std-1');

  // Modals state
  const [aiModalData, setAiModalData] = useState<{
    submission: Submission;
    student: Student;
    assignment: Assignment;
  } | null>(null);

  const [canvasModalData, setCanvasModalData] = useState<{
    submission: Submission;
    student: Student;
    assignment: Assignment;
  } | null>(null);

  const [hatchModalStudent, setHatchModalStudent] = useState<Student | null>(null);
  const [showLineModal, setShowLineModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);

  const handleBindStudentLine = (studentId: string, lineUserId: string, _lineDisplayName: string) => {
    setStudents((prev) =>
      prev.map((s) => (s.id === studentId ? { ...s, lineUserId } : s))
    );
  };

  useEffect(() => {
    storageService.saveClassrooms(classrooms);
  }, [classrooms]);

  useEffect(() => {
    storageService.saveStudents(students);
  }, [students]);

  useEffect(() => {
    storageService.saveAssignments(assignments);
  }, [assignments]);

  useEffect(() => {
    storageService.saveSubmissions(submissions);
  }, [submissions]);

  useEffect(() => {
    storageService.saveAttendance(attendance);
  }, [attendance]);

  useEffect(() => {
    storageService.saveExam(exam);
  }, [exam]);

  useEffect(() => {
    storageService.saveWordCloud(wordCloud);
  }, [wordCloud]);

  useEffect(() => {
    storageService.savePoll(poll);
  }, [poll]);

  useEffect(() => {
    storageService.saveSettings(settings);
  }, [settings]);

  useEffect(() => {
    storageService.saveMascot(mascot);
  }, [mascot]);

  // Handlers
  const handleUpdateSubmission = (updated: Submission) => {
    setSubmissions((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
  };

  const handleCreateAssignment = (newAssignment: Assignment) => {
    setAssignments((prev) => [newAssignment, ...prev]);
  };

  const handleAwardPoints = (studentId: string, points: number, _reason: string) => {
    setStudents((prev) =>
      prev.map((s) => {
        if (s.id === studentId) {
          const newExp = s.exp + points;
          const newLevel = Math.floor(newExp / 100) + 1;
          return {
            ...s,
            exp: newExp,
            level: newLevel
          };
        }
        return s;
      })
    );
  };

  const handleGiftEgg = (studentId: string) => {
    setStudents((prev) =>
      prev.map((s) => {
        if (s.id === studentId) {
          return { ...s, unopenedEggs: s.unopenedEggs + 1 };
        }
        return s;
      })
    );
  };

  const handlePetHatched = (newPet: OwnedPet) => {
    if (!hatchModalStudent) return;
    setStudents((prev) =>
      prev.map((s) => {
        if (s.id === hatchModalStudent.id) {
          return {
            ...s,
            unopenedEggs: Math.max(0, s.unopenedEggs - 1),
            exp: s.exp + 25,
            pets: [newPet, ...s.pets]
          };
        }
        return s;
      })
    );
  };

  const handleUploadHomework = (assignmentId: string, studentId: string, sampleImageUrl?: string) => {
    const existingIndex = submissions.findIndex(
      (s) => s.assignmentId === assignmentId && s.studentId === studentId
    );

    const updatedSub: Submission = {
      id: existingIndex >= 0 ? submissions[existingIndex].id : `sub-${Date.now()}`,
      assignmentId,
      studentId,
      submittedAt: new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }),
      fileUrl: sampleImageUrl || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80',
      status: 'submitted_ontime',
      maxScore: 10,
      peerLikes: 0,
      peerComments: []
    };

    if (existingIndex >= 0) {
      setSubmissions((prev) => prev.map((s, i) => (i === existingIndex ? updatedSub : s)));
    } else {
      setSubmissions((prev) => [...prev, updatedSub]);
    }

    // Award student +15 EXP and 1 Egg for submitting homework!
    setStudents((prev) =>
      prev.map((s) => {
        if (s.id === studentId) {
          return {
            ...s,
            exp: s.exp + 15,
            unopenedEggs: s.unopenedEggs + 1,
            streakDays: s.streakDays + 1
          };
        }
        return s;
      })
    );
  };

  const handleApplyAiGrade = (
    score: number,
    comment: string,
    aiFeedback: {
      strengths: string;
      suggestions: string;
      suggestedScore: number;
      rubricBreakdown: { criteria: string; passed: boolean; note: string }[];
    }
  ) => {
    if (!aiModalData) return;
    const { submission } = aiModalData;

    const updated: Submission = {
      ...submission,
      score,
      status: 'graded',
      teacherComment: comment,
      aiFeedback: {
        strengths: aiFeedback.strengths,
        suggestions: aiFeedback.suggestions,
        suggestedScore: aiFeedback.suggestedScore,
        criteriaReview: aiFeedback.rubricBreakdown
      }
    };

    handleUpdateSubmission(updated);
  };

  const handleSaveCanvasAnnotation = (annotatedDataUrl: string) => {
    if (!canvasModalData) return;
    const { submission } = canvasModalData;
    const updated: Submission = {
      ...submission,
      annotatedImageUrl: annotatedDataUrl
    };
    handleUpdateSubmission(updated);
  };

  // Pending count for the banner
  const pendingSubmissionsCount = students.filter((std) => {
    const sub = submissions.find(
      (s) => s.assignmentId === assignments[0]?.id && s.studentId === std.id
    );
    return !sub || sub.status === 'pending';
  }).length;

  const currentStudent = students.find((s) => s.id === activeStudentId) || students[0];

  const teacherTabs = [
    { id: 'assignments', label: 'การบ้าน & ตรวจงาน (6 ขั้น)', icon: FileText },
    { id: 'attendance', label: 'เช็คชื่อเข้าเรียน', icon: UserCheck },
    { id: 'seating', label: 'ผังห้อง & แต้มพิเศษ', icon: Grid },
    { id: 'exam', label: 'ระบบสอบ Anti-cheat', icon: ShieldAlert },
    { id: 'liveroom', label: 'จอสด (WordCloud/Poll)', icon: Radio },
    { id: 'gamification', label: 'Gamification & ไข่สุ่ม', icon: Sparkles },
    { id: 'gallery', label: 'แกลเลอรีผลงาน', icon: Image },
    { id: 'randomizer', label: 'กาชาปอง & สุ่มกลุ่ม', icon: Shuffle },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 selection:bg-pink-200 selection:text-pink-900">
      
      {/* Top Navbar */}
      <Navbar
        role={role}
        setRole={setRole}
        mascot={mascot}
        setMascot={setMascot}
        selectedClass={selectedClass}
        setSelectedClass={setSelectedClass}
        classrooms={classrooms}
        onOpenManageClass={() => setShowManageClassModal(true)}
        onOpenLineGuide={() => setShowLineGuideModal(true)}
        onOpenSettings={() => setShowSettingsModal(true)}
        onOpenLineModal={() => setShowLineModal(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        
        {/* Role Mode 1: Teacher Dashboard */}
        {role === 'teacher' && (
          <div className="space-y-6">
            
            {/* Mascot Banner with 6 Steps */}
            <MascotBanner
              mascot={mascot}
              pendingCount={pendingSubmissionsCount}
              totalStudents={students.length}
              activeStep={activeStep}
              onStepClick={(step) => {
                setActiveStep(step);
                setActiveTab('assignments');
              }}
              onQuickRemind={() => setShowLineModal(true)}
            />

            {/* Feature Tabs Bar */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
              {teacherTabs.map((t) => {
                const Icon = t.icon;
                const isActive = activeTab === t.id;
                return (
                  <button
                    key={t.id}
                    onClick={() => {
                      sound.playTick();
                      setActiveTab(t.id as typeof activeTab);
                    }}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all shrink-0 border ${
                      isActive
                        ? 'bg-slate-900 text-white border-slate-950 shadow-md'
                        : 'bg-white text-slate-600 hover:text-slate-900 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? 'text-amber-400' : 'text-slate-400'}`} />
                    <span>{t.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Active Tab Content */}
            <div className="mt-4">
              {activeTab === 'assignments' && (
                <AssignmentsTab
                  assignments={assignments}
                  students={students}
                  submissions={submissions}
                  activeStep={activeStep}
                  setActiveStep={setActiveStep}
                  onOpenAiGrading={(sub, std, asg) => setAiModalData({ submission: sub, student: std, assignment: asg })}
                  onOpenCanvas={(sub, std, asg) => setCanvasModalData({ submission: sub, student: std, assignment: asg })}
                  onOpenLineModal={() => setShowLineModal(true)}
                  onUpdateSubmission={handleUpdateSubmission}
                  onCreateAssignment={handleCreateAssignment}
                  mascot={mascot}
                />
              )}

              {activeTab === 'attendance' && (
                <AttendanceTab
                  students={students}
                  attendance={attendance}
                  onUpdateAttendance={setAttendance}
                />
              )}

              {activeTab === 'seating' && (
                <SeatingGridTab
                  students={students}
                  onAwardPoints={handleAwardPoints}
                  mascot={mascot}
                />
              )}

              {activeTab === 'exam' && (
                <ExamGuardTab
                  exam={exam}
                  students={students}
                  onUpdateExam={setExam}
                  mascot={mascot}
                />
              )}

              {activeTab === 'liveroom' && (
                <LiveRoomTab
                  wordCloud={wordCloud}
                  poll={poll}
                  onUpdateWordCloud={setWordCloud}
                  onUpdatePoll={setPoll}
                  mascot={mascot}
                />
              )}

              {activeTab === 'gamification' && (
                <GamificationTab
                  students={students}
                  onOpenHatchModal={(std) => setHatchModalStudent(std)}
                  onGiftEgg={handleGiftEgg}
                  mascot={mascot}
                />
              )}

              {activeTab === 'gallery' && (
                <GalleryTab
                  submissions={submissions}
                  students={students}
                  assignments={assignments}
                  onUpdateSubmission={handleUpdateSubmission}
                  mascot={mascot}
                />
              )}

              {activeTab === 'randomizer' && (
                <RandomizerTab
                  students={students}
                  mascot={mascot}
                />
              )}
            </div>

          </div>
        )}

        {/* Role Mode 2: Student LIFF Portal */}
        {role === 'student' && (
          <div className="space-y-4">
            
            {/* Student Picker Selector for Demo Simulator */}
            <div className="max-w-md mx-auto bg-white p-3 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between text-xs">
              <span className="font-bold text-slate-600">จำลองสลับดูมุมมองนักเรียน:</span>
              <select
                value={activeStudentId}
                onChange={(e) => setActiveStudentId(e.target.value)}
                className="font-bold bg-slate-100 border border-slate-300 rounded-xl px-2.5 py-1 outline-none text-slate-800"
              >
                {students.map((s) => (
                  <option key={s.id} value={s.id}>
                    เลขที่ {s.studentNumber} {s.name} ({s.nickname})
                  </option>
                ))}
              </select>
            </div>

            {/* Mobile LIFF Student Component */}
            <StudentPortal
              currentStudent={currentStudent}
              assignments={assignments}
              submissions={submissions}
              onOpenCanvas={(sub, std, asg) => setCanvasModalData({ submission: sub, student: std, assignment: asg })}
              onOpenHatchModal={(std) => setHatchModalStudent(std)}
              onUploadHomework={handleUploadHomework}
              mascot={mascot}
            />

          </div>
        )}

      </main>

      {/* Global Modals */}
      {aiModalData && (
        <AiGradingModal
          isOpen={true}
          onClose={() => setAiModalData(null)}
          submission={aiModalData.submission}
          student={aiModalData.student}
          assignment={aiModalData.assignment}
          geminiApiKey={settings.geminiApiKey}
          onApplyGrade={handleApplyAiGrade}
          mascot={mascot}
        />
      )}

      {canvasModalData && (
        <CanvasAnnotateModal
          isOpen={true}
          onClose={() => setCanvasModalData(null)}
          imageUrl={canvasModalData.submission.fileUrl}
          studentName={canvasModalData.student.name}
          assignmentTitle={canvasModalData.assignment.title}
          onSaveAnnotation={handleSaveCanvasAnnotation}
          mascot={mascot}
        />
      )}

      {hatchModalStudent && (
        <EggHatchModal
          isOpen={true}
          onClose={() => setHatchModalStudent(null)}
          onPetHatched={handlePetHatched}
          mascot={mascot}
        />
      )}

      {showLineModal && (
        <LineSimulatorModal
          isOpen={true}
          onClose={() => setShowLineModal(false)}
          assignment={assignments[0]}
          students={students}
          mascot={mascot}
        />
      )}

      {showSettingsModal && (
        <SettingsModal
          isOpen={true}
          onClose={() => setShowSettingsModal(false)}
          settings={settings}
          onSaveSettings={setSettings}
        />
      )}

      {showManageClassModal && (
        <ManageClassModal
          isOpen={true}
          onClose={() => setShowManageClassModal(false)}
          classrooms={classrooms}
          students={students}
          selectedClass={selectedClass}
          onSelectClass={setSelectedClass}
          onSaveClassrooms={setClassrooms}
          onSaveStudents={setStudents}
        />
      )}

      {showLineGuideModal && (
        <LineConnectGuideModal
          isOpen={true}
          onClose={() => setShowLineGuideModal(false)}
          students={students}
          classrooms={classrooms}
          selectedClass={selectedClass}
          onBindStudentLine={handleBindStudentLine}
          mascot={mascot}
        />
      )}

    </div>
  );
}

export default App;
