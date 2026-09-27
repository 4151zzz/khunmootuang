import React from 'react';
import { Student, MascotType, OwnedPet } from '../../types';
import { Sparkles, Trophy, Flame, Plus, Gift, Shield } from 'lucide-react';
import { sound } from '../../services/soundService';

interface GamificationTabProps {
  students: Student[];
  onOpenHatchModal: (student: Student) => void;
  onGiftEgg: (studentId: string) => void;
  mascot: MascotType;
}

export const GamificationTab: React.FC<GamificationTabProps> = ({
  students,
  onOpenHatchModal,
  onGiftEgg,
  mascot,
}) => {
  // Sort students by EXP descending
  const sortedStudents = [...students].sort((a, b) => b.exp - a.exp);

  const getRankBadge = (rank: number) => {
    if (rank === 1) return { label: '🥇 ที่ 1', bg: 'bg-amber-100 text-amber-900 border-amber-300' };
    if (rank === 2) return { label: '🥈 ที่ 2', bg: 'bg-slate-200 text-slate-800 border-slate-300' };
    if (rank === 3) return { label: '🥉 ที่ 3', bg: 'bg-amber-700/10 text-amber-800 border-amber-600/30' };
    return { label: `อันดับ ${rank}`, bg: 'bg-slate-100 text-slate-600 border-slate-200' };
  };

  const mascotEmoji = mascot === 'chicken' ? '🐔' : '🐷';

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-indigo-900 via-purple-900 to-pink-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-indigo-700/50 flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-pink-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400 text-slate-950 text-xs font-black shadow-sm mb-2">
            <Trophy className="w-3.5 h-3.5" />
            ระบบ Gamification ประจำห้องเรียน
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white m-0">
            กระดานอันดับ EXP & ฟาร์มสัตว์เลี้ยง 🐣✨
          </h2>
          <p className="text-xs sm:text-sm text-indigo-200 mt-1 max-w-lg leading-relaxed">
            ส่งงานตรงเวลา +15 EXP และรับไข่สุ่มลุ้นสัตว์เลี้ยงระดับ Legendary!
            สร้างแรงจูงใจเชิงบวกให้เด็กๆ อยากทำการบ้านทุกวัน
          </p>
        </div>

        {/* Global Stats */}
        <div className="relative z-10 flex items-center gap-3 bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20">
          <div className="text-center px-3 border-r border-white/20">
            <div className="text-2xl font-black text-amber-300">
              {students.reduce((acc, s) => acc + s.pets.length, 0)}
            </div>
            <div className="text-[11px] text-indigo-200">สัตว์เลี้ยงที่ฟักแล้ว</div>
          </div>
          <div className="text-center px-3">
            <div className="text-2xl font-black text-emerald-300">
              {students.reduce((acc, s) => acc + s.unopenedEggs, 0)}
            </div>
            <div className="text-[11px] text-indigo-200">ไข่ที่รอการฟัก 🥚</div>
          </div>
        </div>
      </div>

      {/* Student Gamification Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sortedStudents.map((student, index) => {
          const rankInfo = getRankBadge(index + 1);

          return (
            <div
              key={student.id}
              className="bg-white rounded-3xl p-5 shadow-sm border border-slate-200 hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                {/* Header Rank + Level */}
                <div className="flex items-center justify-between mb-3">
                  <span
                    className={`text-[11px] font-black px-2.5 py-0.5 rounded-full border ${rankInfo.bg}`}
                  >
                    {rankInfo.label}
                  </span>
                  <div className="flex items-center gap-1.5 text-xs">
                    <span className="font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md">
                      Lv. {student.level}
                    </span>
                    <span className="font-bold text-rose-600 flex items-center gap-0.5 bg-rose-50 px-2 py-0.5 rounded-md">
                      <Flame className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
                      {student.streakDays} วัน
                    </span>
                  </div>
                </div>

                {/* Avatar and Info */}
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-pink-100 via-amber-100 to-indigo-100 flex items-center justify-center text-3xl shadow-inner border border-slate-200 shrink-0">
                    {student.avatar}
                  </div>
                  <div className="overflow-hidden">
                    <div className="font-bold text-slate-800 text-sm truncate">
                      {student.name}
                    </div>
                    <div className="text-xs text-slate-500">
                      น้อง{student.nickname} • เลขที่ {student.studentNumber}
                    </div>
                    <div className="font-mono font-bold text-xs text-indigo-600 mt-0.5">
                      {student.exp} EXP
                    </div>
                  </div>
                </div>

                {/* EXP Progress Bar */}
                <div className="mt-3">
                  <div className="flex justify-between text-[10px] text-slate-400 mb-1">
                    <span>ความก้าวหน้าสู่ Lv.{student.level + 1}</span>
                    <span>{student.exp % 100} / 100 EXP</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-indigo-500 to-pink-500 h-full rounded-full transition-all duration-500"
                      style={{ width: `${student.exp % 100}%` }}
                    />
                  </div>
                </div>

                {/* Pet Collection Inventory */}
                <div className="mt-4 pt-3 border-t border-slate-100">
                  <span className="text-xs font-bold text-slate-700 block mb-2">
                    สัตว์เลี้ยงคู่หู ({student.pets.length} ตัว):
                  </span>
                  {student.pets.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {student.pets.map((pet) => (
                        <div
                          key={pet.id}
                          className="bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl p-2 flex items-center gap-2 text-xs transition-colors"
                          title={pet.description}
                        >
                          <span className="text-2xl">{pet.imageUrl}</span>
                          <div>
                            <div className="font-bold text-slate-800 text-[11px] leading-tight">
                              {pet.name}
                            </div>
                            <span className="text-[10px] text-amber-700 font-semibold">
                              ★ {pet.rarity}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-xs text-slate-400 bg-slate-50 p-2.5 rounded-xl text-center">
                      ยังไม่มีสัตว์เลี้ยง (ส่งการบ้านเพื่อรับไข่สุ่ม)
                    </div>
                  )}
                </div>
              </div>

              {/* Egg Hatch / Gift Actions */}
              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                <div className="flex items-center gap-1 text-xs">
                  <span>🥚 ไข่ในคลัง:</span>
                  <strong className="text-amber-600">{student.unopenedEggs} ฟอง</strong>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => {
                      sound.playCoin();
                      onGiftEgg(student.id);
                    }}
                    className="p-1.5 bg-amber-50 hover:bg-amber-100 text-amber-700 rounded-lg text-xs font-bold border border-amber-200 transition-colors"
                    title="แจกไข่สุ่มเป็นรางวัลพิเศษ"
                  >
                    <Gift className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => onOpenHatchModal(student)}
                    disabled={student.unopenedEggs <= 0}
                    className="px-3 py-1.5 bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-500 hover:to-yellow-600 disabled:opacity-40 text-slate-900 rounded-xl text-xs font-black shadow-sm active:scale-95 transition-all flex items-center gap-1"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    ฟักไข่เลย!
                  </button>
                </div>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};
