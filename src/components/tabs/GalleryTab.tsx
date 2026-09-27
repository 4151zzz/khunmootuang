import React, { useState } from 'react';
import { Submission, Student, Assignment, MascotType } from '../../types';
import { Heart, MessageCircle, Send, Sparkles, Award } from 'lucide-react';
import { sound } from '../../services/soundService';

interface GalleryTabProps {
  submissions: Submission[];
  students: Student[];
  assignments: Assignment[];
  onUpdateSubmission: (updated: Submission) => void;
  mascot: MascotType;
}

export const GalleryTab: React.FC<GalleryTabProps> = ({
  submissions,
  students,
  assignments,
  onUpdateSubmission,
  mascot,
}) => {
  const [selectedAsgId, setSelectedAsgId] = useState<string>(assignments[0]?.id || '');
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});

  // Submissions that have files/images uploaded
  const showcaseSubmissions = submissions.filter(
    (s) => s.assignmentId === selectedAsgId && (s.fileUrl || s.annotatedImageUrl)
  );

  const handleLike = (sub: Submission) => {
    sound.playTap();
    onUpdateSubmission({
      ...sub,
      peerLikes: sub.peerLikes + 1
    });
  };

  const handleAddComment = (sub: Submission, e: React.FormEvent) => {
    e.preventDefault();
    const text = commentInputs[sub.id]?.trim();
    if (!text) return;

    sound.playCoin();
    const newComment = {
      id: `c-${Date.now()}`,
      studentName: 'คุณหมูทวง (หรือเพื่อนร่วมชั้น)',
      text,
      time: 'เมื่อสักครู่'
    };

    onUpdateSubmission({
      ...sub,
      peerComments: [...sub.peerComments, newComment]
    });

    setCommentInputs((prev) => ({ ...prev, [sub.id]: '' }));
  };

  const getStudent = (studentId: string) => {
    return students.find((s) => s.id === studentId);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200/80 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold bg-pink-100 text-pink-800 px-2.5 py-0.5 rounded-full flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-pink-600" />
              ห้องนิทรรศการผลงาน (Peer Review & Gallery)
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-800 m-0">
            ระบบแชร์ผลงาน: ชมและให้กำลังใจเพื่อนๆ 🎨✨
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            เปิดพื้นที่ให้นักเรียนชื่นชมผลงานซึ่งกันและกัน กดไลก์ และแลกเปลี่ยนข้อเสนอแนะเชิงบวก
          </p>
        </div>

        {/* Assignment filter */}
        <div className="flex items-center gap-2">
          <label className="text-xs font-bold text-slate-500">เลือกงาน:</label>
          <select
            value={selectedAsgId}
            onChange={(e) => setSelectedAsgId(e.target.value)}
            className="text-xs font-bold bg-slate-100 border border-slate-200 rounded-xl px-3 py-2 outline-none"
          >
            {assignments.map((a) => (
              <option key={a.id} value={a.id}>
                {a.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Grid of Student Submissions */}
      {showcaseSubmissions.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {showcaseSubmissions.map((sub) => {
            const student = getStudent(sub.studentId);
            if (!student) return null;

            return (
              <div
                key={sub.id}
                className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow flex flex-col justify-between"
              >
                <div>
                  {/* Author Header */}
                  <div className="p-4 flex items-center justify-between border-b border-slate-100">
                    <div className="flex items-center gap-2.5">
                      <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-xl">
                        {student.avatar}
                      </div>
                      <div>
                        <div className="font-bold text-slate-800 text-xs">
                          {student.name} ({student.nickname})
                        </div>
                        <div className="text-[10px] text-slate-400">
                          ส่งเมื่อ {sub.submittedAt || 'วันนี้'}
                        </div>
                      </div>
                    </div>

                    {sub.score !== undefined && (
                      <span className="text-[11px] font-black bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-lg flex items-center gap-1">
                        <Award className="w-3.5 h-3.5 text-emerald-600" />
                        {sub.score} / {sub.maxScore}
                      </span>
                    )}
                  </div>

                  {/* Submission Image */}
                  <div className="relative group bg-slate-100 aspect-video overflow-hidden">
                    <img
                      src={sub.annotatedImageUrl || sub.fileUrl}
                      alt="Student submission"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {sub.annotatedImageUrl && (
                      <span className="absolute top-2 right-2 bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow">
                        ✓ มีรอยตรวจเขียนบนรูป
                      </span>
                    )}
                  </div>

                  {/* Teacher Feedback pill if any */}
                  {sub.teacherComment && (
                    <div className="p-3 bg-amber-50/70 border-b border-amber-100 text-[11px] text-amber-900 italic">
                      💬 ครูให้ข้อเสนอแนะ: &ldquo;{sub.teacherComment}&rdquo;
                    </div>
                  )}

                  {/* Comments feed */}
                  <div className="p-4 space-y-2 max-h-40 overflow-y-auto">
                    <div className="text-[11px] font-bold text-slate-500 flex items-center gap-1">
                      <MessageCircle className="w-3.5 h-3.5" />
                      ความคิดเห็นเพื่อนๆ ({sub.peerComments.length})
                    </div>
                    {sub.peerComments.map((c) => (
                      <div key={c.id} className="text-xs bg-slate-50 p-2 rounded-xl">
                        <div className="flex items-center justify-between text-[10px] text-slate-400 mb-0.5">
                          <strong className="text-slate-700">{c.studentName}</strong>
                          <span>{c.time}</span>
                        </div>
                        <p className="text-slate-600 leading-tight">{c.text}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Footer Interactions */}
                <div className="p-4 pt-2 border-t border-slate-100 bg-white space-y-2">
                  <div className="flex items-center justify-between">
                    <button
                      onClick={() => handleLike(sub)}
                      className="flex items-center gap-1.5 text-xs font-bold text-rose-600 bg-rose-50 hover:bg-rose-100 px-3 py-1.5 rounded-xl transition-all active:scale-90"
                    >
                      <Heart className="w-4 h-4 fill-rose-500 text-rose-500" />
                      <span>{sub.peerLikes} ถูกใจ</span>
                    </button>
                    <span className="text-[10px] text-slate-400">กดไลก์เป็นกำลังใจ</span>
                  </div>

                  {/* Add comment input */}
                  <form onSubmit={(e) => handleAddComment(sub, e)} className="flex items-center gap-1.5">
                    <input
                      type="text"
                      placeholder="เขียนชื่นชมเพื่อน..."
                      value={commentInputs[sub.id] || ''}
                      onChange={(e) =>
                        setCommentInputs({ ...commentInputs, [sub.id]: e.target.value })
                      }
                      className="flex-1 bg-slate-100 text-xs px-3 py-1.5 rounded-xl outline-none focus:ring-1 focus:ring-pink-400"
                    />
                    <button
                      type="submit"
                      className="p-1.5 bg-pink-600 hover:bg-pink-700 text-white rounded-xl transition-colors shrink-0"
                    >
                      <Send className="w-3.5 h-3.5" />
                    </button>
                  </form>
                </div>

              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 text-slate-400 space-y-2">
          <div className="text-5xl">🖼️</div>
          <h4 className="font-bold text-slate-700">ยังไม่มีผลงานที่ส่งในหัวข้อนี้</h4>
          <p className="text-xs">
            เมื่อนักเรียนส่งชิ้นงานเข้ามา จะปรากฏบนแกลเลอรีนี้เพื่อให้ทุกคนได้ชมและแลกเปลี่ยนความเห็น
          </p>
        </div>
      )}

    </div>
  );
};
