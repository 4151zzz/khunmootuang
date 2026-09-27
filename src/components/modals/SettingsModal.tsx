import React, { useState } from 'react';
import { X, Save, Key, RotateCcw, ShieldCheck, Check } from 'lucide-react';
import { LineSettings } from '../../types';
import { storageService } from '../../services/storageService';
import { sound } from '../../services/soundService';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: LineSettings;
  onSaveSettings: (settings: LineSettings) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onSaveSettings,
}) => {
  const [form, setForm] = useState<LineSettings>({ ...settings });
  const [savedNotice, setSavedNotice] = useState(false);

  if (!isOpen) return null;

  const handleSave = () => {
    sound.playCoin();
    onSaveSettings(form);
    setSavedNotice(true);
    setTimeout(() => {
      setSavedNotice(false);
      onClose();
    }, 900);
  };

  const handleReset = () => {
    if (confirm('คุณต้องการรีเซ็ตข้อมูลตัวอย่างทั้งหมดกลับเป็นค่าเริ่มต้นหรือไม่?')) {
      storageService.resetAll();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-900/70 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl shadow-2xl max-w-xl w-full flex flex-col max-h-[90vh] overflow-hidden border border-slate-200">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-slate-800 text-white flex items-center justify-center">
              <Key className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-800">ตั้งค่าการเชื่อมต่อ API & LINE OA</h3>
              <p className="text-xs text-slate-500">จัดการคีย์ความปลอดภัยและ LIFF Endpoint</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6 overflow-y-auto space-y-4 text-xs">
          
          {/* Gemini API Key */}
          <div className="bg-gradient-to-r from-rose-50 to-pink-50 p-4 rounded-2xl border border-rose-200/80">
            <div className="flex items-center justify-between mb-1.5">
              <label className="font-bold text-rose-950 flex items-center gap-1.5">
                <span className="text-base">✨</span> Google Gemini API Key:
              </label>
              <span className="text-[10px] text-rose-600 font-semibold bg-rose-100 px-2 py-0.5 rounded-full">
                {form.geminiApiKey ? 'เปิดใช้งาน Live AI แล้ว' : 'ใช้ระบบ Smart Heuristics'}
              </span>
            </div>
            <input
              type="password"
              placeholder="AIzaSy..."
              value={form.geminiApiKey}
              onChange={(e) => setForm({ ...form, geminiApiKey: e.target.value })}
              className="w-full p-2.5 bg-white border border-rose-300 rounded-xl outline-none focus:ring-2 focus:ring-rose-400 text-slate-800 font-mono"
            />
            <p className="text-[11px] text-slate-500 mt-1.5">
              หากเว้นว่างไว้ ระบบจะใช้เอนจินจำลองการตรวจ AI ภาษาไทยคุณภาพสูงให้อัตโนมัติทันที
            </p>
          </div>

          {/* LINE Settings */}
          <div className="space-y-3">
            <div>
              <label className="font-bold text-slate-700 block mb-1">
                LINE LIFF ID:
              </label>
              <input
                type="text"
                placeholder="2001234567-AbCdEfGh"
                value={form.liffId}
                onChange={(e) => setForm({ ...form, liffId: e.target.value })}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
              />
              <span className="text-[10px] text-slate-400">ใช้สำหรับเปิดหน้านักเรียนบนแอปพลิเคชัน LINE</span>
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">
                LINE Channel Access Token (Long-lived):
              </label>
              <input
                type="password"
                placeholder="mock_channel_access_token..."
                value={form.channelAccessToken}
                onChange={(e) => setForm({ ...form, channelAccessToken: e.target.value })}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">
                LINE Webhook Endpoint URL:
              </label>
              <input
                type="text"
                value={form.webhookUrl}
                onChange={(e) => setForm({ ...form, webhookUrl: e.target.value })}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
              />
            </div>
          </div>

          {/* Reset Demo */}
          <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
            <span className="text-slate-500">ต้องการล้างข้อมูลและเริ่มต้นใหม่?</span>
            <button
              onClick={handleReset}
              className="text-rose-600 hover:text-rose-700 font-bold flex items-center gap-1 hover:underline"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              รีเซ็ตข้อมูลจำลองทั้งหมด
            </button>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-1 text-slate-500 text-[11px]">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>บันทึกความปลอดภัยลงเครื่อง Local Storage</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-slate-600 hover:bg-slate-200 rounded-xl font-bold transition-colors"
            >
              ปิด
            </button>
            <button
              onClick={handleSave}
              className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold flex items-center gap-1.5 shadow-md active:scale-95 transition-all"
            >
              {savedNotice ? <Check className="w-4 h-4 text-emerald-400" /> : <Save className="w-4 h-4" />}
              {savedNotice ? 'บันทึกเรียบร้อย!' : 'บันทึกการตั้งค่า'}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
