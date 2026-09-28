import Swal from 'sweetalert2';

export const alertService = {
  // Confirm Delete Dialog Card
  async confirmDelete(options: {
    title?: string;
    text?: string;
    confirmText?: string;
    cancelText?: string;
  }): Promise<boolean> {
    const result = await Swal.fire({
      title: options.title || 'ยืนยันการลบ?',
      text: options.text || 'ข้อมูลที่ถูกลบจะไม่สามารถกู้คืนได้',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#e11d48', // rose-600
      cancelButtonColor: '#94a3b8',  // slate-400
      confirmButtonText: options.confirmText || 'ใช่, ลบเลย!',
      cancelButtonText: options.cancelText || 'ยกเลิก',
      reverseButtons: true,
      customClass: {
        popup: 'rounded-3xl shadow-2xl border border-slate-200 text-slate-800 font-sans',
        title: 'text-lg font-bold text-slate-900',
        confirmButton: 'rounded-xl font-bold px-5 py-2.5 shadow-md',
        cancelButton: 'rounded-xl font-bold px-5 py-2.5'
      }
    });

    return result.isConfirmed;
  },

  // Success Notification
  showSuccess(title: string, text?: string) {
    return Swal.fire({
      icon: 'success',
      title,
      text,
      timer: 1800,
      showConfirmButton: false,
      timerProgressBar: true,
      customClass: {
        popup: 'rounded-3xl shadow-2xl border border-emerald-100 font-sans',
        title: 'text-base font-bold text-slate-900'
      }
    });
  },

  // Warning Notification
  showWarning(title: string, text?: string) {
    return Swal.fire({
      icon: 'warning',
      title,
      text,
      confirmButtonColor: '#f59e0b',
      confirmButtonText: 'เข้าใจแล้ว',
      customClass: {
        popup: 'rounded-3xl shadow-2xl border border-amber-100 font-sans',
        title: 'text-base font-bold text-slate-900'
      }
    });
  },

  // Error Notification
  showError(title: string, text?: string) {
    return Swal.fire({
      icon: 'error',
      title,
      text,
      confirmButtonColor: '#e11d48',
      confirmButtonText: 'ตกลง',
      customClass: {
        popup: 'rounded-3xl shadow-2xl border border-rose-100 font-sans',
        title: 'text-base font-bold text-slate-900'
      }
    });
  },

  // Quick Prompt to Add Classroom (Card Dialog)
  async promptAddClassroom(): Promise<{ name: string; description?: string } | null> {
    const { value: formValues } = await Swal.fire({
      title: '🏫 เพิ่มห้องเรียนใหม่',
      html: `
        <div style="text-align: left; padding: 4px; display: flex; flex-direction: column; gap: 12px;">
          <div>
            <label style="display: block; font-size: 13px; font-weight: 700; color: #334155; margin-bottom: 6px;">
              ชื่อห้องเรียน <span style="color: #e11d48;">*</span>
            </label>
            <input id="swal-class-name" class="swal2-input" style="margin: 0; width: 100%; font-size: 14px; border-radius: 12px; border: 1px solid #cbd5e1; box-sizing: border-box;" placeholder="เช่น ม.4/2 หรือ ม.5/1">
          </div>
          <div>
            <label style="display: block; font-size: 13px; font-weight: 700; color: #334155; margin-bottom: 6px;">
              คำอธิบายเพิ่มเติม (ถ้ามี)
            </label>
            <input id="swal-class-desc" class="swal2-input" style="margin: 0; width: 100%; font-size: 14px; border-radius: 12px; border: 1px solid #cbd5e1; box-sizing: border-box;" placeholder="เช่น แผนการเรียนวิทย์-คอม">
          </div>
        </div>
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: '✨ บันทึกห้องเรียน',
      cancelButtonText: 'ยกเลิก',
      confirmButtonColor: '#059669',
      cancelButtonColor: '#94a3b8',
      customClass: {
        popup: 'rounded-3xl shadow-2xl border border-slate-200 font-sans',
        title: 'text-lg font-bold text-slate-900',
        confirmButton: 'rounded-xl font-bold px-5 py-2.5 shadow-md',
        cancelButton: 'rounded-xl font-bold px-5 py-2.5'
      },
      preConfirm: () => {
        const nameInput = document.getElementById('swal-class-name') as HTMLInputElement;
        const descInput = document.getElementById('swal-class-desc') as HTMLInputElement;
        const name = nameInput?.value?.trim();
        const description = descInput?.value?.trim() || undefined;

        if (!name) {
          Swal.showValidationMessage('กรุณากรอกชื่อห้องเรียน');
          return false;
        }
        return { name, description };
      }
    });

    return formValues || null;
  }
};
