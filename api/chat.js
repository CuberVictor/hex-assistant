// Vercel Serverless Function - Coze API 代理
// Token 存在 Vercel 环境变量中，前端看不到

export default async function handler(req, res) {
  // 只允许 POST 请求
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // 从环境变量获取配置
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

    // 调用 Coze API
    const chatResponse = await fetch('https://api.coze.cn/v3/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`
      },
      body: JSON.stringify({
        bot_id: BOT_ID,
        user_id: 'web-user',
        additional_messages: [
          {
            role: 'user',
            content: prompt,
            content_type: 'text'
          }
        ],
        stream: false,
        auto_save_history: true
      })
    });

    if (!chatResponse.ok) {
      const error = await chatResponse.json().catch(() => ({}));
      return res.status(chatResponse.status).json({ error: error.msg || 'Coze API 调用失败' });
    }

    const chatData = await chatResponse.json();

    if (chatData.code !== 0) {
      return res.status(400).json({ error: chatData.msg || 'Coze API 错误' });
    }

    const chatId = chatData.data?.id;
    const conversationId = chatData.data?.conversation_id;

    // 轮询等待结果
    let status = 'in_progress';
    let attempts = 0;
    const maxAttempts = 30;

    while (status === 'in_progress' || status === 'created') {
      if (attempts >= maxAttempts) {
        return res.status(408).json({ error: '请求超时' });
      }

      await new Promise(resolve => setTimeout(resolve, 1000));
      attempts++;

      const statusResponse = await fetch(
        `https://api.coze.cn/v3/chat/retrieve?chat_id=${chatId}&conversation_id=${conversationId}`,
        { headers: { 'Authorization': `Bearer ${API_KEY}` } }
      );

      if (statusResponse.ok) {
        const statusData = await statusResponse.json();
        status = statusData.data?.status;
      }
    }

    if (status === 'failed') {
      return res.status(500).json({ error: '对话失败' });
    }

    // 获取消息
    const messagesResponse = await fetch(
      `https://api.coze.cn/v3/chat/message/list?chat_id=${chatId}&conversation_id=${conversationId}`,
      { headers: { 'Authorization': `Bearer ${API_KEY}` } }
    );

    if (!messagesResponse.ok) {
      return res.status(500).json({ error: '获取消息失败' });
    }

    const messagesData = await messagesResponse.json();
    const messages = messagesData.data || [];
    const assistantMessage = messages.find(m => m.role === 'assistant' && m.type === 'answer');

    if (!assistantMessage) {
      return res.status(500).json({ error: '未获取到回复' });
    }

    // 返回结果
    return res.status(200).json({ content: assistantMessage.content });

  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ error: '服务器错误' });
  }
}
