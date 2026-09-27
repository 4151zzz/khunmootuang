import React, { useState } from 'react';
import { Student, MascotType } from '../../types';
import { Shuffle, Users, Sparkles, RefreshCw, Trophy, RotateCcw } from 'lucide-react';
import { sound } from '../../services/soundService';
import confetti from 'canvas-confetti';

interface RandomizerTabProps {
  students: Student[];
  mascot: MascotType;
}

export const RandomizerTab: React.FC<RandomizerTabProps> = ({
  students,
  mascot,
}) => {
  const [mode, setMode] = useState<'gachapon' | 'groups'>('gachapon');

  // Gachapon state
  const [isCranking, setIsCranking] = useState(false);
  const [pickedStudent, setPickedStudent] = useState<Student | null>(null);

  // Group division state
  const [groupCount, setGroupCount] = useState(3);
  const [generatedGroups, setGeneratedGroups] = useState<Student[][]>([]);

  // Gachapon Crank
  const handleCrankGachapon = () => {
    if (isCranking) return;
    setIsCranking(true);
    setPickedStudent(null);

    // Audio ticking sound
    let tickCount = 0;
    const tickInterval = setInterval(() => {
      sound.playTick();
      tickCount++;
      if (tickCount > 10) clearInterval(tickInterval);
    }, 120);

    setTimeout(() => {
      const chosen = students[Math.floor(Math.random() * students.length)];
      setPickedStudent(chosen);
      setIsCranking(false);
      sound.playHatch();
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }, 1600);
  };

  // Group Divider
  const handleGenerateGroups = () => {
    sound.playCoin();
    const shuffled = [...students].sort(() => 0.5 - Math.random());
    const groups: Student[][] = Array.from({ length: groupCount }, () => []);

    shuffled.forEach((student, index) => {
      groups[index % groupCount].push(student);
    });

    setGeneratedGroups(groups);
  };

  const mascotEmoji = mascot === 'chicken' ? '🐔' : '🐷';

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200/80 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold bg-amber-100 text-amber-800 px-2.5 py-0.5 rounded-full flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              เครื่องมือจัดการชั้นเรียนอเนกประสงค์
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-800 m-0">
            ตู้กาชาปองสุ่มชื่อ & เครื่องมือแบ่งกลุ่ม 🎰👥
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            สุ่มนักเรียนตอบคำถามด้วยตู้กาชาปองอนิเมชัน หรือแบ่งกลุ่มทำกิจกรรมได้ในคลิกเดียว
          </p>
        </div>

        {/* Mode Switcher */}
        <div className="flex items-center bg-slate-100 p-1 rounded-2xl border border-slate-200 text-xs">
          <button
            onClick={() => setMode('gachapon')}
            className={`px-4 py-2 rounded-xl font-bold transition-all flex items-center gap-1.5 ${
              mode === 'gachapon' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Shuffle className="w-3.5 h-3.5" />
            ตู้กาชาปองสุ่มชื่อ
          </button>
          <button
            onClick={() => setMode('groups')}
            className={`px-4 py-2 rounded-xl font-bold transition-all flex items-center gap-1.5 ${
              mode === 'groups' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            แบ่งกลุ่มกิจกรรม
          </button>
        </div>
      </div>

      {/* Mode 1: Gachapon Machine */}
      {mode === 'gachapon' && (
        <div className="max-w-xl mx-auto bg-gradient-to-b from-white to-amber-50/50 rounded-3xl p-8 border border-amber-200/80 shadow-xl text-center relative overflow-hidden">
          
          {/* Gachapon Dome */}
          <div className="relative w-64 h-64 mx-auto rounded-full bg-gradient-to-b from-sky-100/60 to-white/90 border-8 border-rose-400 shadow-inner flex items-center justify-center overflow-hidden">
            
            {/* Capsules inside */}
            <div className={`flex flex-wrap items-center justify-center gap-2 p-6 select-none ${isCranking ? 'animate-wiggle' : ''}`}>
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-red-500 to-amber-400 flex items-center justify-center text-sm shadow">🔴</div>
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 flex items-center justify-center text-sm shadow">🔵</div>
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-emerald-500 to-teal-400 flex items-center justify-center text-sm shadow">🟢</div>
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-400 flex items-center justify-center text-sm shadow">🟣</div>
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-yellow-400 to-amber-500 flex items-center justify-center text-sm shadow">🟡</div>
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-pink-500 to-rose-400 flex items-center justify-center text-sm shadow">⚪</div>
            </div>

            {/* Glass reflection */}
            <div className="absolute top-4 left-6 w-16 h-8 bg-white/50 rounded-full -rotate-45 pointer-events-none"></div>
          </div>

          {/* Gachapon Body & Crank Handle */}
          <div className="w-56 mx-auto bg-rose-500 text-white rounded-b-3xl p-5 shadow-lg -mt-3 relative z-10 border-4 border-rose-600">
            <div className="w-12 h-12 rounded-full bg-amber-300 border-4 border-amber-400 mx-auto flex items-center justify-center text-slate-800 text-xl font-black shadow-md">
              {mascotEmoji}
            </div>

            <button
              onClick={handleCrankGachapon}
              disabled={isCranking}
              className="mt-4 w-full py-2.5 bg-amber-400 hover:bg-amber-300 disabled:opacity-50 text-slate-950 font-black rounded-xl text-xs uppercase tracking-wider shadow active:scale-95 transition-all flex items-center justify-center gap-1.5"
            >
              <RotateCcw className={`w-4 h-4 ${isCranking ? 'animate-spin' : ''}`} />
              {isCranking ? 'กำลังหมุนตู้...' : 'หมุนกาชาปองสุ่มชื่อ!'}
            </button>
          </div>

          {/* Result Card */}
          {pickedStudent && (
            <div className="mt-8 p-6 bg-white rounded-3xl border-2 border-amber-400 shadow-xl animate-fadeIn">
              <div className="inline-flex items-center gap-1 text-xs font-black text-rose-600 bg-rose-50 px-3 py-1 rounded-full mb-3">
                🎉 ผู้โชคดีที่จะได้ตอบคำถามคือ!
              </div>

              <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-pink-200 to-amber-200 flex items-center justify-center text-4xl mx-auto mb-3 shadow-inner">
                {pickedStudent.avatar}
              </div>

              <h3 className="text-2xl font-black text-slate-900">
                {pickedStudent.name} ({pickedStudent.nickname})
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                เลขที่ {pickedStudent.studentNumber} • ห้อง {pickedStudent.classroom}
              </p>

              <div className="mt-4 flex items-center justify-center gap-2">
                <span className="text-xs bg-indigo-50 text-indigo-700 px-3 py-1 rounded-xl font-bold">
                  {pickedStudent.exp} EXP
                </span>
                <span className="text-xs bg-emerald-50 text-emerald-700 px-3 py-1 rounded-xl font-bold">
                  ตอบถูกรับ +3 EXP ทันที!
                </span>
              </div>
            </div>
          )}

        </div>
      )}

      {/* Mode 2: Group Divider */}
      {mode === 'groups' && (
        <div className="space-y-6">
          
          {/* Controls */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <label className="text-xs font-bold text-slate-700">ต้องการแบ่งเป็นกี่กลุ่ม?</label>
              <select
                value={groupCount}
                onChange={(e) => setGroupCount(Number(e.target.value))}
                className="font-bold text-sm bg-slate-100 border border-slate-200 rounded-xl px-3 py-1.5 outline-none"
              >
                <option value={2}>2 กลุ่ม</option>
                <option value={3}>3 กลุ่ม</option>
                <option value={4}>4 กลุ่ม</option>
                <option value={5}>5 กลุ่ม</option>
                <option value={6}>6 กลุ่ม</option>
              </select>
            </div>

            <button
              onClick={handleGenerateGroups}
              className="px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold rounded-2xl text-xs flex items-center gap-1.5 shadow-md active:scale-95 transition-all"
            >
              <Shuffle className="w-4 h-4" />
              กดสุ่มแบ่งกลุ่มทันที
            </button>
          </div>

          {/* Group display cards */}
          {generatedGroups.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {generatedGroups.map((group, groupIdx) => (
                <div
                  key={groupIdx}
                  className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-3"
                >
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <span className="font-black text-slate-800 text-sm flex items-center gap-2">
                      <span className="w-6 h-6 rounded-lg bg-rose-500 text-white flex items-center justify-center text-xs">
                        {groupIdx + 1}
                      </span>
                      กลุ่มที่ {groupIdx + 1}
                    </span>
                    <span className="text-xs text-slate-500 font-medium">{group.length} คน</span>
                  </div>

                  <div className="space-y-2">
                    {group.map((st) => (
                      <div
                        key={st.id}
                        className="flex items-center gap-2.5 p-2 bg-slate-50 rounded-xl text-xs"
                      >
                        <span className="text-lg">{st.avatar}</span>
                        <div>
                          <div className="font-bold text-slate-800">
                            {st.name} ({st.nickname})
                          </div>
                          <span className="text-[10px] text-slate-400">เลขที่ {st.studentNumber}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-3xl p-10 text-center border border-slate-200 text-slate-400">
              <Users className="w-10 h-10 mx-auto text-slate-300 mb-2" />
              <p className="text-xs">เลือกจำนวนกลุ่มแล้วกดปุ่ม &ldquo;กดสุ่มแบ่งกลุ่มทันที&rdquo; ด้านบน</p>
            </div>
          )}

        </div>
      )}

    </div>
  );
};
