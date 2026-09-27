import React, { useState } from 'react';
import { X, Sparkles, Check, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';
import { Submission, Student, Assignment } from '../../types';
import { aiGradingService, AiGradingResult } from '../../services/aiGradingService';
import { sound } from '../../services/soundService';

interface AiGradingModalProps {
  isOpen: boolean;
  onClose: () => void;
  submission: Submission;
  student: Student;
  assignment: Assignment;
  geminiApiKey?: string;
  onApplyGrade: (score: number, comment: string, aiFeedback: AiGradingResult) => void;
  mascot: 'pig' | 'chicken';
}

export const AiGradingModal: React.FC<AiGradingModalProps> = ({
  isOpen,
  onClose,
  submission,
  student,
  assignment,
  geminiApiKey,
  onApplyGrade,
  mascot,
}) => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AiGradingResult | null>(
    submission.aiFeedback
      ? {
          strengths: submission.aiFeedback.strengths,
          suggestions: submission.aiFeedback.suggestions,
          suggestedScore: submission.aiFeedback.suggestedScore,
          rubricBreakdown: submission.aiFeedback.criteriaReview,
          encouragement: 'ผลงานดีเยี่ยม พัฒนาต่ออย่างต่อเนื่อง!'
        }
      : null
  );

  const [customScore, setCustomScore] = useState<number>(
    submission.score || (result ? result.suggestedScore : assignment.maxScore)
  );
  const [customComment, setCustomComment] = useState<string>(
    submission.teacherComment || (result ? result.strengths : '')
  );

  if (!isOpen) return null;

  const handleRunAi = async () => {
    setLoading(true);
    try {
      const evalResult = await aiGradingService.evaluateSubmission(
        assignment.title,
        assignment.rubrics,
        student.name,
        submission.fileUrl,
        geminiApiKey
      );
      setResult(evalResult);
      setCustomScore(evalResult.suggestedScore);
      setCustomComment(`${evalResult.strengths} (${evalResult.encouragement})`);
      sound.playCoin();
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = () => {
    if (!result) return;
    sound.playCoin();
    onApplyGrade(customScore, customComment, result);
    onClose();
  };

  const mascotEmoji = '🐷';
  const mascotTitle = 'คุณหมูช่วยตรวจ AI';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-900/70 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full flex flex-col max-h-[92vh] overflow-hidden border border-slate-200">
        
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-rose-50 via-pink-50 to-amber-50">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center text-2xl border border-rose-100">
              {mascotEmoji}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1 text-[11px] font-black bg-rose-500 text-white px-2 py-0.5 rounded-full shadow-sm">
                  <Sparkles className="w-3 h-3" />
                  {mascotTitle}
                </span>
                {geminiApiKey ? (
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.5 rounded-md">
                    ⚡ Gemini API
                  </span>
                ) : (
                  <span className="text-[10px] bg-slate-200 text-slate-700 font-medium px-1.5 py-0.5 rounded-md">
                    Smart Heuristics
                  </span>
                )}
              </div>
              <h3 className="text-lg font-bold text-slate-900 mt-0.5">
                ตรวจงาน: {student.name} ({student.nickname})
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-white rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5 flex-1 text-sm">
          
          {/* Assignment preview */}
          <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80">
            <span className="text-xs font-semibold text-slate-500">หัวข้อการบ้าน:</span>
            <div className="font-bold text-slate-800 mt-0.5">{assignment.title}</div>
            <div className="flex flex-wrap gap-1.5 mt-2">
              {assignment.rubrics.map((r, i) => (
                <span key={i} className="text-[11px] bg-white text-slate-600 px-2 py-0.5 rounded-md border border-slate-200">
                  ✓ {r}
                </span>
              ))}
            </div>
          </div>

          {/* Submission image thumbnail */}
          {submission.fileUrl && (
            <div className="flex items-center gap-3 p-3 bg-slate-100 rounded-2xl">
              <img
                src={submission.annotatedImageUrl || submission.fileUrl}
                alt="Student work"
                className="w-20 h-20 rounded-xl object-cover border border-white shadow-sm"
              />
              <div>
                <span className="text-xs font-bold text-slate-700">หลักฐานชิ้นงานที่ส่ง</span>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  ส่งเมื่อ: {submission.submittedAt || 'ส่งเรียบร้อยแล้ว'}
                </p>
                {submission.annotatedImageUrl && (
                  <span className="inline-block mt-1 text-[10px] bg-emerald-100 text-emerald-700 font-bold px-1.5 py-0.5 rounded">
                    ✏️ มีรอยตรวจเขียนบนรูปแล้ว
                  </span>
                )}
              </div>
            </div>
          )}

          {/* AI Trigger button if not yet run */}
          {!result && !loading && (
            <div className="text-center py-6 px-4 bg-gradient-to-b from-rose-50/50 to-white rounded-2xl border border-dashed border-rose-300">
              <Sparkles className="w-8 h-8 text-rose-500 mx-auto mb-2 animate-bounce" />
              <h4 className="font-bold text-slate-800">พร้อมให้ AI ช่วยประเมินงานหรือยัง?</h4>
              <p className="text-xs text-slate-500 max-w-md mx-auto mt-1 mb-4">
                ระบบจะวิเคราะห์เกณฑ์ Rubrics คัดกรองจุดเด่น จุดที่ควรปรับปรุง และแนะนำคะแนนที่เหมาะสมให้ครูทันที
              </p>
              <button
                onClick={handleRunAi}
                className="px-6 py-2.5 bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-600 hover:to-amber-600 text-white font-bold rounded-2xl text-xs shadow-lg shadow-rose-500/25 flex items-center gap-2 mx-auto active:scale-95 transition-all"
              >
                <Sparkles className="w-4 h-4 text-amber-200" />
                เริ่มวิเคราะห์งานด้วย AI เดี๋ยวนี้
              </button>
            </div>
          )}

          {/* Loading state */}
          {loading && (
            <div className="text-center py-10">
              <div className="w-12 h-12 border-4 border-rose-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
              <p className="font-bold text-slate-800">กำลังวิเคราะห์ชิ้นงานและเทียบเกณฑ์ Rubrics...</p>
              <p className="text-xs text-slate-500 mt-1">คุณหมูทวงกำลังเขียนคำแนะนำที่ช่วยสร้างแรงบันดาลใจให้นักเรียน</p>
            </div>
          )}

          {/* AI Result Card */}
          {result && !loading && (
            <div className="space-y-4 animate-fadeIn">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-rose-600 flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" /> ผลการวิเคราะห์จาก {mascotTitle}
                </span>
                <button
                  onClick={handleRunAi}
                  className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1 font-medium"
                >
                  <RefreshCw className="w-3 h-3" /> วิเคราะห์ใหม่
                </button>
              </div>

              {/* Rubric Breakdown */}
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-2">
                <span className="text-xs font-bold text-slate-700">เกณฑ์การประเมิน (Rubrics Checklist):</span>
                {result.rubricBreakdown.map((r, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs pt-1">
                    <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold text-slate-800">{r.criteria}: </span>
                      <span className="text-slate-600">{r.note}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Strengths & Suggestions */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="bg-emerald-50 border border-emerald-200/80 rounded-2xl p-3.5">
                  <span className="font-bold text-emerald-800 flex items-center gap-1 mb-1">
                    🌟 จุดเด่นของงาน
                  </span>
                  <p className="text-emerald-900 leading-relaxed">{result.strengths}</p>
                </div>
                <div className="bg-amber-50 border border-amber-200/80 rounded-2xl p-3.5">
                  <span className="font-bold text-amber-800 flex items-center gap-1 mb-1">
                    💡 ข้อเสนอแนะเพื่อต่อยอด
                  </span>
                  <p className="text-amber-900 leading-relaxed">{result.suggestions}</p>
                </div>
              </div>

              {/* Teacher Editing Form */}
              <div className="bg-white p-4 rounded-2xl border-2 border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-800">
                    คะแนนที่ให้ (คะแนนเต็ม {assignment.maxScore}):
                  </label>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-500">AI แนะนำ: {result.suggestedScore}</span>
                    <input
                      type="number"
                      min="0"
                      max={assignment.maxScore}
                      value={customScore}
                      onChange={(e) => setCustomScore(Number(e.target.value))}
                      className="w-20 px-3 py-1.5 text-center font-bold text-lg bg-slate-100 rounded-xl border border-slate-300 focus:outline-none focus:border-rose-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-800 block mb-1">
                    ข้อเสนอแนะส่งถึงนักเรียน (จะส่งเข้า LINE OA นักเรียน):
                  </label>
                  <textarea
                    rows={2}
                    value={customComment}
                    onChange={(e) => setCustomComment(e.target.value)}
                    className="w-full p-2.5 text-xs bg-slate-50 rounded-xl border border-slate-300 focus:outline-none focus:border-rose-500 leading-relaxed"
                  />
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
            <AlertCircle className="w-3.5 h-3.5 text-slate-400" />
            <span>ครูสามารถปรับคะแนนและความเห็นได้ก่อนยืนยันผล</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-slate-600 hover:bg-slate-200/60 rounded-xl text-xs font-bold transition-colors"
            >
              ปิด
            </button>
            {result && (
              <button
                onClick={handleConfirm}
                className="px-5 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md shadow-emerald-600/20 active:scale-95 transition-all"
              >
                <Check className="w-4 h-4" />
                บันทึกผลคะแนน & แจ้งเตือนนักเรียน
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
