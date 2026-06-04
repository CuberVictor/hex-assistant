// AI API 调用模块

class AIManager {
  constructor() {
    this.apiKey = localStorage.getItem('cozeApiKey') || '';
    this.botId = localStorage.getItem('cozeBotId') || '';
    this.apiEndpoint = 'https://api.coze.cn/v3';
  }

  // 保存配置
  saveConfig(apiKey, botId) {
    this.apiKey = apiKey;
    this.botId = botId;
    localStorage.setItem('cozeApiKey', apiKey);
    localStorage.setItem('cozeBotId', botId);
  }

  // 检查配置是否完整
  isConfigured() {
    return this.apiKey && this.botId;
  }

  // 获取请求头
  getHeaders() {
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.apiKey}`
    };
  }

  // 延迟函数
  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // 调用 Coze API（异步轮询模式）
  async chat(prompt) {
    if (!this.isConfigured()) {
      throw new Error('请先配置 API Key 和 Bot ID');
    }

    try {
      // 第一步：发起对话
      console.log('发起对话...');
      const chatResponse = await fetch(`${this.apiEndpoint}/chat`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({
          bot_id: this.botId,
          user_id: 'hex-assistant-user',
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
        const errorData = await chatResponse.json().catch(() => ({}));
        throw new Error(errorData.msg || `发起对话失败: ${chatResponse.status}`);
      }

      const chatData = await chatResponse.json();
      console.log('对话响应:', chatData);

      if (chatData.code !== 0) {
        throw new Error(chatData.msg || '发起对话失败');
      }

      const chatId = chatData.data?.id;
      const conversationId = chatData.data?.conversation_id;

      if (!chatId || !conversationId) {
        throw new Error('未获取到对话 ID');
      }

      // 第二步：轮询对话状态
      console.log('轮询对话状态...');
      let status = 'in_progress';
      let attempts = 0;
      const maxAttempts = 30; // 最多等待 30 秒

      while (status === 'in_progress' || status === 'created') {
        if (attempts >= maxAttempts) {
          throw new Error('等待超时，请重试');
        }

        await this.sleep(1000); // 等待 1 秒
        attempts++;

        const statusResponse = await fetch(
          `${this.apiEndpoint}/chat/retrieve?chat_id=${chatId}&conversation_id=${conversationId}`,
          { headers: this.getHeaders() }
        );

        if (!statusResponse.ok) {
          throw new Error('查询对话状态失败');
        }

        const statusData = await statusResponse.json();
        status = statusData.data?.status;
        console.log(`对话状态: ${status} (${attempts}/${maxAttempts})`);
      }

      if (status === 'failed') {
        throw new Error('对话失败，请重试');
      }

      // 第三步：获取消息列表
      console.log('获取消息...');
      const messagesResponse = await fetch(
        `${this.apiEndpoint}/chat/message/list?chat_id=${chatId}&conversation_id=${conversationId}`,
        { headers: this.getHeaders() }
      );

      if (!messagesResponse.ok) {
        throw new Error('获取消息失败');
      }

      const messagesData = await messagesResponse.json();
      console.log('消息数据:', messagesData);

      // 找到 assistant 的回复
      const messages = messagesData.data || [];
      const assistantMessage = messages.find(m => m.role === 'assistant' && m.type === 'answer');

      if (!assistantMessage) {
        throw new Error('未获取到回复');
      }

      return assistantMessage.content;
    } catch (error) {
      console.error('AI 调用错误:', error);
      throw error;
    }
  }

  // 获取推荐（兼容旧接口）
  async getRecommendation(hero, availableAugments) {
    const prompt = `当前英雄：${hero.name}（${hero.tags.join('、')}）
玩家拥有的海克斯强化：
${availableAugments.map(a => `- ${a.name}（${tierConfig[a.tier].name}）：${a.description || ''}`).join('\n')}

请推荐最佳的3个海克斯选择，并说明理由。`;

    const result = await this.chat(prompt);

    // 尝试解析 JSON
    try {
      const jsonMatch = result.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
    } catch (e) {
      // 解析失败返回原始文本
    }

    return {
      recommendations: [],
      analysis: result
    };
  }
}

// 创建全局实例
const aiManager = new AIManager();
