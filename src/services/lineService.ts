import { Assignment, Student } from '../types';

export interface LinePushMessagePayload {
  to: string | string[];
  type: 'flex' | 'text';
  altText: string;
  contents?: Record<string, unknown>;
  text?: string;
  sentAt: string;
  status: 'delivered' | 'pending';
}

export const lineService = {
  // Generate authentic LINE Flex Message bubble for Homework Reminder (ทวงงาน)
  createAssignmentFlexBubble(assignment: Assignment, targetStudentName?: string, mascot: 'pig' | 'chicken' = 'pig') {
    const mascotEmoji = mascot === 'chicken' ? '🐔' : '🐷';
    const mascotName = mascot === 'chicken' ? 'คุณไก่ทวง V.2' : 'คุณหมูทวง V.2';
    const headerColor = mascot === 'chicken' ? '#ea580c' : '#e11d48';

    return {
      type: 'bubble',
      size: 'mega',
      header: {
        type: 'box',
        layout: 'vertical',
        backgroundColor: headerColor,
        paddingAll: '16px',
        contents: [
          {
            type: 'text',
            text: `${mascotEmoji} ${mascotName} แจ้งเตือนการบ้าน!`,
            color: '#ffffff',
            weight: 'bold',
            size: 'md'
          },
          {
            type: 'text',
            text: targetStudentName ? `ส่งถึง: ${targetStudentName}` : `ห้อง ${assignment.classroom}`,
            color: '#fecdd3',
            size: 'xs',
            margin: 'xs'
          }
        ]
      },
      body: {
        type: 'box',
        layout: 'vertical',
        paddingAll: '18px',
        contents: [
          {
            type: 'text',
            text: assignment.title,
            weight: 'bold',
            size: 'lg',
            wrap: true,
            color: '#1e293b'
          },
          {
            type: 'box',
            layout: 'horizontal',
            margin: 'md',
            contents: [
              {
                type: 'text',
                text: 'วิชา:',
                size: 'sm',
                color: '#64748b',
                flex: 2
              },
              {
                type: 'text',
                text: assignment.subject,
                size: 'sm',
                color: '#0f172a',
                weight: 'bold',
                flex: 5
              }
            ]
          },
          {
            type: 'box',
            layout: 'horizontal',
            margin: 'sm',
            contents: [
              {
                type: 'text',
                text: 'กำหนดส่ง:',
                size: 'sm',
                color: '#e11d48',
                weight: 'bold',
                flex: 2
              },
              {
                type: 'text',
                text: `${assignment.dueDate} น.`,
                size: 'sm',
                color: '#e11d48',
                weight: 'bold',
                flex: 5
              }
            ]
          },
          {
            type: 'box',
            layout: 'horizontal',
            margin: 'sm',
            contents: [
              {
                type: 'text',
                text: 'คะแนนเต็ม:',
                size: 'sm',
                color: '#64748b',
                flex: 2
              },
              {
                type: 'text',
                text: `${assignment.maxScore} คะแนน (+15 EXP + 🥚 สุ่มไข่)`,
                size: 'sm',
                color: '#059669',
                weight: 'bold',
                flex: 5
              }
            ]
          },
          {
            type: 'separator',
            margin: 'lg'
          },
          {
            type: 'text',
            text: `คำแนะนำ: ${assignment.description}`,
            size: 'xs',
            color: '#475569',
            wrap: true,
            margin: 'md'
          }
        ]
      },
      footer: {
        type: 'box',
        layout: 'vertical',
        spacing: 'sm',
        paddingAll: '16px',
        contents: [
          {
            type: 'button',
            style: 'primary',
            color: '#06C755',
            action: {
              type: 'uri',
              label: '🚀 ส่งงานทันที (LIFF)',
              uri: `https://liff.line.me/2001234567-AbCdEfGh?assignmentId=${assignment.id}`
            }
          },
          {
            type: 'button',
            style: 'secondary',
            action: {
              type: 'uri',
              label: '📖 ดูรายละเอียดงาน',
              uri: `https://liff.line.me/2001234567-AbCdEfGh?view=detail&id=${assignment.id}`
            }
          }
        ]
      }
    };
  },

  // Generate Grade Result Flex Bubble
  createGradeResultFlexBubble(studentName: string, assignmentTitle: string, score: number, maxScore: number, comment?: string, mascot: 'pig' | 'chicken' = 'pig') {
    const mascotEmoji = mascot === 'chicken' ? '🐔' : '🐷';
    return {
      type: 'bubble',
      size: 'mega',
      header: {
        type: 'box',
        layout: 'vertical',
        backgroundColor: '#059669',
        paddingAll: '16px',
        contents: [
          {
            type: 'text',
            text: `${mascotEmoji} แจ้งผลตรวจการบ้านเรียบร้อย!`,
            color: '#ffffff',
            weight: 'bold',
            size: 'md'
          },
          {
            type: 'text',
            text: `ผู้รับ: ${studentName}`,
            color: '#d1fae5',
            size: 'xs',
            margin: 'xs'
          }
        ]
      },
      body: {
        type: 'box',
        layout: 'vertical',
        paddingAll: '18px',
        contents: [
          {
            type: 'text',
            text: assignmentTitle,
            weight: 'bold',
            size: 'md',
            wrap: true
          },
          {
            type: 'box',
            layout: 'vertical',
            margin: 'lg',
            alignItems: 'center',
            contents: [
              {
                type: 'text',
                text: `${score} / ${maxScore}`,
                size: 'xxl',
                weight: 'bold',
                color: '#059669'
              },
              {
                type: 'text',
                text: '🎉 ได้รับ +20 EXP & ไข่สุ่มสัตว์เลี้ยง 1 ฟอง!',
                size: 'xs',
                color: '#d97706',
                margin: 'sm'
              }
            ]
          },
          ...(comment ? [
            {
              type: 'separator',
              margin: 'lg'
            },
            {
              type: 'text',
              text: `ข้อความจากครู: "${comment}"`,
              size: 'xs',
              color: '#334155',
              style: 'italic',
              margin: 'md',
              wrap: true
            }
          ] : [])
        ]
      }
    };
  },

  // Simulate pushing a message to LINE
  async sendPushNotification(
    targetStudents: Student[],
    payload: Record<string, unknown>,
    _channelAccessToken?: string
  ): Promise<{ success: boolean; deliveredCount: number; timestamp: string }> {
    await new Promise(r => setTimeout(r, 600)); // Network delay
    return {
      success: true,
      deliveredCount: targetStudents.length,
      timestamp: new Date().toLocaleTimeString('th-TH')
    };
  }
};
