// Vercel Serverless Function - Coze API 代理（流式输出）

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const API_KEY = process.env.COZE_API_KEY;
  const BOT_ID = process.env.COZE_BOT_ID;

  if (!API_KEY || !BOT_ID) {
    return res.status(500).json({ error: '服务器配置错误' });
  }

  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: '缺少 prompt 参数' });
    }

    // 设置 SSE 响应头
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    // 调用 Coze API（开启流式）
    const chatResponse = await fetch('https://api.coze.cn/v3/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`
      },
      body: JSON.stringify({
        bot_id: BOT_ID,
        user_id: `web-${Date.now()}`,
        additional_messages: [
          {
            role: 'user',
            content: prompt,
            content_type: 'text'
          }
        ],
        stream: true,
        auto_save_history: false
      })
    });

    if (!chatResponse.ok) {
      const error = await chatResponse.json().catch(() => ({}));
      res.write(`data: ${JSON.stringify({ error: error.msg || 'Coze API 调用失败' })}\n\n`);
      res.end();
      return;
    }

    // 处理流式响应
    const reader = chatResponse.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';

      let eventType = '';

      for (const line of lines) {
        if (line.startsWith('event:')) {
          eventType = line.slice(6).trim();
        } else if (line.startsWith('data:')) {
          const data = line.slice(5).trim();
          if (!data) continue;

          try {
            const parsed = JSON.parse(data);

            // 处理消息增量
            if (eventType === 'conversation.message.delta' && parsed.content) {
              res.write(`data: ${JSON.stringify({ content: parsed.content })}\n\n`);
            }

            // 处理对话完成
            if (eventType === 'conversation.chat.completed') {
              res.write('data: [DONE]\n\n');
              break;
            }

            // 处理错误
            if (eventType === 'conversation.chat.failed') {
              const errMsg = parsed.last_error?.msg || parsed.msg || '对话失败';
              res.write(`data: ${JSON.stringify({ error: errMsg })}\n\n`);
              break;
            }
          } catch (e) {
            // 忽略解析错误
          }
        }
      }
    }

    res.end();

  } catch (error) {
    console.error('API Error:', error);
    res.write(`data: ${JSON.stringify({ error: '服务器错误' })}\n\n`);
    res.end();
  }
}
