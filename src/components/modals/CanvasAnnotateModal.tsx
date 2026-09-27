import React, { useRef, useState, useEffect } from 'react';
import { X, Check, Undo2, Trash2, Edit3, Highlighter, Stamp, Download } from 'lucide-react';
import { sound } from '../../services/soundService';

interface CanvasAnnotateModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl?: string;
  studentName: string;
  assignmentTitle: string;
  onSaveAnnotation: (annotatedDataUrl: string) => void;
  mascot: 'pig' | 'chicken';
}

type ToolMode = 'pen' | 'highlighter' | 'eraser' | 'stamp';

export const CanvasAnnotateModal: React.FC<CanvasAnnotateModalProps> = ({
  isOpen,
  onClose,
  imageUrl,
  studentName,
  assignmentTitle,
  onSaveAnnotation,
  mascot,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [tool, setTool] = useState<ToolMode>('pen');
  const [color, setColor] = useState('#ef4444');
  const [lineWidth, setLineWidth] = useState(4);
  const [selectedStamp, setSelectedStamp] = useState('💯');
  const [isDrawing, setIsDrawing] = useState(false);
  const [history, setHistory] = useState<ImageData[]>([]);

  const stamps = [
    '💯',
    '⭐',
    '✏️',
    '⚠️',
    mascot === 'pig' ? '🐷 ผ่านฉลุย!' : '🐔 ยอดเยี่ยม!',
    '👍 ดีมาก',
    '🔍 ตรวจทานใหม่'
  ];

  const colors = [
    '#ef4444', // Red
    '#f59e0b', // Amber
    '#10b981', // Green
    '#3b82f6', // Blue
    '#8b5cf6', // Purple
    '#ec4899', // Pink
  ];

  // Initialize canvas with background image or worksheet
  useEffect(() => {
    if (!isOpen) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = imageUrl || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80';

    img.onload = () => {
      canvas.width = 750;
      canvas.height = 550;
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      const initialSnapshot = ctx.getImageData(0, 0, canvas.width, canvas.height);
      setHistory([initialSnapshot]);
    };

    img.onerror = () => {
      // Fallback clean sheet
      canvas.width = 750;
      canvas.height = 550;
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      // Grid lines
      ctx.strokeStyle = '#e2e8f0';
      ctx.lineWidth = 1;
      for (let y = 30; y < canvas.height; y += 30) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }
      ctx.fillStyle = '#64748b';
      ctx.font = '16px Prompt';
      ctx.fillText(`เอกสารส่งงานของ: ${studentName}`, 30, 40);
      ctx.fillText(`หัวข้อ: ${assignmentTitle}`, 30, 70);
      const initialSnapshot = ctx.getImageData(0, 0, canvas.width, canvas.height);
      setHistory([initialSnapshot]);
    };
  }, [isOpen, imageUrl, studentName, assignmentTitle]);

  if (!isOpen) return null;

  const saveHistorySnapshot = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const snapshot = ctx.getImageData(0, 0, canvas.width, canvas.height);
    setHistory((prev) => [...prev.slice(-15), snapshot]);
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;

    if (tool === 'stamp') {
      sound.playTap();
      ctx.font = 'bold 28px Prompt, sans-serif';
      ctx.fillStyle = color;
      ctx.textAlign = 'center';
      ctx.fillText(selectedStamp, x, y);
      saveHistorySnapshot();
      return;
    }

    setIsDrawing(true);
    ctx.beginPath();
    ctx.moveTo(x, y);

    if (tool === 'eraser') {
      ctx.globalCompositeOperation = 'destination-out';
      ctx.lineWidth = lineWidth * 3;
    } else if (tool === 'highlighter') {
      ctx.globalCompositeOperation = 'source-over';
      ctx.strokeStyle = `${color}44`; // Semi-transparent
      ctx.lineWidth = lineWidth * 3.5;
      ctx.lineCap = 'square';
    } else {
      ctx.globalCompositeOperation = 'source-over';
      ctx.strokeStyle = color;
      ctx.lineWidth = lineWidth;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || tool === 'stamp') return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const handleMouseUp = () => {
    if (isDrawing) {
      setIsDrawing(false);
      saveHistorySnapshot();
    }
  };

  const handleUndo = () => {
    if (history.length <= 1) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const newHistory = history.slice(0, -1);
    const previousSnapshot = newHistory[newHistory.length - 1];
    ctx.putImageData(previousSnapshot, 0, 0);
    setHistory(newHistory);
  };

  const handleClear = () => {
    if (history.length === 0) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.putImageData(history[0], 0, 0);
    setHistory([history[0]]);
  };

  const handleSave = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    sound.playCoin();
    const dataUrl = canvas.toDataURL('image/png');
    onSaveAnnotation(dataUrl);
    onClose();
  };

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = `ตรวจงาน_${studentName}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-900/70 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full flex flex-col max-h-[95vh] overflow-hidden border border-slate-200">
        
        {/* Header */}
        <div className="p-4 sm:px-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-700 text-xs font-bold">
                🎨 เครื่องมือเขียน/วาดบนใบงาน
              </span>
              <h3 className="text-base sm:text-lg font-bold text-slate-800">
                ตรวจงาน: {studentName}
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">{assignmentTitle}</p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownload}
              className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-200/60 rounded-xl text-xs font-medium flex items-center gap-1 transition-colors"
              title="ดาวน์โหลดรูปภาพที่ตรวจแล้ว"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">โหลดรูป</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 rounded-xl transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Toolbar */}
        <div className="p-3 bg-white border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
          
          {/* Tool Modes */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
            <button
              onClick={() => setTool('pen')}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-lg font-bold transition-all ${
                tool === 'pen' ? 'bg-rose-500 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>ปากกา</span>
            </button>
            <button
              onClick={() => setTool('highlighter')}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-lg font-bold transition-all ${
                tool === 'highlighter' ? 'bg-amber-500 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Highlighter className="w-3.5 h-3.5" />
              <span>ไฮไลท์</span>
            </button>
            <button
              onClick={() => setTool('stamp')}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-lg font-bold transition-all ${
                tool === 'stamp' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Stamp className="w-3.5 h-3.5" />
              <span>สแตมป์</span>
            </button>
            <button
              onClick={() => setTool('eraser')}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-lg font-bold transition-all ${
                tool === 'eraser' ? 'bg-slate-700 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>ยางลบ</span>
            </button>
          </div>

          {/* Color Palette */}
          {tool !== 'eraser' && (
            <div className="flex items-center gap-1.5">
              {colors.map((c) => (
                <button
                  key={c}
                  onClick={() => setColor(c)}
                  className={`w-6 h-6 rounded-full border-2 transition-transform ${
                    color === c ? 'scale-125 border-slate-900 shadow-sm' : 'border-white hover:scale-110'
                  }`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          )}

          {/* Stamps Picker */}
          {tool === 'stamp' && (
            <div className="flex items-center gap-1 bg-amber-50 p-1 rounded-xl border border-amber-200">
              {stamps.map((st) => (
                <button
                  key={st}
                  onClick={() => setSelectedStamp(st)}
                  className={`px-2 py-1 rounded-lg text-sm transition-all ${
                    selectedStamp === st ? 'bg-amber-300 font-bold shadow-sm scale-110' : 'hover:bg-amber-100'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          )}

          {/* Brush thickness slider */}
          {tool !== 'stamp' && (
            <div className="flex items-center gap-2">
              <span className="text-slate-500 font-medium">ขนาด:</span>
              <input
                type="range"
                min="2"
                max="16"
                value={lineWidth}
                onChange={(e) => setLineWidth(Number(e.target.value))}
                className="w-20 accent-rose-500"
              />
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center gap-1 ml-auto">
            <button
              onClick={handleUndo}
              disabled={history.length <= 1}
              className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 disabled:opacity-40 rounded-lg"
              title="ย้อนกลับ (Undo)"
            >
              <Undo2 className="w-4 h-4" />
            </button>
            <button
              onClick={handleClear}
              className="px-2.5 py-1 text-rose-600 hover:bg-rose-50 rounded-lg font-medium"
            >
              ล้างทั้งหมด
            </button>
          </div>
        </div>

        {/* Canvas Area */}
        <div className="flex-1 bg-slate-200/80 p-4 overflow-auto flex items-center justify-center min-h-[360px]">
          <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-slate-300">
            <canvas
              ref={canvasRef}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              className="cursor-crosshair block max-w-full h-auto"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <span className="text-xs text-slate-500">
            💡 คลิกแล้วลากเพื่อเขียนตรวจ หรือคลิกเพื่อประทับตราสแตมป์ตรวจแล้ว
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-slate-600 hover:bg-slate-200/60 rounded-xl text-xs font-bold transition-colors"
            >
              ยกเลิก
            </button>
            <button
              onClick={handleSave}
              className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md shadow-emerald-600/20 active:scale-95 transition-all"
            >
              <Check className="w-4 h-4" />
              บันทึกการตรวจลงใบงาน
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
