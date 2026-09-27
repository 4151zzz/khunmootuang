import React, { useState } from 'react';
import { Classroom, Student } from '../../types';
import {
  X,
  Plus,
  Trash2,
  Edit2,
  Users,
  School,
  Check,
  FileSpreadsheet,
  AlertCircle,
  Sparkles,
  Shuffle
} from 'lucide-react';
import { sound } from '../../services/soundService';

interface ManageClassModalProps {
  isOpen: boolean;
  onClose: () => void;
  classrooms: Classroom[];
  students: Student[];
  selectedClass: string;
  onSelectClass: (className: string) => void;
  onSaveClassrooms: (classrooms: Classroom[]) => void;
  onSaveStudents: (students: Student[]) => void;
}

export const ManageClassModal: React.FC<ManageClassModalProps> = ({
  isOpen,
  onClose,
  classrooms,
  students,
  selectedClass,
  onSelectClass,
  onSaveClassrooms,
  onSaveStudents,
}) => {
  const [activeTab, setActiveTab] = useState<'classrooms' | 'students'>('students');
  const [currentFilterClass, setCurrentFilterClass] = useState<string>(selectedClass);

  // New Classroom Form state
  const [showAddClass, setShowAddClass] = useState(false);
  const [newClassName, setNewClassName] = useState('');
  const [newClassDesc, setNewClassDesc] = useState('');
  const [editingClassId, setEditingClassId] = useState<string | null>(null);
  const [editClassName, setEditClassName] = useState('');

  // Student Form state
  const [showAddStudent, setShowAddStudent] = useState(false);
  const [editingStudentId, setEditingStudentId] = useState<string | null>(null);

  const [stdNumber, setStdNumber] = useState<number>(students.length + 1);
  const [stdName, setStdName] = useState('');
  const [stdNickname, setStdNickname] = useState('');
  const [stdAvatar, setStdAvatar] = useState('👦');
  const [stdRow, setStdRow] = useState<number>(1);
  const [stdCol, setStdCol] = useState<number>(1);

  // Batch import state
  const [showBatchModal, setShowBatchModal] = useState(false);
  const [batchNamesText, setBatchNamesText] = useState('');

  if (!isOpen) return null;

  const currentClassStudents = students.filter((s) => s.classroom === currentFilterClass);

  // Classrooms Handlers
  const handleAddClassroom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClassName.trim()) return;

    sound.playCoin();
    const newClass: Classroom = {
      id: `cls-${Date.now()}`,
      name: newClassName.trim(),
      description: newClassDesc.trim() || undefined,
      gradeLevel: newClassName.includes('/') ? newClassName.split('/')[0] : 'ม.ปลาย',
      academicYear: '2569'
    };

    const updated = [...classrooms, newClass];
    onSaveClassrooms(updated);
    setNewClassName('');
    setNewClassDesc('');
    setShowAddClass(false);
    setCurrentFilterClass(newClass.name);
    onSelectClass(newClass.name);
  };

  const handleEditClassroom = (cls: Classroom) => {
    setEditingClassId(cls.id);
    setEditClassName(cls.name);
  };

  const handleSaveEditClassroom = (classId: string) => {
    if (!editClassName.trim()) return;
    sound.playCoin();

    const oldClass = classrooms.find((c) => c.id === classId);
    const oldName = oldClass?.name;

    const updated = classrooms.map((c) =>
      c.id === classId ? { ...c, name: editClassName.trim() } : c
    );
    onSaveClassrooms(updated);

    // Also update student classroom references
    if (oldName && oldName !== editClassName.trim()) {
      const updatedStudents = students.map((s) =>
        s.classroom === oldName ? { ...s, classroom: editClassName.trim() } : s
      );
      onSaveStudents(updatedStudents);
      if (selectedClass === oldName) onSelectClass(editClassName.trim());
      if (currentFilterClass === oldName) setCurrentFilterClass(editClassName.trim());
    }

    setEditingClassId(null);
  };

  const handleDeleteClassroom = (classId: string, className: string) => {
    if (classrooms.length <= 1) {
      alert('ต้องมีห้องเรียนอย่างน้อย 1 ห้อง');
      return;
    }

    const count = students.filter((s) => s.classroom === className).length;
    if (
      confirm(
        `คุณต้องการลบห้อง "${className}" หรือไม่? ${
          count > 0 ? `(มีนักเรียนในห้องนี้ ${count} คน)` : ''
        }`
      )
    ) {
      sound.playWarning();
      const updatedClasses = classrooms.filter((c) => c.id !== classId);
      onSaveClassrooms(updatedClasses);

      // Remove students of this class
      const updatedStudents = students.filter((s) => s.classroom !== className);
      onSaveStudents(updatedStudents);

      const nextClass = updatedClasses[0]?.name || 'ม.4/1';
      setCurrentFilterClass(nextClass);
      onSelectClass(nextClass);
    }
  };

  // Student Handlers
  const handleOpenAddStudent = () => {
    setEditingStudentId(null);
    setStdNumber(currentClassStudents.length + 1);
    setStdName('');
    setStdNickname('');
    setStdAvatar('👦');
    setStdRow(Math.floor(currentClassStudents.length / 4) + 1);
    setStdCol((currentClassStudents.length % 4) + 1);
    setShowAddStudent(true);
  };

  const handleOpenEditStudent = (s: Student) => {
    setEditingStudentId(s.id);
    setStdNumber(s.studentNumber);
    setStdName(s.name);
    setStdNickname(s.nickname);
    setStdAvatar(s.avatar);
    setStdRow(s.seatRow);
    setStdCol(s.seatCol);
    setShowAddStudent(true);
  };

  const handleSaveStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!stdName.trim()) return;

    sound.playCoin();

    if (editingStudentId) {
      // Edit
      const updated = students.map((s) =>
        s.id === editingStudentId
          ? {
              ...s,
              studentNumber: Number(stdNumber),
              name: stdName.trim(),
              nickname: stdNickname.trim() || 'เพื่อน',
              avatar: stdAvatar,
              seatRow: Number(stdRow),
              seatCol: Number(stdCol)
            }
          : s
      );
      onSaveStudents(updated);
    } else {
      // Create new
      const newStudent: Student = {
        id: `std-${Date.now()}`,
        studentNumber: Number(stdNumber),
        name: stdName.trim(),
        nickname: stdNickname.trim() || 'นักเรียน',
        avatar: stdAvatar,
        classroom: currentFilterClass,
        exp: 50,
        level: 1,
        streakDays: 1,
        unopenedEggs: 1,
        pets: [],
        seatRow: Number(stdRow),
        seatCol: Number(stdCol)
      };
      onSaveStudents([...students, newStudent]);
    }

    setShowAddStudent(false);
    setEditingStudentId(null);
  };

  const handleDeleteStudent = (studentId: string, studentName: string) => {
    if (confirm(`คุณต้องการลบนักเรียน "${studentName}" หรือไม่?`)) {
      sound.playWarning();
      const updated = students.filter((s) => s.id !== studentId);
      onSaveStudents(updated);
    }
  };

  // Batch Import Handlers
  const handleBatchImport = () => {
    const lines = batchNamesText
      .split('\n')
      .map((l) => l.trim())
      .filter(Boolean);

    if (lines.length === 0) return;

    sound.playCoin();
    let currentNumber = currentClassStudents.length + 1;
    const avatars = ['👦', '👧', '🧒', '🧑‍🎓', '👧‍🎓', '👦‍🎓'];

    const newStudents: Student[] = lines.map((line, idx) => {
      // Try to split nickname if written like: นายสมชาย ใจดี (ต้น)
      let name = line;
      let nickname = 'น้องใหม่';

      const match = line.match(/(.*?)\((.*?)\)/);
      if (match) {
        name = match[1].trim();
        nickname = match[2].trim();
      }

      const row = Math.floor((currentClassStudents.length + idx) / 4) + 1;
      const col = ((currentClassStudents.length + idx) % 4) + 1;

      return {
        id: `std-batch-${Date.now()}-${idx}`,
        studentNumber: currentNumber++,
        name,
        nickname,
        avatar: avatars[idx % avatars.length],
        classroom: currentFilterClass,
        exp: 50,
        level: 1,
        streakDays: 1,
        unopenedEggs: 1,
        pets: [],
        seatRow: row,
        seatCol: col
      };
    });

    onSaveStudents([...students, ...newStudents]);
    setBatchNamesText('');
    setShowBatchModal(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-900/75 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full flex flex-col max-h-[92vh] overflow-hidden border border-slate-200">
        
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-rose-50 via-slate-50 to-amber-50">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center shadow-md">
              <School className="w-6 h-6 text-amber-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold bg-rose-500 text-white px-2 py-0.5 rounded-full shadow-sm">
                  Classroom & Student Manager
                </span>
              </div>
              <h3 className="text-lg font-black text-slate-900 mt-0.5">
                จัดการห้องเรียน และรายชื่อนักเรียน 🏫
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
        <div className="px-6 pt-3 bg-slate-50 border-b border-slate-200 flex items-center gap-3 text-xs font-bold">
          <button
            onClick={() => setActiveTab('students')}
            className={`pb-3 border-b-2 flex items-center gap-1.5 transition-all ${
              activeTab === 'students'
                ? 'border-rose-500 text-rose-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>รายชื่อนักเรียน ({students.length} คน)</span>
          </button>

          <button
            onClick={() => setActiveTab('classrooms')}
            className={`pb-3 border-b-2 flex items-center gap-1.5 transition-all ${
              activeTab === 'classrooms'
                ? 'border-rose-500 text-rose-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <School className="w-4 h-4" />
            <span>ห้องเรียนทั้งหมด ({classrooms.length} ห้อง)</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto flex-1 text-xs">
          
          {/* TAB 1: STUDENTS MANAGEMENT */}
          {activeTab === 'students' && (
            <div className="space-y-4">
              
              {/* Top Controls: Filter by Class + Action buttons */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
                <div className="flex items-center gap-2">
                  <label className="font-bold text-slate-700">เลือกดูห้องเรียน:</label>
                  <select
                    value={currentFilterClass}
                    onChange={(e) => {
                      setCurrentFilterClass(e.target.value);
                      onSelectClass(e.target.value);
                    }}
                    className="font-bold bg-white border border-slate-300 rounded-xl px-3 py-1.5 outline-none text-slate-800"
                  >
                    {classrooms.map((c) => (
                      <option key={c.id} value={c.name}>
                        ห้อง {c.name}
                      </option>
                    ))}
                  </select>
                  <span className="text-slate-400">({currentClassStudents.length} คน)</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowBatchModal(true)}
                    className="px-3 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold rounded-xl border border-indigo-200 flex items-center gap-1.5 transition-colors"
                  >
                    <FileSpreadsheet className="w-3.5 h-3.5" />
                    ⚡ นำเข้ารายชื่อด่วน (วางข้อความ)
                  </button>

                  <button
                    onClick={handleOpenAddStudent}
                    className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl flex items-center gap-1.5 shadow-sm active:scale-95 transition-all"
                  >
                    <Plus className="w-3.5 h-3.5 text-amber-400" />
                    เพิ่มนักเรียน
                  </button>
                </div>
              </div>

              {/* Students Table */}
              <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                <div className="grid grid-cols-12 gap-2 p-3 bg-slate-100 font-bold text-slate-600 text-[11px]">
                  <div className="col-span-1 text-center">เลขที่</div>
                  <div className="col-span-1 text-center">รูป</div>
                  <div className="col-span-4">ชื่อ - นามสกุล</div>
                  <div className="col-span-2">ชื่อเล่น</div>
                  <div className="col-span-2 text-center">โต๊ะ (แถว/คอลัมน์)</div>
                  <div className="col-span-2 text-right">จัดการ</div>
                </div>

                <div className="divide-y divide-slate-100">
                  {currentClassStudents.length > 0 ? (
                    currentClassStudents.map((std) => (
                      <div
                        key={std.id}
                        className="grid grid-cols-12 gap-2 p-3 items-center hover:bg-slate-50 transition-colors"
                      >
                        <div className="col-span-1 text-center font-bold text-slate-700">
                          {std.studentNumber}
                        </div>
                        <div className="col-span-1 text-center text-lg">{std.avatar}</div>
                        <div className="col-span-4 font-bold text-slate-800 truncate">
                          {std.name}
                        </div>
                        <div className="col-span-2 text-slate-600">{std.nickname}</div>
                        <div className="col-span-2 text-center text-slate-500 font-mono">
                          แถว {std.seatRow}, คอลัมน์ {std.seatCol}
                        </div>
                        <div className="col-span-2 flex items-center justify-end gap-1">
                          <button
                            onClick={() => handleOpenEditStudent(std)}
                            className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                            title="แก้ไขข้อมูล"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteStudent(std.id, std.name)}
                            className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors"
                            title="ลบนักเรียน"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-8 text-center text-slate-400">
                      ยังไม่มีนักเรียนในห้อง {currentFilterClass}
                    </div>
                  )}
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: CLASSROOMS MANAGEMENT */}
          {activeTab === 'classrooms' && (
            <div className="space-y-4">
              
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-slate-800 text-sm">รายการห้องเรียน</h4>
                  <p className="text-slate-500 text-[11px]">
                    เพิ่ม ลบ หรือแก้ไขชื่อห้องเรียนในระบบ
                  </p>
                </div>

                <button
                  onClick={() => setShowAddClass(true)}
                  className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl flex items-center gap-1.5 shadow-sm active:scale-95 transition-all"
                >
                  <Plus className="w-3.5 h-3.5 text-amber-400" />
                  เพิ่มห้องเรียนใหม่
                </button>
              </div>

              {/* Add Classroom Form */}
              {showAddClass && (
                <form
                  onSubmit={handleAddClassroom}
                  className="bg-amber-50/60 p-4 rounded-2xl border border-amber-200 space-y-3 animate-fadeIn"
                >
                  <div className="font-bold text-slate-800 text-xs flex items-center gap-1">
                    <Plus className="w-4 h-4 text-amber-600" />
                    เพิ่มห้องเรียนใหม่
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">ชื่อห้องเรียน:</label>
                      <input
                        type="text"
                        required
                        placeholder="เช่น ม.4/3 หรือ คอมพิวเตอร์ ม.5"
                        value={newClassName}
                        onChange={(e) => setNewClassName(e.target.value)}
                        className="w-full p-2 bg-white border border-slate-300 rounded-xl outline-none"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">คำอธิบายเพิ่มเติม:</label>
                      <input
                        type="text"
                        placeholder="เช่น สายวิทย์-เทคโนโลยี"
                        value={newClassDesc}
                        onChange={(e) => setNewClassDesc(e.target.value)}
                        className="w-full p-2 bg-white border border-slate-300 rounded-xl outline-none"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setShowAddClass(false)}
                      className="px-3 py-1.5 text-slate-600 hover:bg-slate-100 rounded-lg font-bold"
                    >
                      ยกเลิก
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold"
                    >
                      บันทึกห้องใหม่
                    </button>
                  </div>
                </form>
              )}

              {/* Classrooms List */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {classrooms.map((cls) => {
                  const studentCount = students.filter((s) => s.classroom === cls.name).length;
                  const isEditing = editingClassId === cls.id;

                  return (
                    <div
                      key={cls.id}
                      className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between"
                    >
                      <div>
                        {isEditing ? (
                          <div className="flex items-center gap-2">
                            <input
                              type="text"
                              value={editClassName}
                              onChange={(e) => setEditClassName(e.target.value)}
                              className="p-1 border border-rose-300 rounded-lg font-bold text-sm outline-none"
                            />
                            <button
                              onClick={() => handleSaveEditClassroom(cls.id)}
                              className="p-1 bg-emerald-600 text-white rounded-lg"
                            >
                              <Check className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ) : (
                          <>
                            <div className="font-bold text-sm text-slate-800 flex items-center gap-1.5">
                              <span>ห้อง {cls.name}</span>
                              <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">
                                {studentCount} คน
                              </span>
                            </div>
                            {cls.description && (
                              <p className="text-[11px] text-slate-500 mt-0.5">
                                {cls.description}
                              </p>
                            )}
                          </>
                        )}
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleEditClassroom(cls)}
                          className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg"
                          title="แก้ไขชื่อห้อง"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteClassroom(cls.id, cls.name)}
                          className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg"
                          title="ลบห้อง"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

            </div>
          )}

        </div>

        {/* Modal Sub-form: Add/Edit Student */}
        {showAddStudent && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fadeIn">
            <div className="bg-white rounded-3xl p-6 shadow-2xl max-w-md w-full border border-slate-200">
              <h4 className="font-black text-slate-900 text-base mb-1">
                {editingStudentId ? '✏️ แก้ไขข้อมูลนักเรียน' : '➕ เพิ่มนักเรียนคนใหม่'}
              </h4>
              <p className="text-xs text-slate-500 mb-4">
                ห้องเรียน: <strong className="text-rose-600">{currentFilterClass}</strong>
              </p>

              <form onSubmit={handleSaveStudent} className="space-y-3 text-xs">
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">เลขที่:</label>
                    <input
                      type="number"
                      required
                      value={stdNumber}
                      onChange={(e) => setStdNumber(Number(e.target.value))}
                      className="w-full p-2 bg-slate-50 border border-slate-300 rounded-xl font-bold"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="font-bold text-slate-700 block mb-1">ชื่อเล่น:</label>
                    <input
                      type="text"
                      placeholder="เช่น ต้นกล้า"
                      value={stdNickname}
                      onChange={(e) => setStdNickname(e.target.value)}
                      className="w-full p-2 bg-slate-50 border border-slate-300 rounded-xl"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">ชื่อ - นามสกุล:</label>
                  <input
                    type="text"
                    required
                    placeholder="เช่น ด.ช. ภัทรพล สุขสวัสดิ์"
                    value={stdName}
                    onChange={(e) => setStdName(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-xl font-medium"
                  />
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">อวาตาร์:</label>
                    <select
                      value={stdAvatar}
                      onChange={(e) => setStdAvatar(e.target.value)}
                      className="w-full p-2 bg-slate-50 border border-slate-300 rounded-xl text-lg text-center"
                    >
                      <option value="👦">👦 ชาย</option>
                      <option value="👧">👧 หญิง</option>
                      <option value="🧒">🧒 เด็ก</option>
                      <option value="🧑‍🎓">🧑‍🎓 นร.1</option>
                      <option value="👧‍🎓">👧‍🎓 นร.2</option>
                      <option value="🌟">🌟 ดาว</option>
                    </select>
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">โต๊ะแถวที่:</label>
                    <input
                      type="number"
                      min="1"
                      max="6"
                      value={stdRow}
                      onChange={(e) => setStdRow(Number(e.target.value))}
                      className="w-full p-2 bg-slate-50 border border-slate-300 rounded-xl font-mono text-center"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">คอลัมน์ที่:</label>
                    <input
                      type="number"
                      min="1"
                      max="6"
                      value={stdCol}
                      onChange={(e) => setStdCol(Number(e.target.value))}
                      className="w-full p-2 bg-slate-50 border border-slate-300 rounded-xl font-mono text-center"
                    />
                  </div>
                </div>

                <div className="pt-3 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowAddStudent(false)}
                    className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl font-bold"
                  >
                    ยกเลิก
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold"
                  >
                    บันทึกข้อมูล
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal Sub-form: Quick Batch Import */}
        {showBatchModal && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fadeIn">
            <div className="bg-white rounded-3xl p-6 shadow-2xl max-w-lg w-full border border-slate-200">
              <h4 className="font-black text-slate-900 text-base mb-1">
                ⚡ นำเข้ารายชื่อนักเรียนแบบรวดเร็ว (Batch Add)
              </h4>
              <p className="text-xs text-slate-500 mb-3">
                วางรายชื่อนักเรียนบรรทัดละ 1 คน (สามารถใส่วงเล็บชื่อเล่นด้านหลังได้ เช่น{' '}
                <code className="text-rose-600 bg-rose-50 px-1 rounded">นายสมชาย รักเรียน (บอล)</code>
                )
              </p>

              <textarea
                rows={8}
                placeholder="ด.ช. เกรียงศักดิ์ วงศ์สวัสดิ์ (เกรียง)&#10;ด.ญ. รุ่งนภา สดใส (ฟ้า)&#10;ด.ช. ธนพล มั่นคง (นัท)"
                value={batchNamesText}
                onChange={(e) => setBatchNamesText(e.target.value)}
                className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl font-mono text-xs outline-none focus:ring-2 focus:ring-indigo-400"
              />

              <div className="pt-3 flex items-center justify-between">
                <span className="text-[11px] text-slate-400">
                  {batchNamesText.split('\n').filter((l) => l.trim()).length} รายชื่อที่ตรวจพบ
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowBatchModal(false)}
                    className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl font-bold"
                  >
                    ยกเลิก
                  </button>
                  <button
                    onClick={handleBatchImport}
                    className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold flex items-center gap-1 shadow-md"
                  >
                    <Check className="w-4 h-4" />
                    เพิ่มทุกคนเข้าห้อง {currentFilterClass}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <span className="text-[11px] text-slate-500">
            💡 ข้อมูลจะถูกบันทึกและซิงค์กับระบบเช็คชื่อ ผังห้อง และการบ้านโดยอัตโนมัติ
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-900 text-white rounded-xl font-bold"
          >
            เสร็จสิ้น
          </button>
        </div>

      </div>
    </div>
  );
};
