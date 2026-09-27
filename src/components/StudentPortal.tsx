import React, { useState } from 'react';
import { Student, Assignment, Submission, MascotType } from '../types';
import {
  Upload,
  CheckCircle2,
  Clock,
  Sparkles,
  Flame,
  Award,
  BookOpen,
  Camera,
  Edit3,
  Check
} from 'lucide-react';
import { sound } from '../services/soundService';
import { LineUserProfile } from '../services/liffService';
import { RefreshCw } from 'lucide-react';

interface StudentPortalProps {
  currentStudent: Student;
  assignments: Assignment[];
  submissions: Submission[];
  onOpenCanvas: (submission: Submission, student: Student, assignment: Assignment) => void;
  onOpenHatchModal: (student: Student) => void;
  onUploadHomework: (assignmentId: string, studentId: string, sampleImageUrl?: string) => void;
  mascot: MascotType;
  lineProfile?: LineUserProfile | null;
  onRebind?: () => void;
}

export const StudentPortal: React.FC<StudentPortalProps> = ({
  currentStudent,
  assignments,
  submissions,
  onOpenCanvas,
  onOpenHatchModal,
  onUploadHomework,
  mascot,
  lineProfile,
  onRebind,
}) => {
  const [activeTab, setActiveTab] = useState<'assignments' | 'pets' | 'profile'>('assignments');
  const [selectedAsgForUpload, setSelectedAsgForUpload] = useState<string | null>(null);

  const mascotEmoji = mascot === 'chicken' ? '🐔' : '🐷';
  const mascotName = mascot === 'chicken' ? 'คุณไก่ทวง' : 'คุณหมูทวง';

  const sampleWorkImages = [
    'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=800&q=80'
  ];

  const handleQuickUpload = (asgId: string) => {
    sound.playCoin();
    const randomImg = sampleWorkImages[Math.floor(Math.random() * sampleWorkImages.length)];
    onUploadHomework(asgId, currentStudent.id, randomImg);
    setSelectedAsgForUpload(null);
  };

  return (
    <div className="max-w-md mx-auto min-h-screen bg-slate-100 pb-16 flex flex-col shadow-2xl rounded-3xl overflow-hidden border border-slate-300">
      
      {/* LINE LIFF Header Bar */}
      <div className="bg-[#24303c] text-white px-4 py-3 flex items-center justify-between shadow">
        <div className="flex items-center gap-2">
          {lineProfile?.pictureUrl ? (
            <img
              src={lineProfile.pictureUrl}
              alt="LINE"
              className="w-8 h-8 rounded-full border border-emerald-400 object-cover"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-rose-500 flex items-center justify-center text-lg shadow-sm">
              {mascotEmoji}
            </div>
          )}
          <div>
            <div className="font-bold text-xs flex items-center gap-1">
              <span>{mascotName} LIFF</span>
              {lineProfile?.displayName && (
                <span className="text-[10px] text-emerald-400 font-normal">
                  ({lineProfile.displayName})
                </span>
              )}
            </div>
            <div className="text-[10px] text-slate-300">
              ห้อง {currentStudent.classroom} • เลขที่ {currentStudent.studentNumber}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {onRebind && (
            <button
              onClick={onRebind}
              className="text-[10px] bg-white/10 hover:bg-white/20 text-slate-200 px-2 py-1 rounded-lg flex items-center gap-1 transition-all"
              title="เปลี่ยนห้องหรือเลือกชื่อใหม่"
            >
              <RefreshCw className="w-2.5 h-2.5 text-amber-300" />
              <span>สลับห้อง/ชื่อ</span>
            </button>
          )}
          <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full font-bold border border-emerald-500/30">
            ห้อง {currentStudent.classroom}
          </span>
        </div>
      </div>

      {/* Student Profile & Gamification Card */}
      <div className="bg-gradient-to-br from-rose-500 via-pink-600 to-amber-500 text-white p-5 shadow-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-3xl shadow-inner border border-white/30">
              {currentStudent.avatar}
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-black text-base">{currentStudent.name}</h3>
                <span className="text-xs bg-white/25 px-1.5 py-0.2 rounded font-bold">
                  ({currentStudent.nickname})
                </span>
              </div>
              <div className="text-xs text-pink-100 mt-0.5">
                เลขที่ {currentStudent.studentNumber} • ชั้น {currentStudent.classroom}
              </div>
            </div>
          </div>

          <div className="text-right">
            <span className="text-xs font-bold text-amber-200 bg-black/25 px-2.5 py-0.5 rounded-full">
              Lv. {currentStudent.level}
            </span>
            <div className="flex items-center gap-1 text-xs font-bold text-white mt-1 justify-end">
              <Flame className="w-3.5 h-3.5 fill-amber-300 text-amber-300" />
              <span>{currentStudent.streakDays} วันติด</span>
            </div>
          </div>
        </div>

        {/* EXP Bar & Egg Counter */}
        <div className="mt-4 pt-3 border-t border-white/20 flex items-center justify-between text-xs">
          <div className="flex-1 mr-4">
            <div className="flex justify-between text-[11px] mb-1 font-bold text-pink-100">
              <span>{currentStudent.exp} EXP สะสม</span>
              <span>อีก {100 - (currentStudent.exp % 100)} EXP ขึ้นเลเวลใหม่</span>
            </div>
            <div className="w-full bg-black/20 h-2 rounded-full overflow-hidden">
              <div
                className="bg-amber-300 h-full rounded-full transition-all duration-500"
                style={{ width: `${currentStudent.exp % 100}%` }}
              />
            </div>
          </div>

          <button
            onClick={() => onOpenHatchModal(currentStudent)}
            className="bg-white text-slate-900 hover:bg-amber-100 font-black text-xs px-3 py-1.5 rounded-xl shadow-md flex items-center gap-1 active:scale-95 transition-all"
          >
            <span>🥚</span>
            <span>ไข่ {currentStudent.unopenedEggs} ฟอง</span>
          </button>
        </div>
      </div>

      {/* Segmented Navigation Tab */}
      <div className="flex bg-white border-b border-slate-200 text-xs font-bold">
        <button
          onClick={() => setActiveTab('assignments')}
          className={`flex-1 py-3 text-center border-b-2 transition-all flex items-center justify-center gap-1.5 ${
            activeTab === 'assignments'
              ? 'border-rose-500 text-rose-600 bg-rose-50/30'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>การบ้านของฉัน</span>
        </button>
        <button
          onClick={() => setActiveTab('pets')}
          className={`flex-1 py-3 text-center border-b-2 transition-all flex items-center justify-center gap-1.5 ${
            activeTab === 'pets'
              ? 'border-rose-500 text-rose-600 bg-rose-50/30'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>สัตว์เลี้ยง ({currentStudent.pets.length})</span>
        </button>
      </div>

      {/* Tab 1: Assignments list */}
      {activeTab === 'assignments' && (
        <div className="p-4 space-y-3 flex-1 overflow-y-auto">
          {assignments.map((asg) => {
            const sub = submissions.find(
              (s) => s.assignmentId === asg.id && s.studentId === currentStudent.id
            );
            const isSubmitted = sub && sub.status !== 'pending';
            const isGraded = sub?.status === 'graded';

            return (
              <div
                key={asg.id}
                className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200/80 space-y-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                      {asg.subject}
                    </span>
                    <h4 className="font-bold text-slate-800 text-sm mt-1">{asg.title}</h4>
                  </div>
                  {isGraded ? (
                    <span className="text-xs font-black bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-xl shrink-0 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      {sub.score}/{sub.maxScore}
                    </span>
                  ) : isSubmitted ? (
                    <span className="text-[11px] font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-lg shrink-0">
                      รอตรวจ
                    </span>
                  ) : (
                    <span className="text-[11px] font-bold bg-rose-100 text-rose-700 px-2 py-0.5 rounded-lg shrink-0">
                      ยังไม่ส่ง
                    </span>
                  )}
                </div>

                <div className="text-xs text-slate-500 flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-rose-500" />
                  <span>กำหนดส่ง: <strong className="text-rose-600">{asg.dueDate}</strong></span>
                </div>

                {/* Teacher comment if graded */}
                {sub?.teacherComment && (
                  <div className="p-2.5 bg-emerald-50 rounded-xl text-xs text-emerald-900 border border-emerald-100">
                    <strong>ครูเขียนให้:</strong> &ldquo;{sub.teacherComment}&rdquo;
                  </div>
                )}

                {/* Submitted image preview */}
                {sub?.fileUrl && (
                  <div className="flex items-center gap-2 bg-slate-50 p-2 rounded-xl">
                    <img
                      src={sub.annotatedImageUrl || sub.fileUrl}
                      alt="Work"
                      className="w-14 h-14 rounded-lg object-cover border border-slate-200"
                    />
                    <div className="text-xs">
                      <span className="font-bold text-slate-700">รูปภาพที่ส่งแล้ว</span>
                      {sub.annotatedImageUrl && (
                        <div className="text-[10px] text-emerald-600 font-bold mt-0.5">
                          ✓ มีรอยตรวจปากกาของคุณครู
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Actions: Send homework / Draw */}
                <div className="pt-2 border-t border-slate-100 flex items-center gap-2">
                  {!isSubmitted ? (
                    <>
                      <button
                        onClick={() => handleQuickUpload(asg.id)}
                        className="flex-1 py-2 bg-[#06C755] hover:bg-[#05B34C] text-white font-bold text-xs rounded-xl shadow-sm flex items-center justify-center gap-1 active:scale-95 transition-all"
                      >
                        <Camera className="w-3.5 h-3.5" />
                        ถ่ายรูปส่งงาน
                      </button>

                      {sub && (
                        <button
                          onClick={() => onOpenCanvas(sub, currentStudent, asg)}
                          className="px-3 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs rounded-xl border border-indigo-200 flex items-center gap-1"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          วาดรูป
                        </button>
                      )}
                    </>
                  ) : (
                    <div className="w-full text-center text-xs font-bold text-emerald-600 flex items-center justify-center gap-1 py-1">
                      <Check className="w-4 h-4" />
                      ส่งงานเรียบร้อยแล้ว
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Tab 2: Companion Pets */}
      {activeTab === 'pets' && (
        <div className="p-4 space-y-3 flex-1 overflow-y-auto">
          {currentStudent.pets.length > 0 ? (
            currentStudent.pets.map((pet) => (
              <div
                key={pet.id}
                className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200 flex items-center gap-4"
              >
                <div className="w-16 h-16 rounded-2xl bg-amber-50 flex items-center justify-center text-4xl shadow-inner border border-amber-200">
                  {pet.imageUrl}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-slate-800 text-sm">{pet.name}</h4>
                    <span className="text-[10px] bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full font-bold">
                      ★ {pet.rarity}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">{pet.description}</p>
                  <span className="text-[10px] text-slate-400 mt-1 block">
                    ได้รับเมื่อ {pet.obtainedAt}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white rounded-2xl p-8 text-center text-slate-400 text-xs">
              ยังไม่มีสัตว์เลี้ยง ส่งการบ้านตรงเวลาเพื่อรับไข่สุ่ม!
            </div>
          )}
        </div>
      )}

    </div>
  );
};
