import React, { useState } from 'react';
import {
  Assignment,
  Student,
  Submission,
  MascotType
} from '../../types';
import {
  Plus,
  Send,
  BellRing,
  CheckCircle,
  FileSpreadsheet,
  Download,
  Sparkles,
  ExternalLink,
  Edit2
} from 'lucide-react';
import { sound } from '../../services/soundService';

interface AssignmentsTabProps {
  assignments: Assignment[];
  students: Student[];
  submissions: Submission[];
  activeStep: number;
  setActiveStep: (step: number) => void;
  onOpenAiGrading: (submission: Submission, student: Student, assignment: Assignment) => void;
  onOpenCanvas: (submission: Submission, student: Student, assignment: Assignment) => void;
  onOpenLineModal: (assignment: Assignment) => void;
  onUpdateSubmission: (updated: Submission) => void;
  onCreateAssignment: (newAssignment: Assignment) => void;
  mascot: MascotType;
}

export const AssignmentsTab: React.FC<AssignmentsTabProps> = ({
  assignments,
  students,
  submissions,
  activeStep,
  setActiveStep,
  onOpenAiGrading,
  onOpenCanvas,
  onOpenLineModal,
  onUpdateSubmission,
  onCreateAssignment,
  mascot,
}) => {
  const [selectedAssignmentId, setSelectedAssignmentId] = useState<string>(assignments[0]?.id || '');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'submitted' | 'graded'>('all');

  // New assignment form state
  const [newTitle, setNewTitle] = useState('');
  const [newSubject, setNewSubject] = useState('วิทยาการคำนวณ');
  const [newDueDate, setNewDueDate] = useState('2026-10-05 17:00');
  const [newMaxScore, setNewMaxScore] = useState(10);
  const [newDescription, setNewDescription] = useState('');
  const [newRubrics, setNewRubrics] = useState('ความถูกต้อง, ความคิดสร้างสรรค์, การส่งตรงเวลา');

  const currentAssignment = assignments.find((a) => a.id === selectedAssignmentId) || assignments[0];

  // Map submissions with student info
  const enrichedSubmissions = students.map((std) => {
    const sub = submissions.find(
      (s) => s.assignmentId === currentAssignment?.id && s.studentId === std.id
    );
    return {
      student: std,
      submission: sub || {
        id: `sub-gen-${std.id}`,
        assignmentId: currentAssignment?.id || '',
        studentId: std.id,
        status: 'pending' as const,
        maxScore: currentAssignment?.maxScore || 10,
        peerLikes: 0,
        peerComments: []
      }
    };
  });

  const submittedCount = enrichedSubmissions.filter((s) => s.submission.status !== 'pending').length;
  const pendingCount = enrichedSubmissions.filter((s) => s.submission.status === 'pending').length;
  const gradedCount = enrichedSubmissions.filter((s) => s.submission.status === 'graded').length;

  const filteredList = enrichedSubmissions.filter((item) => {
    if (filterStatus === 'pending') return item.submission.status === 'pending';
    if (filterStatus === 'submitted') return item.submission.status.startsWith('submitted');
    if (filterStatus === 'graded') return item.submission.status === 'graded';
    return true;
  });

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle) return;

    sound.playCoin();
    const created: Assignment = {
      id: `asg-${Date.now()}`,
      title: newTitle,
      subject: newSubject,
      classroom: 'ม.4/1',
      description: newDescription,
      dueDate: newDueDate,
      maxScore: Number(newMaxScore),
      rubrics: newRubrics.split(',').map((r) => r.trim()).filter(Boolean),
      createdAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
      step: 1,
      reminderSentCount: 0
    };

    onCreateAssignment(created);
    setSelectedAssignmentId(created.id);
    setShowCreateModal(false);
    setNewTitle('');
    setNewDescription('');
  };

  const exportGradebookCSV = () => {
    sound.playCoin();
    const headers = ['เลขที่', 'ชื่อ-นามสกุล', 'ชื่อเล่น', 'สถานะการส่ง', 'คะแนนที่ได้', 'คะแนนเต็ม', 'ข้อเสนอแนะ'];
    const rows = enrichedSubmissions.map(({ student, submission }) => [
      student.studentNumber,
      student.name,
      student.nickname,
      submission.status === 'graded' ? 'ตรวจแล้ว' : submission.status === 'pending' ? 'ยังไม่ส่ง' : 'ส่งแล้ว',
      submission.score ?? '-',
      submission.maxScore,
      `"${submission.teacherComment || ''}"`
    ]);

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `คะแนน_${currentAssignment?.title.slice(0, 20)}_${currentAssignment?.classroom}.csv`;
    link.click();
  };

  const mascotEmoji = mascot === 'chicken' ? '🐔' : '🐷';

  return (
    <div className="space-y-6">
      
      {/* Top Bar: Assignment Selector + Actions */}
      <div className="bg-white p-4 sm:p-5 rounded-3xl shadow-sm border border-slate-200/80 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider shrink-0">
            เลือกการบ้าน:
          </label>
          <select
            value={selectedAssignmentId}
            onChange={(e) => setSelectedAssignmentId(e.target.value)}
            className="font-bold text-sm bg-slate-100 text-slate-800 border border-slate-200 rounded-2xl px-4 py-2 outline-none cursor-pointer focus:ring-2 focus:ring-rose-400"
          >
            {assignments.map((a) => (
              <option key={a.id} value={a.id}>
                [{a.subject}] {a.title}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => onOpenLineModal(currentAssignment)}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#06C755] hover:bg-[#05B34C] text-white rounded-2xl text-xs font-bold shadow-sm active:scale-95 transition-all"
          >
            <BellRing className="w-3.5 h-3.5" />
            ส่ง LINE ทวงงาน (Flex Card)
          </button>

          <button
            onClick={exportGradebookCSV}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-2xl text-xs font-bold border border-emerald-200 transition-colors"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
            Export Sheets
          </button>

          <button
            onClick={() => setShowCreateModal(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl text-xs font-bold shadow-md active:scale-95 transition-all"
          >
            <Plus className="w-3.5 h-3.5 text-amber-400" />
            มอบหมายงานใหม่
          </button>
        </div>
      </div>

      {/* Assignment Overview Card */}
      {currentAssignment && (
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200/80 relative overflow-hidden">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-bold bg-rose-100 text-rose-700 px-2.5 py-0.5 rounded-full">
                  {currentAssignment.subject}
                </span>
                <span className="text-xs text-slate-500 font-medium">
                  กำหนดส่ง: <strong className="text-rose-600">{currentAssignment.dueDate}</strong>
                </span>
                <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">
                  เต็ม {currentAssignment.maxScore} คะแนน
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-800 m-0">
                {currentAssignment.title}
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
                {currentAssignment.description}
              </p>
            </div>

            {/* Progress Metrics */}
            <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-2xl border border-slate-200 shrink-0">
              <div className="text-center px-3 border-r border-slate-200">
                <div className="text-lg font-black text-emerald-600">{submittedCount}</div>
                <div className="text-[11px] text-slate-500">ส่งแล้ว</div>
              </div>
              <div className="text-center px-3 border-r border-slate-200">
                <div className="text-lg font-black text-rose-600">{pendingCount}</div>
                <div className="text-[11px] text-slate-500">ยังไม่ส่ง</div>
              </div>
              <div className="text-center px-3">
                <div className="text-lg font-black text-indigo-600">{gradedCount}</div>
                <div className="text-[11px] text-slate-500">ตรวจแล้ว</div>
              </div>
            </div>
          </div>

          {/* Rubrics Pills */}
          <div className="pt-4 flex items-center justify-between flex-wrap gap-2 text-xs">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="font-bold text-slate-700">เกณฑ์ Rubrics:</span>
              {currentAssignment.rubrics.map((rb, i) => (
                <span
                  key={i}
                  className="bg-emerald-50 text-emerald-700 border border-emerald-200/80 px-2.5 py-0.5 rounded-xl font-medium"
                >
                  ✓ {rb}
                </span>
              ))}
            </div>

            <div className="text-[11px] text-slate-500 flex items-center gap-1">
              <span>{mascotEmoji} มีประวัติยิงทวงงานแล้ว</span>
              <strong className="text-slate-800">{currentAssignment.reminderSentCount} ครั้ง</strong>
            </div>
          </div>
        </div>
      )}

      {/* Submissions Filter & Table */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-200/80 overflow-hidden">
        
        {/* Filter Tab bar */}
        <div className="p-4 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 bg-slate-50/50">
          <div className="flex items-center gap-1 bg-slate-200/60 p-1 rounded-2xl text-xs">
            <button
              onClick={() => setFilterStatus('all')}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                filterStatus === 'all' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              ทั้งหมด ({enrichedSubmissions.length})
            </button>
            <button
              onClick={() => setFilterStatus('pending')}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                filterStatus === 'pending'
                  ? 'bg-rose-500 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              ยังไม่ส่ง ({pendingCount})
            </button>
            <button
              onClick={() => setFilterStatus('submitted')}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                filterStatus === 'submitted'
                  ? 'bg-amber-500 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              รอตรวจ ({submittedCount - gradedCount})
            </button>
            <button
              onClick={() => setFilterStatus('graded')}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                filterStatus === 'graded'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              ตรวจแล้ว ({gradedCount})
            </button>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-500">เลือกดูมุมมองขั้นตอน:</span>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5, 6].map((st) => (
                <button
                  key={st}
                  onClick={() => setActiveStep(st)}
                  className={`w-6 h-6 rounded-lg text-xs font-bold transition-all ${
                    activeStep === st ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Student Submissions List */}
        <div className="divide-y divide-slate-100">
          {filteredList.map(({ student, submission }) => {
            const isPending = submission.status === 'pending';
            const isGraded = submission.status === 'graded';

            return (
              <div
                key={student.id}
                className="p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-50/80 transition-colors"
              >
                {/* Student Info */}
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-pink-100 to-amber-100 flex items-center justify-center text-2xl border border-slate-200 shadow-sm shrink-0">
                    {student.avatar}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md">
                        เลขที่ {student.studentNumber}
                      </span>
                      <h4 className="font-bold text-slate-800 text-sm">{student.name}</h4>
                      <span className="text-xs text-slate-500">({student.nickname})</span>
                    </div>

                    <div className="flex items-center gap-2 mt-1 text-xs text-slate-500">
                      <span>EXP: <strong className="text-indigo-600">{student.exp}</strong></span>
                      <span>•</span>
                      <span>Streak: 🔥 {student.streakDays} วัน</span>
                      {submission.submittedAt && (
                        <>
                          <span>•</span>
                          <span className="text-emerald-700">ส่งเมื่อ {submission.submittedAt}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Status Badge & Feedback snippet */}
                <div className="flex flex-col md:items-center gap-1 text-xs">
                  {isPending ? (
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-rose-100 text-rose-700 font-bold border border-rose-200">
                      <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
                      ยังไม่ส่งการบ้าน
                    </span>
                  ) : isGraded ? (
                    <div className="text-left md:text-center">
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold border border-emerald-200">
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                        ตรวจแล้ว ({submission.score} / {submission.maxScore} คะแนน)
                      </span>
                      {submission.teacherComment && (
                        <p className="text-[11px] text-slate-500 mt-1 max-w-xs line-clamp-1 italic">
                          &ldquo;{submission.teacherComment}&rdquo;
                        </p>
                      )}
                    </div>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-100 text-amber-800 font-bold border border-amber-200">
                      ส่งตรงเวลา (รอตรวจ)
                    </span>
                  )}
                </div>

                {/* Actions per student */}
                <div className="flex items-center gap-2 flex-wrap">
                  {isPending ? (
                    <button
                      onClick={() => onOpenLineModal(currentAssignment)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-xl text-xs font-bold border border-rose-200 transition-colors"
                    >
                      <BellRing className="w-3.5 h-3.5" />
                      ทวงรายคน (LINE)
                    </button>
                  ) : (
                    <>
                      {/* Canvas Tool */}
                      <button
                        onClick={() => onOpenCanvas(submission, student, currentAssignment)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-xl text-xs font-bold border border-indigo-200 transition-colors"
                        title="เปิดกระดานเขียน/วาดตรวจบนใบงาน"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                        เขียนบนรูป
                      </button>

                      {/* AI Grading Assistant */}
                      <button
                        onClick={() => onOpenAiGrading(submission, student, currentAssignment)}
                        className="inline-flex items-center gap-1 px-3.5 py-1.5 bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-600 hover:to-amber-600 text-white rounded-xl text-xs font-bold shadow-sm active:scale-95 transition-all"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-amber-200" />
                        AI ช่วยตรวจ
                      </button>
                    </>
                  )}

                  {/* Fast Grade inline input if already submitted */}
                  {!isPending && (
                    <div className="flex items-center gap-1 bg-slate-100 px-2 py-1 rounded-xl border border-slate-200">
                      <input
                        type="number"
                        min="0"
                        max={currentAssignment.maxScore}
                        value={submission.score ?? ''}
                        placeholder="คะแนน"
                        onChange={(e) => {
                          const val = e.target.value === '' ? undefined : Number(e.target.value);
                          onUpdateSubmission({
                            ...submission,
                            score: val,
                            status: val !== undefined ? 'graded' : 'submitted_ontime'
                          });
                        }}
                        className="w-12 text-center text-xs font-bold bg-transparent outline-none"
                      />
                      <span className="text-[11px] text-slate-400">/{currentAssignment.maxScore}</span>
                    </div>
                  )}
                </div>

              </div>
            );
          })}
        </div>
      </div>

      {/* Create Assignment Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full p-6 border border-slate-200">
            <h3 className="text-lg font-black text-slate-900 mb-1">
              📝 สร้างงานใหม่ (ขั้นตอนที่ 1: มอบหมาย)
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              กำหนดหัวข้อ เกณฑ์ และส่ง Push Notification เข้า LINE ของนักเรียน
            </p>

            <form onSubmit={handleCreateSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">หัวข้องาน / ใบงาน:</label>
                <input
                  type="text"
                  required
                  placeholder="เช่น ใบงานที่ 4: การทำงานแบบมีเงื่อนไข"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-rose-400 font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">วิชา:</label>
                  <input
                    type="text"
                    value={newSubject}
                    onChange={(e) => setNewSubject(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl outline-none"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">คะแนนเต็ม:</label>
                  <input
                    type="number"
                    value={newMaxScore}
                    onChange={(e) => setNewMaxScore(Number(e.target.value))}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl outline-none font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">วันและเวลาที่กำหนดส่ง:</label>
                <input
                  type="text"
                  value={newDueDate}
                  onChange={(e) => setNewDueDate(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl outline-none text-rose-600 font-bold"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">เกณฑ์ Rubrics (คั่นด้วยจุลภาค):</label>
                <input
                  type="text"
                  value={newRubrics}
                  onChange={(e) => setNewRubrics(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">คำอธิบายรายละเอียดงาน:</label>
                <textarea
                  rows={3}
                  placeholder="เขียนคำชี้แจงเพิ่มเติมให้นักเรียน..."
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl outline-none"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl font-bold"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-600 hover:to-amber-600 text-white rounded-xl font-bold shadow-md active:scale-95 transition-all"
                >
                  ยืนยันมอบหมายงาน
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
