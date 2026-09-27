import React from 'react';
import { MascotType } from '../types';
import { Send, BellRing, CheckCircle, Megaphone, HardDrive, FileSpreadsheet, Sparkles } from 'lucide-react';

interface MascotBannerProps {
  mascot: MascotType;
  pendingCount: number;
  totalStudents: number;
  activeStep: number;
  onStepClick: (stepIndex: number) => void;
  onQuickRemind: () => void;
}

export const MascotBanner: React.FC<MascotBannerProps> = ({
  mascot,
  pendingCount,
  totalStudents,
  activeStep,
  onStepClick,
  onQuickRemind,
}) => {
  const mascotEmoji = '🐷';
  const mascotName = 'คุณหมูทวง';

  const steps = [
    { num: 1, label: 'มอบหมาย', icon: Send, desc: 'สร้างงาน & กำหนดวันส่ง' },
    { num: 2, label: 'ทวงงาน', icon: BellRing, desc: 'LINE Push Notification' },
    { num: 3, label: 'ตรวจงาน', icon: CheckCircle, desc: 'AI ช่วยตรวจ + เขียนรูป' },
    { num: 4, label: 'แจ้งผล', icon: Megaphone, desc: 'ผลคะแนนส่งตรงถึงเด็ก' },
    { num: 5, label: 'เข้า Drive', icon: HardDrive, desc: 'เก็บผลงานเข้าคลัง Cloud' },
    { num: 6, label: 'ทำคะแนน', icon: FileSpreadsheet, desc: 'Export สรุปคะแนน & Sheets' },
  ];

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-800 via-teal-900 to-slate-900 text-white shadow-xl border-4 border-emerald-950 p-6 sm:p-8 mb-8">
      {/* Texture chalkboard overlay */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none"></div>

      {/* Decorative stars */}
      <div className="absolute top-4 right-1/4 text-amber-300 animate-pulse text-lg">✦</div>
      <div className="absolute bottom-4 left-1/3 text-amber-300 animate-pulse text-sm">★</div>

      <div className="relative z-10">
        
        {/* Top Header: Mascot & Bubble */}
        <div className="flex flex-col md:flex-row items-center md:items-start gap-5 justify-between pb-6 border-b border-white/15">
          <div className="flex items-center gap-4 text-center md:text-left">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center text-4xl sm:text-5xl shadow-inner border border-white/20 animate-bounceSubtle">
              {mascotEmoji}
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400 text-slate-900 text-xs font-black shadow-sm mb-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                สรุป{mascotName} V.2 จัดการชั้นเรียนครบจบในที่เดียว!
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-wide">
                ยินดีต้อนรับสู่ห้องเรียนอัจฉริยะ ✨
              </h2>
              <p className="text-emerald-200 text-xs sm:text-sm mt-0.5 font-light">
                ระบบเชื่อมต่อ LINE OA + Gamification ฟักไข่สัตว์เลี้ยง เพื่อแรงจูงใจในการเรียนรู้สูงสุด
              </p>
            </div>
          </div>

          {/* Interactive Mascot Speech Bubble */}
          <div className="bg-white/95 text-slate-800 rounded-2xl p-4 shadow-xl border-2 border-emerald-400/40 max-w-sm relative">
            <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rotate-45 border-l-2 border-b-2 border-emerald-400/40 hidden md:block"></div>
            <p className="text-xs sm:text-sm font-medium leading-relaxed">
              {totalStudents === 0 ? (
                <>
                  &ldquo;สวัสดีครับคุณครู! ยินดีต้อนรับสู่{mascotName} V.2 เริ่มต้นเพิ่มรายชื่อนักเรียน หรือสร้างการบ้านแรกเพื่อเริ่มใช้งานได้เลยครับ! 🐷✨&rdquo;
                </>
              ) : (
                <>
                  &ldquo;สวัสดีครับคุณครู! ตอนนี้มีนักเรียนยังไม่ส่งงาน{' '}
                  <span className="text-rose-600 font-extrabold">{pendingCount}</span> จาก {totalStudents} คน
                  ให้{mascotName}ยิง LINE ทวงรายคน หรือยิงเข้ากลุ่มให้ไหมครับ? 💬&rdquo;
                </>
              )}
            </p>
            <div className="mt-2.5 flex items-center justify-end gap-2">
              <button
                onClick={onQuickRemind}
                className="inline-flex items-center gap-1 bg-[#06C755] hover:bg-[#05B34C] text-white font-bold text-xs px-3 py-1.5 rounded-xl shadow-md transition-all active:scale-95"
              >
                <BellRing className="w-3.5 h-3.5" />
                ยิง LINE ทวงทันที
              </button>
            </div>
          </div>
        </div>

        {/* 6-Step Workflow Navigation bar (as in the infographic) */}
        <div className="pt-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-300 flex items-center gap-1.5">
              <span>★</span> จัดการชั้นเรียนได้ถึง 6 ขั้นตอน <span>★</span>
            </h3>
            <span className="text-[11px] text-emerald-200/80">คลิกที่ขั้นตอนเพื่อดูและสลับขั้นตอนได้ทันที</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {steps.map((st) => {
              const Icon = st.icon;
              const isActive = activeStep === st.num;
              return (
                <button
                  key={st.num}
                  onClick={() => onStepClick(st.num)}
                  className={`group relative text-left p-3.5 rounded-2xl transition-all border ${
                    isActive
                      ? 'bg-white text-slate-900 border-amber-400 shadow-xl scale-[1.02] ring-2 ring-amber-400/50'
                      : 'bg-white/10 hover:bg-white/15 text-white border-white/10 hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors ${
                        isActive
                          ? 'bg-emerald-600 text-white shadow-md'
                          : 'bg-white/10 text-emerald-300 group-hover:bg-emerald-500 group-hover:text-white'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <span
                      className={`text-[10px] font-black px-1.5 py-0.5 rounded-md ${
                        isActive ? 'bg-amber-100 text-amber-800' : 'bg-white/10 text-white/70'
                      }`}
                    >
                      ขั้นที่ {st.num}
                    </span>
                  </div>
                  <div className="font-bold text-sm leading-snug">{st.label}</div>
                  <div
                    className={`text-[11px] mt-0.5 leading-tight line-clamp-1 ${
                      isActive ? 'text-slate-500' : 'text-emerald-200/70'
                    }`}
                  >
                    {st.desc}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
};
