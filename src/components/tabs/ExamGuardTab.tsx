import React, { useState, useEffect } from 'react';
import { ExamSession, Student } from '../../types';
import { AlertTriangle, Clock, Play, ShieldAlert, Award, RefreshCw, Smartphone } from 'lucide-react';
import { sound } from '../../services/soundService';

interface ExamGuardTabProps {
  exam: ExamSession;
  students: Student[];
  onUpdateExam: (updated: ExamSession) => void;
  mascot: 'pig' | 'chicken';
}

export const ExamGuardTab: React.FC<ExamGuardTabProps> = ({
  exam,
  students,
  onUpdateExam,
  mascot,
}) => {
  const [activeTab, setActiveTab] = useState<'teacher_monitor' | 'student_test'>('teacher_monitor');

  // Student test simulator state
  const [testTimeLeft, setTestTimeLeft] = useState(15 * 60); // 15 mins
  const [testSwitches, setTestSwitches] = useState(0);
  const [testAlertBanner, setTestAlertBanner] = useState<string | null>(null);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [examSubmitted, setExamSubmitted] = useState(false);

  // Anti-cheat Focus Guard: detect tab switch or window blur
  useEffect(() => {
    if (activeTab !== 'student_test' || examSubmitted) return;

    const handleFocusLoss = () => {
      sound.playWarning();
      setTestSwitches((prev) => {
        const next = prev + 1;
        setTestAlertBanner(`⚠️ ตรวจพบการสลับออกจากหน้าจอสอบ! (ครั้งที่ ${next}) ครูได้รับแจ้งเตือนแล้ว`);
        return next;
      });
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        handleFocusLoss();
      }
    };

    window.addEventListener('blur', handleFocusLoss);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('blur', handleFocusLoss);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [activeTab, examSubmitted]);

  // Countdown timer
  useEffect(() => {
    if (activeTab !== 'student_test' || examSubmitted || testTimeLeft <= 0) return;

    const timer = setInterval(() => {
      setTestTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [activeTab, examSubmitted, testTimeLeft]);

  const formatTimer = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m} นาที ${s.toString().padStart(2, '0')} วินาที`;
  };

  const handleSelectOption = (questionId: number, optionIdx: number) => {
    sound.playTap();
    setSelectedAnswers((prev) => ({ ...prev, [questionId]: optionIdx }));
  };

  const handleSubmitTestExam = () => {
    sound.playCoin();
    setExamSubmitted(true);

    // Calculate score
    let score = 0;
    exam.questions.forEach((q) => {
      if (selectedAnswers[q.id] === q.correctIndex) {
        score++;
      }
    });

    // Update teacher logs
    const existingLogs = exam.logs.filter((l) => l.studentId !== 'test-std');
    const newLogs = [
      ...existingLogs,
      {
        studentId: 'test-std',
        studentName: 'นักเรียนจำลอง (ทดสอบระบบ)',
        switchCount: testSwitches,
        status: testSwitches > 1 ? ('flagged' as const) : ('submitted' as const),
        score,
        lastBlurTime: testSwitches > 0 ? new Date().toLocaleTimeString('th-TH') : undefined
      }
    ];

    onUpdateExam({
      ...exam,
      logs: newLogs
    });
  };

  const mascotEmoji = mascot === 'chicken' ? '🐔' : '🐷';

  return (
    <div className="space-y-6">
      
      {/* Header card */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200/80 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold bg-rose-100 text-rose-800 px-2.5 py-0.5 rounded-full flex items-center gap-1">
              <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />
              ระบบสอบออนไลน์ Anti-cheat Guard
            </span>
            <span className="text-xs text-slate-500 font-medium">ห้อง {exam.classroom}</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-800 m-0">
            ระบบสอบ: รู้ทันทีเมื่อเด็กออกจากหน้าจอ ⏱️
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            ตรวจจับการสลับแท็บ ย่อเบราว์เซอร์ หรือเปิดแอปอื่นแบบเรียลไทม์ พร้อมบันทึกหลักฐาน
          </p>
        </div>

        {/* View Toggle */}
        <div className="flex items-center bg-slate-100 p-1 rounded-2xl border border-slate-200 text-xs">
          <button
            onClick={() => setActiveTab('teacher_monitor')}
            className={`px-4 py-2 rounded-xl font-bold transition-all ${
              activeTab === 'teacher_monitor' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            แดชบอร์ดครูคุมสอบ
          </button>
          <button
            onClick={() => setActiveTab('student_test')}
            className={`px-4 py-2 rounded-xl font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'student_test' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            ทดสอบทำข้อสอบจริง
          </button>
        </div>
      </div>

      {/* Mode 1: Teacher Monitor */}
      {activeTab === 'teacher_monitor' && (
        <div className="space-y-6">
          
          {/* Exam Summary Status */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-sm">
              <span className="text-xs font-bold text-slate-500">หัวข้อข้อสอบ</span>
              <div className="font-bold text-slate-800 text-sm mt-1">{exam.title}</div>
              <div className="text-xs text-rose-600 font-semibold mt-1">เวลาทำสอบ: {exam.durationMinutes} นาที</div>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-sm flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-slate-500">นักเรียนที่กำลังสอบ</span>
                <div className="text-2xl font-black text-indigo-600 mt-1">
                  {exam.logs.filter((l) => l.status === 'in_progress').length} คน
                </div>
              </div>
              <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                <Clock className="w-5 h-5 animate-spin" />
              </div>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-rose-200/80 shadow-sm flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-rose-700">พบการสลับหน้าจอ (Flagged)</span>
                <div className="text-2xl font-black text-rose-600 mt-1">
                  {exam.logs.filter((l) => l.switchCount > 0).length} คน
                </div>
              </div>
              <div className="w-10 h-10 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold">
                <AlertTriangle className="w-5 h-5" />
              </div>
            </div>
          </div>

          {/* Real-time Student Exam Logs Table */}
          <div className="bg-white rounded-3xl shadow-sm border border-slate-200/80 overflow-hidden">
            <div className="p-4 bg-slate-50/70 border-b border-slate-200 flex items-center justify-between text-xs font-bold text-slate-600">
              <span>สถานะการทำข้อสอบรายบุคคล</span>
              <span className="text-emerald-600 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                ตรวจจับ Focus สด
              </span>
            </div>

            <div className="divide-y divide-slate-100 text-xs">
              {exam.logs.map((log, index) => {
                const isFlagged = log.switchCount > 0;
                return (
                  <div
                    key={index}
                    className={`p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                      isFlagged ? 'bg-rose-50/40' : 'hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold ${
                          isFlagged ? 'bg-rose-200 text-rose-900' : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {index + 1}
                      </div>
                      <div>
                        <div className="font-bold text-slate-800 text-sm">{log.studentName}</div>
                        <div className="text-[11px] text-slate-500">
                          สถานะ:{' '}
                          {log.status === 'submitted'
                            ? 'ส่งข้อสอบแล้ว'
                            : log.status === 'flagged'
                            ? 'มีพฤติกรรมน่าสงสัย'
                            : 'กำลังทำข้อสอบ'}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      {isFlagged ? (
                        <div className="text-right">
                          <span className="inline-flex items-center gap-1 bg-rose-500 text-white font-black px-2.5 py-0.5 rounded-full text-[11px]">
                            <AlertTriangle className="w-3 h-3" /> ออกจากจอ {log.switchCount} ครั้ง!
                          </span>
                          {log.lastBlurTime && (
                            <div className="text-[10px] text-rose-600 mt-0.5">
                              ล่าสุดเวลา {log.lastBlurTime} น.
                            </div>
                          )}
                        </div>
                      ) : (
                        <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-800 font-bold px-2.5 py-0.5 rounded-full text-[11px]">
                          ✓ อยู่ในหน้าจอปกติ
                        </span>
                      )}

                      {log.score !== undefined && (
                        <div className="font-black text-sm bg-slate-100 text-slate-800 px-3 py-1 rounded-xl">
                          {log.score} / {exam.questions.length} คะแนน
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      )}

      {/* Mode 2: Live Student Test Simulator */}
      {activeTab === 'student_test' && (
        <div className="max-w-2xl mx-auto bg-white rounded-3xl shadow-xl border-2 border-slate-200 overflow-hidden">
          
          {/* Exam Header */}
          <div className="bg-gradient-to-r from-amber-400 via-rose-500 to-pink-500 p-5 text-white flex items-center justify-between">
            <div>
              <span className="text-xs font-black uppercase tracking-wider bg-white/20 px-2.5 py-0.5 rounded-full">
                จำลองหน้าจอสอบของนักเรียน
              </span>
              <h3 className="text-lg font-black mt-1">{exam.title}</h3>
            </div>
            
            {/* Live Timer */}
            <div className="bg-black/30 backdrop-blur-md px-3.5 py-2 rounded-2xl text-center border border-white/20">
              <span className="text-[10px] text-amber-200 block font-bold">เวลาที่เหลือ</span>
              <div className="text-sm font-black font-mono tracking-wider">{formatTimer(testTimeLeft)}</div>
            </div>
          </div>

          {/* Anti-cheat Alert Banner */}
          {testAlertBanner && (
            <div className="bg-rose-600 text-white p-3.5 text-xs font-bold flex items-center justify-between animate-pulse">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-300 shrink-0" />
                <span>{testAlertBanner}</span>
              </div>
              <button
                onClick={() => setTestAlertBanner(null)}
                className="text-white/80 hover:text-white underline text-[11px]"
              >
                รับทราบ
              </button>
            </div>
          )}

          {/* Simulation instructions */}
          <div className="p-4 bg-amber-50 border-b border-amber-200 text-amber-900 text-xs flex items-center gap-2">
            <span className="text-base">💡</span>
            <span>
              <strong>วิธีทดสอบ:</strong> ลองคลิกที่แท็บอื่น สลับหน้าต่าง หรือคลิกที่แอปพลิเคชันอื่น
              ระบบจะส่งเสียงเตือนและจับสถิติการสลับหน้าจอทันที!
            </span>
          </div>

          {!examSubmitted ? (
            <div className="p-6 space-y-6">
              
              <div className="flex items-center justify-between text-xs text-slate-500 pb-2 border-b border-slate-100">
                <span>จำนวนข้อสอบ: {exam.questions.length} ข้อ</span>
                <span className="font-bold text-rose-600">สลับหน้าจอแล้ว: {testSwitches} ครั้ง</span>
              </div>

              {exam.questions.map((q, idx) => (
                <div key={q.id} className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
                  <div className="font-bold text-slate-800 text-sm flex items-start gap-2">
                    <span className="w-6 h-6 rounded-lg bg-slate-800 text-white flex items-center justify-center text-xs shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <span>{q.question}</span>
                  </div>

                  <div className="space-y-2 pl-8 text-xs">
                    {q.options.map((opt, optIdx) => {
                      const isSelected = selectedAnswers[q.id] === optIdx;
                      return (
                        <button
                          key={optIdx}
                          type="button"
                          onClick={() => handleSelectOption(q.id, optIdx)}
                          className={`w-full text-left p-3 rounded-xl border transition-all flex items-center gap-3 ${
                            isSelected
                              ? 'bg-rose-500 text-white font-bold border-rose-600 shadow-sm'
                              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          <span
                            className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold border ${
                              isSelected ? 'border-white text-white' : 'border-slate-300 text-slate-500'
                            }`}
                          >
                            {String.fromCharCode(65 + optIdx)}
                          </span>
                          <span>{opt}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}

              <button
                onClick={handleSubmitTestExam}
                className="w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-black rounded-2xl text-sm shadow-xl active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                <Award className="w-4 h-4" />
                ส่งกระดาษคำตอบ
              </button>

            </div>
          ) : (
            <div className="p-8 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 text-3xl flex items-center justify-center mx-auto">
                🎉
              </div>
              <h4 className="text-xl font-black text-slate-800">ส่งข้อสอบเรียบร้อยแล้ว!</h4>
              <p className="text-xs text-slate-500">
                คะแนนและรายงานประวัติการสลับหน้าจอถูกบันทึกส่งไปยังแดชบอร์ดคุณครูเรียบร้อยแล้ว
              </p>

              <div className="inline-block bg-slate-100 p-4 rounded-2xl text-xs space-y-1">
                <div>จำนวนการออกจากหน้าจอ: <strong className="text-rose-600">{testSwitches} ครั้ง</strong></div>
                <div>สถานะการตรวจจับ: <strong>{testSwitches > 0 ? '⚠️ แจ้งเตือนครูแล้ว' : '✓ ซื่อสัตย์ 100%'}</strong></div>
              </div>

              <div>
                <button
                  onClick={() => {
                    setExamSubmitted(false);
                    setTestSwitches(0);
                    setSelectedAnswers({});
                    setTestTimeLeft(15 * 60);
                  }}
                  className="px-5 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 mx-auto"
                >
                  <RefreshCw className="w-3.5 h-3.5" /> ทำใหม่อีกครั้ง
                </button>
              </div>
            </div>
          )}

        </div>
      )}

    </div>
  );
};
