import React, { useState } from 'react';
import { Student } from '../../types';
import { Plus, Award, Heart, HelpCircle, Check, Zap } from 'lucide-react';
import { sound } from '../../services/soundService';

interface SeatingGridTabProps {
  students: Student[];
  onAwardPoints: (studentId: string, points: number, reason: string) => void;
  mascot: 'pig' | 'chicken';
}

export const SeatingGridTab: React.FC<SeatingGridTabProps> = ({
  students,
  onAwardPoints,
  mascot,
}) => {
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [floatingNotification, setFloatingNotification] = useState<string | null>(null);

  const rows = [1, 2, 3];
  const cols = [1, 2, 3, 4];

  const handlePointClick = (student: Student, points: number, reason: string) => {
    sound.playCoin();
    onAwardPoints(student.id, points, reason);

    setFloatingNotification(`+${points} คะแนน ให้ ${student.nickname}! (${reason})`);
    setTimeout(() => {
      setFloatingNotification(null);
    }, 2000);
  };

  const mascotEmoji = mascot === 'chicken' ? '🐔' : '🐷';

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200/80 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold bg-amber-100 text-amber-800 px-2.5 py-0.5 rounded-full">
              ระบบแจกคะแนนพิเศษ & ผังห้องเรียน
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-800 m-0">
            ผังที่นั่งประจำชั้นเรียน & แจกคะแนนเชิงบวก 🪑
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            คลิกที่โต๊ะนักเรียนเพื่อแจกคะแนนพฤติกรรมเชิงบวก (+1, +2, +3, +5 EXP) ทันที
          </p>
        </div>

        {floatingNotification && (
          <div className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-4 py-2 rounded-2xl text-xs font-bold shadow-lg animate-bounce flex items-center gap-1.5">
            <Zap className="w-4 h-4 text-amber-200" />
            <span>{floatingNotification}</span>
          </div>
        )}
      </div>

      {/* Classroom Seating Grid Blackboard/Platform */}
      <div className="bg-slate-100 p-6 rounded-3xl border border-slate-300 shadow-inner">
        
        {/* Front Whiteboard / Teacher Podium */}
        <div className="max-w-md mx-auto mb-8 bg-slate-800 text-white py-2 px-6 rounded-2xl text-center shadow-md border-b-4 border-slate-950 flex items-center justify-center gap-2">
          <span className="text-xs font-bold tracking-widest uppercase text-emerald-400">
            [ หน้าห้องเรียน / กระดานดำ ]
          </span>
          <span>{mascotEmoji}</span>
        </div>

        {/* Grid of Desks */}
        <div className="space-y-4 max-w-4xl mx-auto">
          {rows.map((r) => (
            <div key={r} className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
              {cols.map((c) => {
                const student = students.find((s) => s.seatRow === r && s.seatCol === c);

                if (!student) {
                  return (
                    <div
                      key={`${r}-${c}`}
                      className="border-2 border-dashed border-slate-300 rounded-2xl p-4 text-center text-slate-400 text-xs flex items-center justify-center min-h-[110px]"
                    >
                      โต๊ะว่าง
                    </div>
                  );
                }

                return (
                  <div
                    key={student.id}
                    onClick={() => setSelectedStudent(student)}
                    className="group bg-white rounded-2xl p-3.5 shadow-sm border border-slate-200 hover:border-rose-400 hover:shadow-md transition-all cursor-pointer relative"
                  >
                    {/* Seat header */}
                    <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1.5">
                      <span className="font-bold text-slate-600">เลขที่ {student.studentNumber}</span>
                      <span className="font-bold text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded">
                        {student.exp} EXP
                      </span>
                    </div>

                    {/* Student Info */}
                    <div className="flex items-center gap-2.5">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-pink-100 to-amber-100 flex items-center justify-center text-xl shrink-0 group-hover:scale-110 transition-transform">
                        {student.avatar}
                      </div>
                      <div className="overflow-hidden">
                        <div className="font-bold text-slate-800 text-xs truncate">
                          {student.name}
                        </div>
                        <div className="text-[11px] text-slate-500 font-medium">
                          ({student.nickname})
                        </div>
                      </div>
                    </div>

                    {/* Quick +1 Button hover */}
                    <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-[10px] text-slate-400">
                        {student.pets.length > 0 ? student.pets[0].imageUrl : '🥚 0 ตัว'}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handlePointClick(student, 1, 'ตอบคำถาม');
                        }}
                        className="bg-amber-100 hover:bg-amber-200 text-amber-800 font-black text-[11px] px-2 py-0.5 rounded-lg transition-transform active:scale-90 flex items-center gap-0.5"
                      >
                        <Plus className="w-3 h-3" /> 1
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>

      </div>

      {/* Selected Student Award Modal */}
      {selectedStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl p-6 shadow-2xl max-w-sm w-full border border-slate-200 text-center">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-pink-200 to-amber-200 text-3xl flex items-center justify-center mx-auto mb-3 shadow-inner">
              {selectedStudent.avatar}
            </div>
            <h3 className="font-black text-slate-900 text-lg">
              {selectedStudent.name} ({selectedStudent.nickname})
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              เลขที่ {selectedStudent.studentNumber} • ปัจจุบันมี {selectedStudent.exp} EXP
            </p>

            <span className="text-xs font-bold text-slate-700 block mb-2 text-left">
              เลือกเหตุผลการแจกคะแนนพฤติกรรมเชิงบวก:
            </span>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                onClick={() => {
                  handlePointClick(selectedStudent, 1, 'ตอบคำถามในห้อง');
                  setSelectedStudent(null);
                }}
                className="p-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold rounded-2xl border border-emerald-200 text-left transition-all active:scale-95"
              >
                <div className="text-lg mb-1">🙋‍♂️</div>
                <div>+1 คะแนน</div>
                <div className="text-[10px] text-emerald-600 font-normal">ตอบคำถาม</div>
              </button>

              <button
                onClick={() => {
                  handlePointClick(selectedStudent, 2, 'ช่วยเหลือเพื่อน');
                  setSelectedStudent(null);
                }}
                className="p-3 bg-pink-50 hover:bg-pink-100 text-pink-800 font-bold rounded-2xl border border-pink-200 text-left transition-all active:scale-95"
              >
                <div className="text-lg mb-1">💖</div>
                <div>+2 คะแนน</div>
                <div className="text-[10px] text-pink-600 font-normal">มีน้ำใจช่วยเพื่อน</div>
              </button>

              <button
                onClick={() => {
                  handlePointClick(selectedStudent, 3, 'ทำงานเสร็จไว');
                  setSelectedStudent(null);
                }}
                className="p-3 bg-amber-50 hover:bg-amber-100 text-amber-800 font-bold rounded-2xl border border-amber-200 text-left transition-all active:scale-95"
              >
                <div className="text-lg mb-1">⚡</div>
                <div>+3 คะแนน</div>
                <div className="text-[10px] text-amber-600 font-normal">ทำงานเสร็จไว</div>
              </button>

              <button
                onClick={() => {
                  handlePointClick(selectedStudent, 5, 'สอบผ่านยอดเยี่ยม');
                  setSelectedStudent(null);
                }}
                className="p-3 bg-indigo-50 hover:bg-indigo-100 text-indigo-800 font-bold rounded-2xl border border-indigo-200 text-left transition-all active:scale-95"
              >
                <div className="text-lg mb-1">👑</div>
                <div>+5 คะแนน</div>
                <div className="text-[10px] text-indigo-600 font-normal">ผลงานดีเด่น</div>
              </button>
            </div>

            <button
              onClick={() => setSelectedStudent(null)}
              className="mt-5 w-full py-2.5 text-slate-500 hover:bg-slate-100 rounded-xl text-xs font-bold"
            >
              ปิด
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
