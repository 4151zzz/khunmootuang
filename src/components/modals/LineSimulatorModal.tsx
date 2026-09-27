import React, { useState } from 'react';
import { X, Send, BellRing, Smartphone, CheckCheck } from 'lucide-react';
import { Assignment, Student, MascotType } from '../../types';
import { lineService } from '../../services/lineService';
import { sound } from '../../services/soundService';

interface LineSimulatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  assignment: Assignment;
  students: Student[];
  mascot: MascotType;
}

export const LineSimulatorModal: React.FC<LineSimulatorModalProps> = ({
  isOpen,
  onClose,
  assignment,
  students,
  mascot,
}) => {
  const [targetType, setTargetType] = useState<'all' | 'pending' | 'single'>('pending');
  const [selectedStudentId, setSelectedStudentId] = useState<string>(students[0]?.id || '');
  const [pushStatus, setPushStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const mascotEmoji = '🐷';
  const mascotName = 'คุณหมูทวง V.2';

  const selectedStudent = students.find((s) => s.id === selectedStudentId);

  const handleSendPush = async () => {
    setLoading(true);
    sound.playTick();

    let targetCount = students.length;
    if (targetType === 'single') targetCount = 1;
    if (targetType === 'pending') targetCount = 8; // demo pending

    await new Promise((r) => setTimeout(r, 700));

    sound.playCoin();
    setPushStatus(
      `ส่ง LINE Push Notification สำเร็จไปยัง ${targetCount} คน เรียบร้อยแล้ว! (เวลา ${new Date().toLocaleTimeString(
        'th-TH'
      )})`
    );
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-900/75 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full flex flex-col md:flex-row max-h-[92vh] overflow-hidden border border-slate-200">
        
        {/* Left Side: Control & Configuration */}
        <div className="w-full md:w-1/2 p-6 flex flex-col justify-between border-b md:border-b-0 md:border-r border-slate-200 bg-slate-50/50 overflow-y-auto">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2.5 h-2.5 rounded-full bg-[#06C755] animate-ping"></span>
              <span className="text-xs font-bold text-[#06C755] uppercase tracking-wider">
                LINE Messaging API & LIFF Simulator
              </span>
            </div>
            <h3 className="text-xl font-black text-slate-900">
              ทดสอบส่งการบ้านผ่าน LINE OA
            </h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              จำลองการยิงข้อความ Flex Message แบบตอบโต้ได้ พร้อมปุ่มเปิดหน้าส่งงาน LIFF ของระบบ React
            </p>

            {/* Target Select */}
            <div className="mt-5 space-y-3">
              <label className="text-xs font-bold text-slate-700 block">
                เลือกกลุ่มเป้าหมายที่จะส่งทวง:
              </label>
              <div className="grid grid-cols-3 gap-2 text-xs">
                <button
                  onClick={() => setTargetType('pending')}
                  className={`p-2.5 rounded-xl font-bold border transition-all text-center ${
                    targetType === 'pending'
                      ? 'bg-rose-500 text-white border-rose-600 shadow-sm'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  ทวงคนค้างส่ง (8 คน)
                </button>
                <button
                  onClick={() => setTargetType('all')}
                  className={`p-2.5 rounded-xl font-bold border transition-all text-center ${
                    targetType === 'all'
                      ? 'bg-indigo-600 text-white border-indigo-700 shadow-sm'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  ทั้งห้อง ({students.length} คน)
                </button>
                <button
                  onClick={() => setTargetType('single')}
                  className={`p-2.5 rounded-xl font-bold border transition-all text-center ${
                    targetType === 'single'
                      ? 'bg-teal-600 text-white border-teal-700 shadow-sm'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  ระบุรายคน
                </button>
              </div>

              {targetType === 'single' && (
                <div className="mt-2">
                  <label className="text-xs text-slate-500 block mb-1">เลือกนักเรียน:</label>
                  <select
                    value={selectedStudentId}
                    onChange={(e) => setSelectedStudentId(e.target.value)}
                    className="w-full text-xs font-medium p-2.5 bg-white border border-slate-200 rounded-xl outline-none"
                  >
                    {students.map((s) => (
                      <option key={s.id} value={s.id}>
                        เลขที่ {s.studentNumber} {s.name} ({s.nickname})
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            {/* Assignment Info */}
            <div className="mt-5 p-3.5 bg-white rounded-2xl border border-slate-200 text-xs space-y-1.5">
              <span className="font-bold text-slate-800">หัวข้องานที่จะแจ้งเตือน:</span>
              <div className="text-slate-600">{assignment.title}</div>
              <div className="text-rose-600 font-semibold">⏰ กำหนดส่ง: {assignment.dueDate}</div>
            </div>

            {/* Status Alert */}
            {pushStatus && (
              <div className="mt-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex items-start gap-2">
                <CheckCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>{pushStatus}</span>
              </div>
            )}
          </div>

          <div className="pt-6">
            <button
              onClick={handleSendPush}
              disabled={loading}
              className="w-full py-3 bg-[#06C755] hover:bg-[#05B34C] text-white font-extrabold rounded-2xl text-xs sm:text-sm shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2 active:scale-95 transition-all disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
              {loading ? 'กำลังส่งข้อมูลไปยัง LINE Webhook...' : 'กดส่ง LINE Push Message ทันที'}
            </button>
          </div>
        </div>

        {/* Right Side: Smartphone Mockup Frame */}
        <div className="w-full md:w-1/2 p-6 bg-slate-800 flex flex-col items-center justify-center relative">
          
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-full bg-slate-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Phone Shell */}
          <div className="w-[300px] sm:w-[320px] bg-slate-900 rounded-[40px] p-3 shadow-2xl border-4 border-slate-700">
            {/* Notch */}
            <div className="w-28 h-4 bg-slate-950 rounded-b-xl mx-auto mb-2 flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-slate-800 mr-2"></div>
              <div className="w-6 h-1 rounded-full bg-slate-800"></div>
            </div>

            {/* Phone Screen: LINE Chat */}
            <div className="bg-[#788899] rounded-[28px] overflow-hidden flex flex-col h-[480px] shadow-inner text-slate-800 text-xs">
              
              {/* LINE Header */}
              <div className="bg-[#24303c] text-white p-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-rose-500 flex items-center justify-center text-sm">
                    {mascotEmoji}
                  </div>
                  <div>
                    <div className="font-bold text-xs">{mascotName}</div>
                    <div className="text-[9px] text-emerald-400">Official Account • Verified</div>
                  </div>
                </div>
                <Smartphone className="w-4 h-4 text-slate-400" />
              </div>

              {/* Chat Messages scroll area */}
              <div className="flex-1 p-3 overflow-y-auto space-y-3">
                <div className="text-center text-[10px] text-white/70 py-1">วันนี้ 16:30</div>

                {/* LINE Flex Message Bubble */}
                <div className="bg-white rounded-2xl shadow-md overflow-hidden max-w-[270px]">
                  
                  {/* Bubble Header */}
                  <div
                    className={`p-3 text-white ${
                      mascot === 'chicken' ? 'bg-orange-600' : 'bg-rose-600'
                    }`}
                  >
                    <div className="font-bold text-xs flex items-center gap-1">
                      <span>{mascotEmoji}</span>
                      <span>{mascotName} ทวงการบ้าน</span>
                    </div>
                    <div className="text-[10px] text-pink-100">
                      ถึง:{' '}
                      {targetType === 'single' && selectedStudent
                        ? selectedStudent.name
                        : 'นักเรียนห้อง ม.4/1'}
                    </div>
                  </div>

                  {/* Bubble Body */}
                  <div className="p-3 space-y-2 text-slate-700">
                    <div className="font-bold text-slate-900 text-xs leading-snug">
                      {assignment.title}
                    </div>
                    <div className="bg-slate-50 p-2 rounded-lg space-y-1 text-[11px]">
                      <div className="flex justify-between">
                        <span className="text-slate-500">วิชา:</span>
                        <span className="font-bold text-slate-800">{assignment.subject}</span>
                      </div>
                      <div className="flex justify-between text-rose-600 font-bold">
                        <span>กำหนดส่ง:</span>
                        <span>{assignment.dueDate}</span>
                      </div>
                      <div className="flex justify-between text-emerald-600 font-semibold">
                        <span>รางวัล:</span>
                        <span>+{assignment.maxScore} คะแนน & 🥚 ไข่สุ่ม</span>
                      </div>
                    </div>
                    <p className="text-[10px] text-slate-500 leading-tight">
                      {assignment.description.slice(0, 70)}...
                    </p>
                  </div>

                  {/* Bubble Action Buttons */}
                  <div className="p-2 bg-slate-50 border-t border-slate-100 space-y-1.5">
                    <button className="w-full py-1.5 bg-[#06C755] text-white text-[11px] font-bold rounded-xl shadow-sm">
                      🚀 ส่งงานทันที (LIFF)
                    </button>
                    <button className="w-full py-1.5 bg-slate-200 text-slate-700 text-[11px] font-medium rounded-xl">
                      📖 ดูรายละเอียดงาน
                    </button>
                  </div>
                </div>

                <div className="text-right text-[10px] text-white/80">อ่านแล้ว 16:31</div>
              </div>

              {/* Chat Input Bar */}
              <div className="bg-white p-2 border-t border-slate-200 flex items-center gap-2">
                <input
                  type="text"
                  placeholder="พิมพ์ข้อความคุยกับคุณหมู..."
                  readOnly
                  className="flex-1 bg-slate-100 px-3 py-1.5 rounded-full text-[11px] outline-none"
                />
                <button className="p-1.5 bg-[#06C755] text-white rounded-full">
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>
          </div>

          <div className="mt-3 text-center">
            <span className="text-slate-400 text-xs">
              ตัวอย่างหน้าจอ LINE บนมือถือของนักเรียน
            </span>
          </div>

        </div>

      </div>
    </div>
  );
};
