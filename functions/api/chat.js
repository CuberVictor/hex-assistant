// Cloudflare Pages Function - Coze API 代理

export async function onRequestPost(context) {
  // 从环境变量获取配置
  const API_KEY = context.env.COZE_API_KEY;
  const BOT_ID = context.env.COZE_BOT_ID;

  if (!API_KEY || !BOT_ID) {
    return new Response(JSON.stringify({ error: '服务器配置错误' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    const { prompt } = await context.request.json();

    if (!prompt) {
      return new Response(JSON.stringify({ error: '缺少 prompt 参数' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
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
      return new Response(JSON.stringify({ error: error.msg || 'Coze API 调用失败' }), {
        status: chatResponse.status,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const chatData = await chatResponse.json();

    if (chatData.code !== 0) {
      return new Response(JSON.stringify({ error: chatData.msg || 'Coze API 错误' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const chatId = chatData.data?.id;
    const conversationId = chatData.data?.conversation_id;

    // 轮询等待结果
    let status = 'in_progress';
    let attempts = 0;
    const maxAttempts = 30;

    while (status === 'in_progress' || status === 'created') {
      if (attempts >= maxAttempts) {
        return new Response(JSON.stringify({ error: '请求超时' }), {
          status: 408,
          headers: { 'Content-Type': 'application/json' }
        });
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
      return new Response(JSON.stringify({ error: '对话失败' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // 获取消息
    const messagesResponse = await fetch(
      `https://api.coze.cn/v3/chat/message/list?chat_id=${chatId}&conversation_id=${conversationId}`,
      { headers: { 'Authorization': `Bearer ${API_KEY}` } }
    );

    if (!messagesResponse.ok) {
      return new Response(JSON.stringify({ error: '获取消息失败' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const messagesData = await messagesResponse.json();
    const messages = messagesData.data || [];
    const assistantMessage = messages.find(m => m.role === 'assistant' && m.type === 'answer');

    if (!assistantMessage) {
      return new Response(JSON.stringify({ error: '未获取到回复' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // 返回结果
    return new Response(JSON.stringify({ content: assistantMessage.content }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('API Error:', error);
    return new Response(JSON.stringify({ error: '服务器错误' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
