import React, { useState } from 'react';
import {
  X,
  Smartphone,
  QrCode,
  Link,
  CheckCircle2,
  Copy,
  Check,
  ShieldCheck,
  ExternalLink,
  Sparkles,
  ArrowRight,
  UserCheck
} from 'lucide-react';
import { Student, Classroom, MascotType } from '../../types';
import { sound } from '../../services/soundService';

interface LineConnectGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  students: Student[];
  classrooms: Classroom[];
  selectedClass: string;
  onBindStudentLine: (studentId: string, lineUserId: string, lineDisplayName: string) => void;
  mascot: MascotType;
}

export const LineConnectGuideModal: React.FC<LineConnectGuideModalProps> = ({
  isOpen,
  onClose,
  students,
  classrooms,
  selectedClass,
  onBindStudentLine,
  mascot,
}) => {
  const [activeStepTab, setActiveStepTab] = useState<'architecture' | 'setup_steps' | 'binding_simulator'>('architecture');
  const [copiedLink, setCopiedLink] = useState(false);

  // Binding simulator state
  const [simStudentId, setSimStudentId] = useState<string>(students[0]?.id || '');
  const [simLineName, setSimLineName] = useState('น้องต้นกล้า (Tonkla)');
  const [simLineUserId, setSimLineUserId] = useState(`U${Math.random().toString(36).substring(2, 10)}`);
  const [boundSuccessNotice, setBoundSuccessNotice] = useState(false);

  if (!isOpen) return null;

  const currentClassStudents = students.filter((s) => s.classroom === selectedClass);
  const selectedStudent = students.find((s) => s.id === simStudentId);

  const liffUrl = `https://liff.line.me/2001234567-AbCdEfGh?class=${encodeURIComponent(selectedClass)}`;

  const handleCopyLink = () => {
    sound.playTap();
    navigator.clipboard.writeText(liffUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleSimulateBinding = () => {
    if (!simStudentId) return;
    sound.playCoin();
    onBindStudentLine(simStudentId, simLineUserId, simLineName);
    setBoundSuccessNotice(true);
    setTimeout(() => {
      setBoundSuccessNotice(false);
    }, 2500);
  };

  const mascotEmoji = '🐷';
  const mascotName = 'คุณหมูทวง';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-900/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full flex flex-col max-h-[94vh] overflow-hidden border border-slate-200">
        
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-emerald-50 via-teal-50 to-slate-50">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#06C755] text-white flex items-center justify-center text-2xl shadow-md">
              💬
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold bg-[#06C755] text-white px-2.5 py-0.5 rounded-full shadow-sm">
                  LINE OA & LIFF Integration Guide
                </span>
                <span className="text-[10px] bg-slate-200 text-slate-700 px-2 py-0.5 rounded-full font-bold">
                  เข้าใจใน 3 นาที
                </span>
              </div>
              <h3 className="text-lg font-black text-slate-900 mt-0.5">
                วิธีเชื่อมต่อ LINE OA และวิธีที่นักเรียนเข้าใช้งาน 📲
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switchers */}
        <div className="px-6 pt-3 bg-slate-50 border-b border-slate-200 flex items-center gap-4 text-xs font-bold">
          <button
            onClick={() => setActiveStepTab('architecture')}
            className={`pb-3 border-b-2 flex items-center gap-1.5 transition-all ${
              activeStepTab === 'architecture'
                ? 'border-emerald-600 text-emerald-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <span>1. แผนภาพการทำงาน (นักเรียนเข้ายังไง)</span>
          </button>

          <button
            onClick={() => setActiveStepTab('binding_simulator')}
            className={`pb-3 border-b-2 flex items-center gap-1.5 transition-all ${
              activeStepTab === 'binding_simulator'
                ? 'border-emerald-600 text-emerald-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <span>2. ทดลองจำลองการผูก LINE นักเรียนจริง</span>
          </button>

          <button
            onClick={() => setActiveStepTab('setup_steps')}
            className={`pb-3 border-b-2 flex items-center gap-1.5 transition-all ${
              activeStepTab === 'setup_steps'
                ? 'border-emerald-600 text-emerald-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <span>3. ขั้นตอนตั้งค่าใน LINE Developers</span>
          </button>
        </div>

        {/* Body Content */}
        <div className="p-6 overflow-y-auto flex-1 text-xs space-y-6">
          
          {/* TAB 1: ARCHITECTURE & HOW STUDENTS ENTER */}
          {activeStepTab === 'architecture' && (
            <div className="space-y-6">
              
              {/* Question 1: นักเรียนจะเข้ายังไง? */}
              <div className="bg-emerald-50/70 border border-emerald-200 rounded-3xl p-5 space-y-3">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs">
                    1
                  </span>
                  <h4 className="font-black text-slate-900 text-sm">
                    นักเรียนจะเข้าใช้งานระบบยังไง?
                  </h4>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2 text-slate-700">
                  <div className="bg-white p-3.5 rounded-2xl border border-emerald-100 shadow-xs space-y-1.5">
                    <div className="font-bold text-slate-900 flex items-center gap-1 text-xs">
                      <span>🟢 ขั้นที่ 1: แอด LINE OA</span>
                    </div>
                    <p className="text-[11px] leading-relaxed text-slate-600">
                      ครูแจก QR Code ของ LINE OA หน้าห้องเรียน นักเรียนเปิดแอป LINE ในมือถือ สแกนเพิ่มเพื่อน <strong>@{mascotName}</strong>
                    </p>
                  </div>

                  <div className="bg-white p-3.5 rounded-2xl border border-emerald-100 shadow-xs space-y-1.5">
                    <div className="font-bold text-slate-900 flex items-center gap-1 text-xs">
                      <span>🔘 ขั้นที่ 2: กดปุ่ม Rich Menu</span>
                    </div>
                    <p className="text-[11px] leading-relaxed text-slate-600">
                      ในห้องแชท LINE จะมีเมนูด้านล่าง (Rich Menu) เขียนว่า <strong>&ldquo;🚀 เข้าห้องเรียน / ส่งการบ้าน&rdquo;</strong> นักเรียนแตะที่ปุ่มได้ทันที
                    </p>
                  </div>

                  <div className="bg-white p-3.5 rounded-2xl border border-emerald-100 shadow-xs space-y-1.5">
                    <div className="font-bold text-slate-900 flex items-center gap-1 text-xs">
                      <span>📱 ขั้นที่ 3: เปิด LIFF ใน LINE</span>
                    </div>
                    <p className="text-[11px] leading-relaxed text-slate-600">
                      หน้าเว็บ React จะเด้งเปิดขึ้นมา<strong>ในแอป LINE ทันที</strong> (ไม่ต้องดาวน์โหลดแอปใหม่ ไม่ต้องจำรหัสผ่านเข้าเว็บ)
                    </p>
                  </div>
                </div>
              </div>

              {/* Question 2: จะรู้ได้ไงว่านักเรียนใช้ LINE อะไร? (One-time Binding) */}
              <div className="bg-indigo-50/70 border border-indigo-200 rounded-3xl p-5 space-y-3">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-xs">
                    2
                  </span>
                  <h4 className="font-black text-slate-900 text-sm">
                    ระบบรู้ได้ยังไงว่าเด็กคนไหนใช้ LINE บัญชีอะไร? (การผูกบัญชีอัตโนมัติ)
                  </h4>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-indigo-100 space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0 text-lg">
                      🔑
                    </div>
                    <div>
                      <div className="font-bold text-slate-800 text-xs">
                        เทคโนโลยี LIFF SDK ดึง LINE Profile อัตโนมัติ:
                      </div>
                      <p className="text-[11px] text-slate-600 leading-relaxed mt-0.5">
                        เมื่อนักเรียนเปิดเว็บผ่าน LINE คำสั่ง <code>liff.getProfile()</code> จะส่งค่า{' '}
                        <strong>LINE User ID</strong> (เช่น <code>U82a9...</code> เป็นรหัสประจำตัวถาวรที่ไม่ซ้ำกัน) และชื่อ LINE มาให้เว็บเราทันที
                      </p>
                    </div>
                  </div>

                  <div className="border-t border-slate-100 pt-3">
                    <span className="font-bold text-slate-800 block mb-2">
                      กระบวนการผูกบัญชี 1 ครั้งในชีวิต (ใช้เวลา 5 วินาที):
                    </span>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-[11px] bg-slate-50 p-2.5 rounded-xl">
                        <span className="w-5 h-5 rounded-full bg-indigo-600 text-white text-[10px] font-bold flex items-center justify-center shrink-0">1</span>
                        <span>เมื่อเปิดเว็บครั้งแรก ระบบตรวจพบว่ายังไม่เคยผูก LINE จึงถามว่า: <em>&ldquo;คุณคือนักเรียนคนไหนในห้อง ม.4/1?&rdquo;</em></span>
                      </div>
                      <div className="flex items-center gap-2 text-[11px] bg-slate-50 p-2.5 rounded-xl">
                        <span className="w-5 h-5 rounded-full bg-indigo-600 text-white text-[10px] font-bold flex items-center justify-center shrink-0">2</span>
                        <span>นักเรียนเลือก <strong>ชื่อและเลขที่ของตัวเอง</strong> ในลิสต์ แล้วกด &ldquo;ยืนยันตัวตน&rdquo;</span>
                      </div>
                      <div className="flex items-center gap-2 text-[11px] bg-emerald-50 text-emerald-800 p-2.5 rounded-xl border border-emerald-200">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span><strong>สำเร็จ!</strong> ระบบจะนำ LINE User ID นั้นไปผูกกับชื่อนักเรียนคนนั้นในฐานข้อมูลถาวร ครั้งต่อไปที่เด็กเปิด LINE ระบบจะรู้ทันทีโดยไม่ต้องล็อกอินซ้ำอีกเลย!</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Question 3: แล้วครูจะส่งทวงงานไปยังไง? */}
              <div className="bg-amber-50/70 border border-amber-200 rounded-3xl p-5 space-y-3">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-amber-600 text-white flex items-center justify-center font-bold text-xs">
                    3
                  </span>
                  <h4 className="font-black text-slate-900 text-sm">
                    แล้วระบบส่งแจ้งเตือนหรือทวงงานไปยังไง?
                  </h4>
                </div>

                <p className="text-[11px] text-slate-600 leading-relaxed">
                  เมื่อระบบมี <strong>LINE User ID</strong> ของนักเรียนแล้ว เมื่อครูกดปุ่ม <strong>&ldquo;ทวงงาน&rdquo;</strong> หรือ <strong>&ldquo;ส่งผลคะแนน&rdquo;</strong>:
                  ระบบจะยิง API ไปที่ LINE Server (Push Message) เพื่อส่งการ์ด Flex Bubble เข้าแชทส่วนตัวของนักเรียนคนนั้นทันที
                  ในข้อความจะมีปุ่มให้กดเปิดหน้าส่งงาน LIFF ตรงเป้าหมายได้เลย!
                </p>
              </div>

            </div>
          )}

          {/* TAB 2: BINDING SIMULATOR */}
          {activeStepTab === 'binding_simulator' && (
            <div className="space-y-5">
              
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <span className="font-bold text-slate-800 text-sm block mb-1">
                  🧪 ทดลองจำลองการผูก LINE กับนักเรียนในระบบ:
                </span>
                <p className="text-slate-500 text-[11px]">
                  เลือกนักเรียนและใส่ชื่อบัญชี LINE จำลอง เพื่อดูว่าระบบบันทึกและนำ LINE ID ไปใช้ยิงข้อความอย่างไร
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                
                {/* Simulator Form */}
                <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-3.5">
                  <div className="font-bold text-slate-800 text-xs flex items-center gap-1.5">
                    <UserCheck className="w-4 h-4 text-emerald-600" />
                    ฟอร์มจับคู่ LINE Profile กับนักเรียน
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">เลือกนักเรียนที่จะผูก:</label>
                    <select
                      value={simStudentId}
                      onChange={(e) => setSimStudentId(e.target.value)}
                      className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-bold"
                    >
                      {currentClassStudents.map((s) => (
                        <option key={s.id} value={s.id}>
                          เลขที่ {s.studentNumber} {s.name} ({s.nickname}) {s.lineUserId ? '🟢 (ผูกแล้ว)' : '⚪ (ยังไม่ผูก)'}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">ชื่อบัญชี LINE จำลอง:</label>
                    <input
                      type="text"
                      value={simLineName}
                      onChange={(e) => setSimLineName(e.target.value)}
                      className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">LINE User ID (จำลอง):</label>
                    <input
                      type="text"
                      value={simLineUserId}
                      onChange={(e) => setSimLineUserId(e.target.value)}
                      className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-mono text-[11px] text-slate-600"
                    />
                  </div>

                  <button
                    onClick={handleSimulateBinding}
                    className="w-full py-2.5 bg-[#06C755] hover:bg-[#05B34C] text-white font-bold rounded-xl shadow-sm flex items-center justify-center gap-1.5 active:scale-95 transition-all text-xs"
                  >
                    <Check className="w-4 h-4" />
                    กดผูกบัญชี LINE กับนักเรียนคนนี้
                  </button>

                  {boundSuccessNotice && (
                    <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex items-center gap-2 animate-bounce">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>ผูกบัญชี LINE สำเร็จ! ตอนนี้ครูสามารถยิงทวงงานเข้า LINE นักเรียนได้ทันที</span>
                    </div>
                  )}
                </div>

                {/* Status Table of Current Students LINE Binding */}
                <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800 text-xs">
                      สถานะการผูก LINE ของห้อง {selectedClass}
                    </span>
                    <span className="text-[10px] text-slate-500">
                      ผูกแล้ว {currentClassStudents.filter((s) => s.lineUserId).length} / {currentClassStudents.length} คน
                    </span>
                  </div>

                  <div className="divide-y divide-slate-100 max-h-64 overflow-y-auto text-xs">
                    {currentClassStudents.map((s) => (
                      <div key={s.id} className="py-2 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span>{s.avatar}</span>
                          <div>
                            <div className="font-bold text-slate-800">
                              {s.name} ({s.nickname})
                            </div>
                            <span className="text-[10px] text-slate-400">เลขที่ {s.studentNumber}</span>
                          </div>
                        </div>

                        <div>
                          {s.lineUserId ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                              ผูกแล้ว
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 font-medium text-[10px]">
                              ยังไม่ผูก
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Shareable Link Box */}
                  <div className="pt-2 border-t border-slate-100">
                    <span className="text-[10px] font-bold text-slate-500 block mb-1">
                      ลิงก์ส่งให้นักเรียนในห้องแอดไลน์และผูกบัญชี (LIFF URL):
                    </span>
                    <div className="flex items-center gap-1.5">
                      <input
                        type="text"
                        readOnly
                        value={liffUrl}
                        className="flex-1 p-2 bg-slate-50 border border-slate-200 rounded-lg text-[10px] font-mono text-slate-600 outline-none"
                      />
                      <button
                        onClick={handleCopyLink}
                        className="px-2.5 py-2 bg-slate-900 text-white rounded-lg font-bold flex items-center gap-1 shrink-0"
                      >
                        {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedLink ? 'ก๊อปแล้ว!' : 'คัดลอก'}</span>
                      </button>
                    </div>
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* TAB 3: STEP-BY-STEP SETUP IN LINE DEVELOPERS */}
          {activeStepTab === 'setup_steps' && (
            <div className="space-y-4">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-slate-700 space-y-1">
                <span className="font-bold text-slate-900 text-sm block">
                  🛠️ วิธีเปิดใช้งานจริงบน LINE Developers Console (ทำครั้งเดียว):
                </span>
                <p className="text-[11px] text-slate-500">
                  สำหรับคุณครูหรือโรงเรียนที่ต้องการนำไปต่อกับ LINE OA ของโรงเรียนจริงๆ
                </p>
              </div>

              <div className="space-y-3">
                <div className="p-4 bg-white rounded-2xl border border-slate-200 space-y-1.5">
                  <div className="font-bold text-slate-900 text-xs flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-slate-900 text-white text-[10px] flex items-center justify-center font-bold">1</span>
                    <span>สร้าง LINE Official Account (LINE OA)</span>
                  </div>
                  <p className="text-[11px] text-slate-600 pl-7">
                    เข้าไปที่ <a href="https://manager.line.biz" target="_blank" rel="noreferrer" className="text-emerald-600 font-bold underline inline-flex items-center gap-0.5">manager.line.biz <ExternalLink className="w-3 h-3" /></a> เพื่อสร้างบัญชีครูหรือชื่อวิชา เช่น @khunmootuang
                  </p>
                </div>

                <div className="p-4 bg-white rounded-2xl border border-slate-200 space-y-1.5">
                  <div className="font-bold text-slate-900 text-xs flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-slate-900 text-white text-[10px] flex items-center justify-center font-bold">2</span>
                    <span>เปิด Messaging API & เอา Channel Access Token</span>
                  </div>
                  <p className="text-[11px] text-slate-600 pl-7">
                    เข้าไปที่ <a href="https://developers.line.biz" target="_blank" rel="noreferrer" className="text-emerald-600 font-bold underline inline-flex items-center gap-0.5">developers.line.biz <ExternalLink className="w-3 h-3" /></a> เลือก Provider ของเรา ➔ Messaging API ➔ ออกคีย์ <strong>Channel Access Token (Long-lived)</strong> แล้วนำมาวางในช่อง &ldquo;ตั้งค่า&rdquo; ของเว็บนี้
                  </p>
                </div>

                <div className="p-4 bg-white rounded-2xl border-2 border-emerald-300 bg-emerald-50/20 space-y-2">
                  <div className="font-bold text-slate-900 text-xs flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-emerald-600 text-white text-[10px] flex items-center justify-center font-bold">3</span>
                    <span className="text-emerald-800">สร้าง LIFF App ใน Channel ชนิด LINE Login (สำคัญมาก!)</span>
                  </div>
                  <div className="text-[11px] text-slate-600 pl-7 space-y-1.5 leading-relaxed">
                    <p>
                      • ⚠️ กด <strong>Create a new channel</strong> ➔ เลือกประเภท <strong>&ldquo;LINE Login&rdquo;</strong> (ถ้าเลือก Messaging API จะไม่มีแท็บ LIFF) และติ๊กเลือก <code>Web app</code>
                    </p>
                    <p>
                      • ใน Channel LINE Login คลิกแท็บ <strong>&ldquo;LIFF&rdquo;</strong> ➔ กดปุ่มสีเขียว <strong>&ldquo;Add LIFF app&rdquo;</strong>
                    </p>
                    <p>
                      • <strong>Size:</strong> เลือก <code>Full</code> (เปิดเต็มหน้าจอมือถือ เหมาะกับส่งงาน/วาดรูป)
                    </p>
                    <p>
                      • <strong>Endpoint URL:</strong> ใส่ URL เว็บไซต์ที่เป็น <code>https://</code> เท่านั้น (เช่น <code>https://your-domain.vercel.app</code>)
                    </p>
                    <p>
                      • <strong>Scopes:</strong> ติ๊กถูก <code>profile</code> และ <code>openid</code> (เพื่อให้ดึง User ID มาผูกนักเรียน)
                    </p>
                    <p className="bg-amber-100/70 p-2 rounded-xl text-amber-900 border border-amber-300">
                      ⚡ <strong>อย่าลืม:</strong> เมื่อสร้างเสร็จ ด้านบนจะมีปุ่มสถานะสีเทาว่า <code>Developing</code> ให้คลิกเปลี่ยนเป็น <strong className="text-emerald-700">`Published`</strong> เพื่อให้นักเรียนทุกคนกดเปิดเข้าใช้งานได้!
                    </p>
                  </div>
                </div>

                <div className="p-4 bg-white rounded-2xl border border-slate-200 space-y-1.5">
                  <div className="font-bold text-slate-900 text-xs flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-slate-900 text-white text-[10px] flex items-center justify-center font-bold">4</span>
                    <span>นำ LIFF URL ไปใส่ใน Rich Menu ของ LINE OA</span>
                  </div>
                  <p className="text-[11px] text-slate-600 pl-7">
                    สร้างเมนูด้านล่างใน LINE OA Manager ให้ปุ่มเปิด URL: <code>https://liff.line.me/LIFF_ID_ของคุณ</code> เมื่อนักเรียนกดปุ่มใน LINE ระบบจะเปิดเว็บ React และผูก LINE ให้เด็กทันที!
                  </p>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <span className="text-[11px] text-slate-500">
            💡 ระบบรองรับทั้งการทดสอบในเครื่อง และการเชื่อมต่อ LINE Production จริง
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-900 text-white rounded-xl font-bold"
          >
            เข้าใจแล้ว
          </button>
        </div>

      </div>
    </div>
  );
};
