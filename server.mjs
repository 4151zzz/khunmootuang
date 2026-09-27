import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

// Load LINE credentials from environment or fallback
const LINE_CHANNEL_ACCESS_TOKEN = process.env.LINE_CHANNEL_ACCESS_TOKEN || 'YOUR_CHANNEL_ACCESS_TOKEN';
const LINE_CHANNEL_SECRET = process.env.LINE_CHANNEL_SECRET || 'YOUR_CHANNEL_SECRET';

// 1. Webhook Endpoint for LINE Messaging API
app.post('/webhook', (req, res) => {
  const events = req.body.events || [];
  
  for (const event of events) {
    console.log('Received LINE Event:', event.type, event);

    // Follow event (เมื่อนักเรียนกดเพิ่มเพื่อน LINE OA)
    if (event.type === 'follow') {
      const studentLineId = event.source.userId;
      console.log('นักเรียนคนใหม่แอดไลน์! Line User ID:', studentLineId);
      // ตอบกลับต้อนรับอัตโนมัติ
      replyWelcomeMessage(event.replyToken, studentLineId);
    }

    // Message event (เมื่อนักเรียนพิมพ์คุยในแชท)
    if (event.type === 'message' && event.message.type === 'text') {
      const text = event.message.text.trim();
      handleUserText(event.replyToken, event.source.userId, text);
    }
  }

  res.status(200).send('OK');
});

// 2. API ยิง Push Message ทวงการบ้านหานักเรียนรายคน
app.post('/api/remind-student', async (req, res) => {
  const { lineUserId, assignmentTitle, dueDate, maxScore, liffUrl } = req.body;

  if (!lineUserId) {
    return res.status(400).json({ error: 'lineUserId is required' });
  }

  const flexMessagePayload = {
    to: lineUserId,
    messages: [
      {
        type: 'flex',
        altText: `🐷 คุณหมูทวงการบ้าน: ${assignmentTitle}`,
        contents: {
          type: 'bubble',
          size: 'mega',
          header: {
            type: 'box',
            layout: 'vertical',
            backgroundColor: '#e11d48',
            paddingAll: '16px',
            contents: [
              {
                type: 'text',
                text: '🐷 คุณหมูทวง V.2 แจ้งเตือนการบ้าน!',
                color: '#ffffff',
                weight: 'bold',
                size: 'md'
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
                layout: 'horizontal',
                margin: 'md',
                contents: [
                  { type: 'text', text: 'กำหนดส่ง:', size: 'sm', color: '#e11d48', weight: 'bold', flex: 3 },
                  { type: 'text', text: `${dueDate} น.`, size: 'sm', color: '#e11d48', weight: 'bold', flex: 5 }
                ]
              },
              {
                type: 'box',
                layout: 'horizontal',
                margin: 'xs',
                contents: [
                  { type: 'text', text: 'รางวัล:', size: 'sm', color: '#059669', flex: 3 },
                  { type: 'text', text: `+${maxScore} คะแนน & 🥚 ไข่สุ่ม`, size: 'sm', color: '#059669', weight: 'bold', flex: 5 }
                ]
              }
            ]
          },
          footer: {
            type: 'box',
            layout: 'vertical',
            paddingAll: '16px',
            contents: [
              {
                type: 'button',
                style: 'primary',
                color: '#06C755',
                action: {
                  type: 'uri',
                  label: '🚀 ส่งงานทันที (LIFF)',
                  uri: liffUrl || 'https://liff.line.me/YOUR_LIFF_ID'
                }
              }
            ]
          }
        }
      }
    ]
  };

  try {
    const response = await fetch('https://api.line.me/v2/bot/message/push', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${LINE_CHANNEL_ACCESS_TOKEN}`
      },
      body: JSON.stringify(flexMessagePayload)
    });

    const data = await response.json();
    if (response.ok) {
      res.json({ success: true, message: 'ส่ง Push เข้า LINE นักเรียนสำเร็จ!' });
    } else {
      res.status(500).json({ error: data });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Helper: ตอบกลับข้อความต้อนรับ
async function replyWelcomeMessage(replyToken, userId) {
  const payload = {
    replyToken,
    messages: [
      {
        type: 'text',
        text: `สวัสดีครับ! ยินดีต้อนรับสู่ห้องเรียนคุณหมูทวง 🐷✨\nรหัส LINE ของคุณคือ: ${userId}\n\nแตะปุ่มที่เมนูด้านล่างเพื่อเข้าห้องเรียนและส่งการบ้านได้เลย!`
      }
    ]
  };

  await fetch('https://api.line.me/v2/bot/message/reply', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${LINE_CHANNEL_ACCESS_TOKEN}`
    },
    body: JSON.stringify(payload)
  });
}

// Helper: ตอบกลับข้อความนักเรียน
async function handleUserText(replyToken, userId, text) {
  if (text.includes('ส่งงาน') || text.includes('การบ้าน')) {
    const payload = {
      replyToken,
      messages: [
        {
          type: 'text',
          text: 'กดที่ปุ่มเมนูด้านล่าง หรือคลิกที่ลิงก์ LIFF เพื่อดูการบ้านที่ต้องส่งได้เลยครับ 🚀'
        }
      ]
    };
    await fetch('https://api.line.me/v2/bot/message/reply', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${LINE_CHANNEL_ACCESS_TOKEN}`
      },
      body: JSON.stringify(payload)
    });
  }
}

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 LINE OA Backend Server running on http://localhost:${PORT}`);
});
