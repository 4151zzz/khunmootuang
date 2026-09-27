import React from 'react';
import { Student, AttendanceRecord, AttendanceStatus } from '../../types';
import { Check, Clock, AlertTriangle, XCircle, FileSpreadsheet, CheckCheck, QrCode } from 'lucide-react';
import { sound } from '../../services/soundService';

interface AttendanceTabProps {
  students: Student[];
  attendance: AttendanceRecord;
  onUpdateAttendance: (attendance: AttendanceRecord) => void;
}

export const AttendanceTab: React.FC<AttendanceTabProps> = ({
  students,
  attendance,
  onUpdateAttendance,
}) => {
  const getStudentStatus = (studentId: string): AttendanceStatus => {
    const record = attendance.records.find((r) => r.studentId === studentId);
    return record?.status || 'present';
  };

  const setStudentStatus = (studentId: string, status: AttendanceStatus) => {
    sound.playTap();
    const existingIndex = attendance.records.findIndex((r) => r.studentId === studentId);
    const newRecords = [...attendance.records];

    const updatedRecord = {
      studentId,
      status,
      checkInTime: status === 'present' || status === 'late' ? new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }) : undefined
    };

    if (existingIndex >= 0) {
      newRecords[existingIndex] = updatedRecord;
    } else {
      newRecords.push(updatedRecord);
    }

    onUpdateAttendance({
      ...attendance,
      records: newRecords
    });
  };

  const handleAllPresent = () => {
    sound.playCoin();
    const newRecords = students.map((s) => ({
      studentId: s.id,
      status: 'present' as AttendanceStatus,
      checkInTime: '08:15'
    }));

    onUpdateAttendance({
      ...attendance,
      records: newRecords
    });
  };

  const counts = {
    present: attendance.records.filter((r) => r.status === 'present').length,
    late: attendance.records.filter((r) => r.status === 'late').length,
    leave: attendance.records.filter((r) => r.status === 'leave').length,
    absent: attendance.records.filter((r) => r.status === 'absent').length,
  };

  const exportAttendanceCSV = () => {
    sound.playCoin();
    const headers = ['เลขที่', 'ชื่อ-นามสกุล', 'ชื่อเล่น', 'สถานะการเข้าเรียน', 'เวลาเช็คชื่อ', 'วันที่'];
    const rows = students.map((std) => {
      const rec = attendance.records.find((r) => r.studentId === std.id);
      const statusMap = {
        present: 'มาเรียน',
        late: 'มาสาย',
        leave: 'ลา',
        absent: 'ขาดเรียน'
      };
      return [
        std.studentNumber,
        std.name,
        std.nickname,
        statusMap[rec?.status || 'present'],
        rec?.checkInTime || '-',
        attendance.date
      ];
    });

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `เช็คชื่อ_${attendance.classroom}_${attendance.date}.csv`;
    link.click();
  };

  return (
    <div className="space-y-6">
      
      {/* Header card with statistics and controls */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200/80 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold bg-teal-100 text-teal-800 px-2.5 py-0.5 rounded-full">
              ระบบเช็คชื่อห้อง {attendance.classroom}
            </span>
            <span className="text-xs text-slate-500 font-medium">
              วันที่: {attendance.date}
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-800 m-0">
            บันทึกการเข้าเรียน & สรุปสถิติประจำวัน 📋
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            เช็คสะดวกรวดเร็ว รองรับสแกน QR Code หน้าห้อง หรือกดเลือกสถานะ
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={handleAllPresent}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl text-xs font-bold shadow-sm transition-all active:scale-95"
          >
            <CheckCheck className="w-4 h-4" />
            มาครบทุกคน
          </button>

          <button
            onClick={exportAttendanceCSV}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl text-xs font-bold border border-slate-200 transition-colors"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
            Export CSV
          </button>
        </div>
      </div>

      {/* Metrics Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white p-4 rounded-2xl border border-emerald-200/80 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-500">มาเรียน</span>
            <div className="text-2xl font-black text-emerald-600 mt-0.5">{counts.present} คน</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
            <Check className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-amber-200/80 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-500">มาสาย</span>
            <div className="text-2xl font-black text-amber-600 mt-0.5">{counts.late} คน</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-blue-200/80 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-500">ลา</span>
            <div className="text-2xl font-black text-blue-600 mt-0.5">{counts.leave} คน</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
            <AlertTriangle className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-rose-200/80 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-500">ขาดเรียน</span>
            <div className="text-2xl font-black text-rose-600 mt-0.5">{counts.absent} คน</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center">
            <XCircle className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Attendance Grid */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-200/80 overflow-hidden">
        <div className="p-4 bg-slate-50/70 border-b border-slate-200 flex items-center justify-between text-xs font-bold text-slate-500">
          <span>รายชื่อนักเรียน ({students.length} คน)</span>
          <span>สถานะการเข้าเรียน</span>
        </div>

        <div className="divide-y divide-slate-100">
          {students.map((student) => {
            const currentStatus = getStudentStatus(student.id);
            const record = attendance.records.find((r) => r.studentId === student.id);

            return (
              <div
                key={student.id}
                className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/60 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-xl shrink-0">
                    {student.avatar}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-600">เลขที่ {student.studentNumber}</span>
                      <span className="text-sm font-bold text-slate-800">{student.name}</span>
                      <span className="text-xs text-slate-400">({student.nickname})</span>
                    </div>
                    {record?.checkInTime && (
                      <span className="text-[11px] text-emerald-600 font-medium">
                        เช็คชื่อเมื่อ: {record.checkInTime} น.
                      </span>
                    )}
                  </div>
                </div>

                {/* Status Toggle Buttons */}
                <div className="flex items-center gap-1.5 self-end sm:self-center">
                  <button
                    onClick={() => setStudentStatus(student.id, 'present')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 ${
                      currentStatus === 'present'
                        ? 'bg-emerald-600 text-white shadow-sm'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    <Check className="w-3.5 h-3.5" />
                    มา
                  </button>

                  <button
                    onClick={() => setStudentStatus(student.id, 'late')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 ${
                      currentStatus === 'late'
                        ? 'bg-amber-500 text-white shadow-sm'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    <Clock className="w-3.5 h-3.5" />
                    สาย
                  </button>

                  <button
                    onClick={() => setStudentStatus(student.id, 'leave')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 ${
                      currentStatus === 'leave'
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    <AlertTriangle className="w-3.5 h-3.5" />
                    ลา
                  </button>

                  <button
                    onClick={() => setStudentStatus(student.id, 'absent')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 ${
                      currentStatus === 'absent'
                        ? 'bg-rose-600 text-white shadow-sm'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    <XCircle className="w-3.5 h-3.5" />
                    ขาด
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
