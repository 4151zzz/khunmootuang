import React from 'react';
import { UserRole, MascotType, Classroom } from '../types';
import { Sparkles, Settings, Smartphone, Monitor, BookOpen, Users, Plus } from 'lucide-react';
import { alertService } from '../services/alertService';
import { sound } from '../services/soundService';

interface NavbarProps {
  role: UserRole;
  setRole: (role: UserRole) => void;
  selectedClass: string;
  setSelectedClass: (cls: string) => void;
  classrooms: Classroom[];
  onOpenManageClass: () => void;
  onOpenLineGuide: () => void;
  onOpenSettings: () => void;
  onOpenLineModal: () => void;
  onAddClassroom?: (newClass: Classroom) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  role,
  setRole,
  selectedClass,
  setSelectedClass,
  classrooms,
  onOpenManageClass,
  onOpenLineGuide,
  onOpenSettings,
  onOpenLineModal,
  onAddClassroom,
}) => {
  const brandTitle = 'คุณหมูทวง V.2';
  const brandEmoji = '🐷';

  const handleQuickAddClass = async () => {
    const res = await alertService.promptAddClassroom();
    if (res) {
      if (classrooms.some((c) => c.name.toLowerCase() === res.name.toLowerCase())) {
        alertService.showWarning('มีห้องนี้อยู่แล้ว', `ห้อง ${res.name} มีอยู่ในระบบแล้วครับ`);
        return;
      }
      sound.playCoin();
      const newClass: Classroom = {
        id: `cls-${Date.now()}`,
        name: res.name,
        description: res.description,
        gradeLevel: res.name.includes('/') ? res.name.split('/')[0] : 'ม.ปลาย',
        academicYear: '2569'
      };
      if (onAddClassroom) {
        onAddClassroom(newClass);
      }
      setSelectedClass(newClass.name);
      alertService.showSuccess('เพิ่มห้องเรียนสำเร็จ! ✨', `ห้อง ${newClass.name} ถูกเพิ่มเข้าสู่ระบบแล้ว`);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-sm transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="relative group">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-pink-400 via-rose-500 to-amber-500 flex items-center justify-center text-2xl shadow-md transition-transform">
              {brandEmoji}
            </div>
            <span className="absolute -bottom-1 -right-1 bg-amber-400 text-[10px] font-bold px-1.5 py-0.5 rounded-full shadow border border-white">
              V.2
            </span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold bg-gradient-to-r from-rose-600 via-pink-600 to-amber-600 bg-clip-text text-transparent m-0">
                {brandTitle}
              </h1>
              <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-semibold bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full border border-emerald-200">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                LINE OA Ready
              </span>
              <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-semibold bg-sky-100 text-sky-700 px-2 py-0.5 rounded-full border border-sky-200" title="ฐานข้อมูล Firebase Firestore ซิงค์สดแบบ Realtime">
                <span className="w-1.5 h-1.5 rounded-full bg-sky-500 animate-ping"></span>
                Cloud Sync
              </span>
            </div>
            <p className="text-xs text-slate-500 hidden md:block">
              ระบบจัดการชั้นเรียนครบวงจร • ทวงงาน • ตรวจ AI • Gamification
            </p>
          </div>
        </div>

        {/* Controls and Switchers */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Teacher Only Controls */}
          {role === 'teacher' && (
            <>
              {/* Classroom Selector + Manage Button */}
              <div className="flex items-center bg-slate-100/90 rounded-xl p-1 border border-slate-200">
                <BookOpen className="w-3.5 h-3.5 text-slate-500 ml-2" />
                <select
                  value={selectedClass}
                  onChange={(e) => setSelectedClass(e.target.value)}
                  className="bg-transparent text-xs font-semibold text-slate-700 border-none outline-none pr-2 py-1 cursor-pointer"
                >
                  {classrooms.map((c) => (
                    <option key={c.id} value={c.name}>
                      ห้อง {c.name}
                    </option>
                  ))}
                </select>
                <button
                  onClick={onOpenManageClass}
                  className="p-1 px-2 bg-white hover:bg-slate-200/70 text-slate-700 rounded-lg text-[11px] font-bold shadow-xs border border-slate-200 transition-colors flex items-center gap-1"
                  title="เพิ่ม ลบ แก้ไขห้องเรียนและรายชื่อนักเรียน"
                >
                  <Users className="w-3 h-3 text-rose-500" />
                  <span className="hidden sm:inline">จัดการห้อง/นร.</span>
                </button>
                <button
                  onClick={handleQuickAddClass}
                  className="p-1 px-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg text-[11px] font-bold shadow-xs transition-colors flex items-center gap-1 active:scale-95"
                  title="เพิ่มห้องเรียนใหม่ด่วน"
                >
                  <Plus className="w-3 h-3" />
                  <span className="hidden sm:inline">เพิ่มห้อง</span>
                </button>
              </div>
            </>
          )}

          {/* Role Mode Switcher (Teacher Dashboard vs Student LIFF View) */}
          <div className="bg-slate-100 p-1 rounded-xl flex items-center border border-slate-200">
            <button
              onClick={() => setRole('teacher')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                role === 'teacher'
                  ? 'bg-white text-slate-800 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Monitor className="w-3.5 h-3.5 text-rose-500" />
              <span className="hidden sm:inline">หน้าครู</span>
            </button>
            <button
              onClick={() => setRole('student')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                role === 'student'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">หน้านักเรียน (LIFF)</span>
            </button>
          </div>

          {/* Teacher Extra Actions */}
          {role === 'teacher' && (
            <>
              {/* LINE Guide / How Students Enter Button */}
              <button
                onClick={onOpenLineGuide}
                className="hidden md:flex items-center gap-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 px-3 py-1.5 rounded-xl text-xs font-bold transition-all"
                title="ดูวิธีเชื่อมต่อ LINE OA และวิธีที่นักเรียนเข้าใช้งาน"
              >
                <span>📲 วิธีเชื่อม LINE/นร.เข้ายังไง</span>
              </button>

              {/* LINE Simulator Button */}
              <button
                onClick={onOpenLineModal}
                className="flex items-center gap-1.5 bg-[#06C755] hover:bg-[#05B34C] text-white px-3 py-1.5 rounded-xl text-xs font-bold shadow-sm transition-all active:scale-95"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-200" />
                <span className="hidden sm:inline">LINE OA Simulator</span>
              </button>

              {/* Settings */}
              <button
                onClick={onOpenSettings}
                className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors border border-transparent hover:border-slate-200"
                title="ตั้งค่า API & ระบบ"
              >
                <Settings className="w-4 h-4" />
              </button>
            </>
          )}
        </div>

      </div>
    </header>
  );
};
