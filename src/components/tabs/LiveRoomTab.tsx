import React, { useState } from 'react';
import { WordCloudItem, LivePoll, MascotType } from '../../types';
import { Send, QrCode, Sparkles, BarChart2, ThumbsUp, RefreshCw, MessageSquare } from 'lucide-react';
import { sound } from '../../services/soundService';
import confetti from 'canvas-confetti';

interface LiveRoomTabProps {
  wordCloud: WordCloudItem[];
  poll: LivePoll;
  onUpdateWordCloud: (items: WordCloudItem[]) => void;
  onUpdatePoll: (poll: LivePoll) => void;
  mascot: MascotType;
}

export const LiveRoomTab: React.FC<LiveRoomTabProps> = ({
  wordCloud,
  poll,
  onUpdateWordCloud,
  onUpdatePoll,
  mascot,
}) => {
  const [newWordInput, setNewWordInput] = useState('');
  const [activeMode, setActiveMode] = useState<'wordcloud' | 'poll'>('wordcloud');

  const mascotEmoji = mascot === 'chicken' ? '🐔' : '🐷';

  const handleAddWord = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWordInput.trim()) return;

    sound.playCoin();
    confetti({
      particleCount: 40,
      spread: 60,
      origin: { y: 0.8 }
    });

    const cleanWord = newWordInput.trim();
    const existingIndex = wordCloud.findIndex((w) => w.word.toLowerCase() === cleanWord.toLowerCase());

    const vibrantColors = ['#f43f5e', '#0ea5e9', '#ec4899', '#10b981', '#8b5cf6', '#f59e0b', '#06b6d4', '#84cc16'];

    if (existingIndex >= 0) {
      const updated = [...wordCloud];
      updated[existingIndex].count += 1;
      onUpdateWordCloud(updated);
    } else {
      const newItem: WordCloudItem = {
        id: `word-${Date.now()}`,
        word: cleanWord,
        count: 1,
        color: vibrantColors[Math.floor(Math.random() * vibrantColors.length)]
      };
      onUpdateWordCloud([...wordCloud, newItem]);
    }

    setNewWordInput('');
  };

  const handleVotePoll = (index: number) => {
    sound.playTap();
    const updatedOptions = [...poll.options];
    updatedOptions[index].count += 1;
    onUpdatePoll({
      ...poll,
      options: updatedOptions,
      totalVotes: poll.totalVotes + 1
    });
  };

  // Find max count for wordcloud font scaling
  const maxWordCount = Math.max(...wordCloud.map((w) => w.count), 1);

  return (
    <div className="space-y-6">
      
      {/* Header Bar */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200/80 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold bg-purple-100 text-purple-800 px-2.5 py-0.5 rounded-full flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-purple-600" />
              ระบบไลฟ์หน้าห้อง (Interactive Projector Screen)
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-800 m-0">
            หน้าจอขึ้นโปรเจกเตอร์สด: WordCloud & โพลล์ความเห็น 📡
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            เปิดฉายขึ้นจอหน้าห้อง ให้นักเรียนสแกน QR Code หรือส่งข้อความผ่าน LINE ขึ้นจอทันที
          </p>
        </div>

        {/* Mode Selector */}
        <div className="flex items-center bg-slate-100 p-1 rounded-2xl border border-slate-200 text-xs">
          <button
            onClick={() => setActiveMode('wordcloud')}
            className={`px-4 py-2 rounded-xl font-bold transition-all flex items-center gap-1.5 ${
              activeMode === 'wordcloud' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            WordCloud สด
          </button>
          <button
            onClick={() => setActiveMode('poll')}
            className={`px-4 py-2 rounded-xl font-bold transition-all flex items-center gap-1.5 ${
              activeMode === 'poll' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <BarChart2 className="w-3.5 h-3.5" />
            โพลล์คำถามหน้าห้อง
          </button>
        </div>
      </div>

      {/* Main Projector Screen Frame */}
      <div className="bg-slate-950 text-white rounded-3xl p-6 sm:p-8 shadow-2xl border-4 border-slate-800 relative overflow-hidden">
        
        {/* Background ambient lighting */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-rose-600/10 rounded-full blur-3xl pointer-events-none"></div>

        {/* Top Info Bar */}
        <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between pb-6 border-b border-white/10 gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center text-3xl shadow-inner">
              {mascotEmoji}
            </div>
            <div>
              <div className="text-xs text-amber-300 font-bold uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                LIVE SCREEN • ห้อง ม.4/1
              </div>
              <h3 className="text-xl font-black text-white mt-0.5">
                {activeMode === 'wordcloud' ? 'คำตอบสั้นๆ ท้ายคาบ: วันนี้ได้เรียนรู้อะไร?' : poll.question}
              </h3>
            </div>
          </div>

          {/* QR Code and Room PIN */}
          <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/15">
            <div className="w-12 h-12 bg-white rounded-xl p-1 flex items-center justify-center text-slate-900 shadow">
              <QrCode className="w-full h-full" />
            </div>
            <div className="text-left text-xs">
              <div className="text-slate-400 text-[10px]">สแกนหรือใส่ PIN</div>
              <div className="font-mono font-black text-amber-300 text-lg tracking-wider">ROOM-401</div>
            </div>
          </div>
        </div>

        {/* Mode 1: Dynamic Word Cloud */}
        {activeMode === 'wordcloud' && (
          <div className="relative z-10 py-12 px-4 min-h-[380px] flex items-center justify-center">
            <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 max-w-4xl mx-auto">
              {wordCloud.map((item) => {
                // Calculate font size between 16px and 52px based on frequency
                const scale = item.count / maxWordCount;
                const fontSize = Math.floor(16 + scale * 36);

                return (
                  <span
                    key={item.id}
                    className="font-bold transition-all hover:scale-125 cursor-pointer inline-block animate-fadeIn select-none"
                    style={{
                      fontSize: `${fontSize}px`,
                      color: item.color,
                      textShadow: `0 0 20px ${item.color}44`,
                      fontWeight: scale > 0.6 ? 800 : 600
                    }}
                    onClick={() => {
                      sound.playTap();
                      const updated = wordCloud.map((w) =>
                        w.id === item.id ? { ...w, count: w.count + 1 } : w
                      );
                      onUpdateWordCloud(updated);
                    }}
                    title={`คำว่า "${item.word}" ส่งแล้ว ${item.count} ครั้ง`}
                  >
                    {item.word}
                    {item.count > 1 && (
                      <span className="text-[10px] ml-1 opacity-70 bg-white/20 px-1.5 py-0.5 rounded-full align-top">
                        {item.count}
                      </span>
                    )}
                  </span>
                );
              })}
            </div>
          </div>
        )}

        {/* Mode 2: Live Poll Voting Bars */}
        {activeMode === 'poll' && (
          <div className="relative z-10 py-8 px-4 max-w-2xl mx-auto space-y-4">
            <div className="text-right text-xs text-slate-400">
              โหวตแล้วทั้งหมด: <strong className="text-white text-sm">{poll.totalVotes}</strong> เสียง
            </div>

            {poll.options.map((opt, i) => {
              const percent = poll.totalVotes > 0 ? Math.round((opt.count / poll.totalVotes) * 100) : 0;
              return (
                <div
                  key={i}
                  onClick={() => handleVotePoll(i)}
                  className="group bg-white/10 hover:bg-white/15 border border-white/15 rounded-2xl p-4 transition-all cursor-pointer relative overflow-hidden"
                >
                  {/* Progress bar background fill */}
                  <div
                    className="absolute inset-y-0 left-0 opacity-20 transition-all duration-700"
                    style={{
                      width: `${percent}%`,
                      backgroundColor: opt.color
                    }}
                  />

                  <div className="relative z-10 flex items-center justify-between">
                    <span className="font-bold text-sm text-white group-hover:text-amber-200 transition-colors">
                      {opt.label}
                    </span>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-slate-300 font-mono">{opt.count} โหวต</span>
                      <span
                        className="text-base font-black font-mono px-2 py-0.5 rounded-lg text-white"
                        style={{ backgroundColor: opt.color }}
                      >
                        {percent}%
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Bottom Fast Word Input Emulator for Teacher/Live Demo */}
        <div className="relative z-10 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="text-xs text-slate-400">
            💬 จำลองนักเรียนส่งคำตอบ หรือให้นักเรียนพิมพ์สด:
          </span>

          <form onSubmit={handleAddWord} className="flex items-center gap-2 w-full sm:w-auto">
            <input
              type="text"
              placeholder="พิมพ์คำตอบสั้นๆ เช่น ทำความเข้าใจง่าย..."
              value={newWordInput}
              onChange={(e) => setNewWordInput(e.target.value)}
              className="bg-white/10 border border-white/20 rounded-xl px-4 py-2 text-xs text-white placeholder-slate-400 outline-none focus:ring-2 focus:ring-rose-400 w-full sm:w-64"
            />
            <button
              type="submit"
              className="bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-600 hover:to-amber-600 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1 shadow-md active:scale-95 transition-all shrink-0"
            >
              <Send className="w-3.5 h-3.5" />
              ส่งขึ้นจอ
            </button>
          </form>
        </div>

      </div>

    </div>
  );
};
