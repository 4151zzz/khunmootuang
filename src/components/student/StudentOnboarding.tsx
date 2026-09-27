import React, { useState } from 'react';
import { Classroom, Student, MascotType } from '../../types';
import { LineUserProfile } from '../../services/liffService';
import { UserCheck, Sparkles, PlusCircle, Check, ArrowRight, ShieldCheck } from 'lucide-react';
import { sound } from '../../services/soundService';
import confetti from 'canvas-confetti';

interface StudentOnboardingProps {
  classrooms: Classroom[];
  students: Student[];
  mascot: MascotType;
  lineProfile: LineUserProfile | null;
  onComplete: (studentId: string, updatedStudents?: Student[]) => void;
}

export const StudentOnboarding: React.FC<StudentOnboardingProps> = ({
  classrooms,
  students,
  mascot,
  lineProfile,
  onComplete,
}) => {
  const [selectedClass, setSelectedClass] = useState<string>(classrooms[0]?.name || 'ม.4/1');
  const [selectedStudentId, setSelectedStudentId] = useState<string>('');
  
  // Custom new student registration tab
  const [isRegisteringNew, setIsRegisteringNew] = useState(false);
  const [newName, setNewName] = useState(lineProfile?.displayName || '');
  const [newNickname, setNewNickname] = useState('');
  const [newStudentNumber, setNewStudentNumber] = useState<number>(1);

  const mascotEmoji = '🐷';
  const mascotName = 'คุณหมูทวง';

  // Filter students by selected classroom
  const classStudents = students.filter((s) => s.classroom === selectedClass);

  const handleConfirm = () => {
    sound.playHatch();
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.7 }
    });

    if (isRegisteringNew) {
      if (!newName.trim()) {
        alert('กรุณากรอกชื่อ-นามสกุล');
        return;
      }
      const newStd: Student = {
        id: `std-${Date.now()}`,
        studentNumber: Number(newStudentNumber) || (classStudents.length + 1),
        name: newName.trim(),
        nickname: newNickname.trim() || newName.trim().slice(0, 5),
        avatar: mascot === 'pig' ? '🐷' : '🐣',
        classroom: selectedClass,
        lineUserId: lineProfile?.userId || `LINE_${Date.now()}`,
        exp: 50,
        level: 1,
        streakDays: 1,
        unopenedEggs: 1,
        seatRow: Math.floor(classStudents.length / 4) + 1,
        seatCol: (classStudents.length % 4) + 1,
        pets: [
          {
            id: `p-${Date.now()}`,
            petId: 'pet-welcome',
            name: `${mascotName}ตัวจิ๋ว`,
            type: mascot === 'pig' ? 'pig' : 'chicken',
            rarity: 'Common',
            level: 1,
            imageUrl: mascotEmoji,
            description: 'คู่หูเริ่มต้นการเดินทางในห้องเรียน!',
            obtainedAt: new Date().toISOString().split('T')[0]
          }
        ]
      };
      const updated = [...students, newStd];
      onComplete(newStd.id, updated);
    } else {
      if (!selectedStudentId) {
        alert('กรุณาเลือกรายชื่อนักเรียนของคุณ');
        return;
      }
      // Bind LINE User ID to existing student
      const updated = students.map((s) => {
        if (s.id === selectedStudentId) {
          return {
            ...s,
            lineUserId: lineProfile?.userId || s.lineUserId
          };
        }
        return s;
      });
      onComplete(selectedStudentId, updated);
    }
  };

  return (
    <div className="max-w-md mx-auto min-h-screen bg-slate-900/5 sm:py-6 px-3 flex flex-col justify-center">
      <div className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
        
        {/* Header Banner */}
        <div className="bg-gradient-to-br from-rose-500 via-pink-600 to-amber-500 text-white p-6 text-center relative overflow-hidden">
          <div className="absolute top-2 right-2 text-6xl opacity-15">
            {mascotEmoji}
          </div>
          <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl mx-auto flex items-center justify-center text-4xl shadow-inner border border-white/30 mb-3">
            {mascotEmoji}
          </div>
          <h2 className="text-xl font-black">ยินดีต้อนรับสู่ห้องเรียน!</h2>
          <p className="text-xs text-pink-100 mt-1">
            ลงทะเบียนเชื่อมบัญชี LINE กับระบบ {mascotName} V.2
          </p>
        </div>

        {/* LINE Profile Indicator */}
        <div className="bg-slate-50 border-b border-slate-200 px-5 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            {lineProfile?.pictureUrl ? (
              <img
                src={lineProfile.pictureUrl}
                alt="LINE Profile"
                className="w-9 h-9 rounded-full object-cover border-2 border-emerald-500 shadow-sm"
              />
            ) : (
              <div className="w-9 h-9 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-sm font-bold border border-emerald-300">
                LINE
              </div>
            )}
            <div>
              <div className="text-xs font-bold text-slate-800 flex items-center gap-1">
                <span>{lineProfile?.displayName || 'ผู้ใช้ LINE'}</span>
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              </div>
              <div className="text-[10px] text-slate-500">
                เชื่อมต่อผ่าน LINE สำเร็จ
              </div>
            </div>
          </div>

          <span className="text-[10px] bg-emerald-50 text-emerald-700 font-bold px-2 py-0.5 rounded-full border border-emerald-200">
            LIFF Active
          </span>
        </div>

        {/* Selection Form */}
        <div className="p-5 space-y-4">
          
          {/* Step 1: Choose Classroom */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              🏫 1. เลือกระดับชั้น / ห้องเรียนของคุณ:
            </label>
            <div className="grid grid-cols-3 gap-2">
              {classrooms.map((cls) => (
                <button
                  key={cls.id}
                  type="button"
                  onClick={() => {
                    sound.playTick();
                    setSelectedClass(cls.name);
                    setSelectedStudentId('');
                  }}
                  className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all text-center ${
                    selectedClass === cls.name
                      ? 'bg-rose-500 text-white border-rose-600 shadow-sm'
                      : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                  }`}
                >
                  ห้อง {cls.name}
                </button>
              ))}
            </div>
          </div>

          {/* Toggle Existing vs New Student */}
          <div className="flex bg-slate-100 p-1 rounded-xl text-xs font-bold">
            <button
              type="button"
              onClick={() => setIsRegisteringNew(false)}
              className={`flex-1 py-1.5 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                !isRegisteringNew
                  ? 'bg-white text-slate-800 shadow-sm'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>เลือกชื่อจากรายชื่อห้อง</span>
            </button>
            <button
              type="button"
              onClick={() => setIsRegisteringNew(true)}
              className={`flex-1 py-1.5 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                isRegisteringNew
                  ? 'bg-white text-slate-800 shadow-sm'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <PlusCircle className="w-3.5 h-3.5 text-rose-500" />
              <span>ลงทะเบียนชื่อใหม่</span>
            </button>
          </div>

          {/* Mode A: Select from existing class student roster */}
          {!isRegisteringNew ? (
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                👤 2. เลือกชื่อ-นามสกุลของคุณ (ห้อง {selectedClass}):
              </label>

              {classStudents.length === 0 ? (
                <div className="text-center py-6 bg-slate-50 rounded-2xl border border-dashed border-slate-300 text-xs text-slate-500">
                  ห้องนี้ยังไม่มีรายชื่อนักเรียน <br />
                  <button
                    type="button"
                    onClick={() => setIsRegisteringNew(true)}
                    className="mt-2 text-rose-600 font-bold underline"
                  >
                    กดลงทะเบียนชื่อใหม่ที่นี่
                  </button>
                </div>
              ) : (
                <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
                  {classStudents.map((std) => {
                    const isSelected = selectedStudentId === std.id;
                    const isAlreadyBound = std.lineUserId && std.lineUserId.startsWith('U');

                    return (
                      <div
                        key={std.id}
                        onClick={() => {
                          sound.playTick();
                          setSelectedStudentId(std.id);
                        }}
                        className={`p-2.5 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                          isSelected
                            ? 'bg-rose-50 border-rose-400 ring-2 ring-rose-200'
                            : 'bg-white hover:bg-slate-50 border-slate-200'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <span className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-700">
                            {std.studentNumber}
                          </span>
                          <div>
                            <div className="text-xs font-bold text-slate-800">
                              {std.name}
                            </div>
                            <div className="text-[11px] text-slate-500">
                              ชื่อเล่น: {std.nickname} • เลเวล {std.level}
                            </div>
                          </div>
                        </div>

                        {isSelected ? (
                          <div className="w-6 h-6 rounded-full bg-rose-500 text-white flex items-center justify-center">
                            <Check className="w-4 h-4" />
                          </div>
                        ) : isAlreadyBound ? (
                          <span className="text-[10px] text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full font-medium">
                            เชื่อม LINE แล้ว
                          </span>
                        ) : null}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ) : (
            /* Mode B: Register a new student entry */
            <div className="space-y-3 bg-rose-50/50 p-4 rounded-2xl border border-rose-200">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  ชื่อ - นามสกุลจริง *
                </label>
                <input
                  type="text"
                  placeholder="เช่น ด.ช. ธนภัทร ใจดี"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full text-xs font-medium px-3 py-2 bg-white rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-rose-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    ชื่อเล่น
                  </label>
                  <input
                    type="text"
                    placeholder="เช่น ภัทร"
                    value={newNickname}
                    onChange={(e) => setNewNickname(e.target.value)}
                    className="w-full text-xs font-medium px-3 py-2 bg-white rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-rose-400"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    เลขที่
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={newStudentNumber}
                    onChange={(e) => setNewStudentNumber(parseInt(e.target.value) || 1)}
                    className="w-full text-xs font-medium px-3 py-2 bg-white rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-rose-400"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Confirm Button */}
          <button
            type="button"
            onClick={handleConfirm}
            disabled={!isRegisteringNew && !selectedStudentId}
            className={`w-full py-3.5 px-4 rounded-2xl font-black text-sm flex items-center justify-center gap-2 shadow-lg transition-all active:scale-98 ${
              isRegisteringNew || selectedStudentId
                ? 'bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white shadow-emerald-500/25 cursor-pointer'
                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-300 animate-spin" />
            <span>เข้าสู่ห้องเรียน & เริ่มต้นส่งการบ้าน</span>
            <ArrowRight className="w-4 h-4" />
          </button>

        </div>
      </div>
    </div>
  );
};
