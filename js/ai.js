// AI API 调用模块 - 通过 Vercel Serverless Function 代理（流式输出）

class AIManager {
  constructor() {
    this.apiEndpoint = '/api/chat';
  }

  // 调用 AI（流式输出）
  async chat(prompt, onChunk) {
    try {
      const response = await fetch(this.apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ prompt })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `请求失败: ${response.status}`);
      }

      // 处理流式响应
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let fullContent = '';
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.startsWith('data:')) {
            const data = line.slice(5).trim();
            if (data === '[DONE]') {
              return fullContent;
            }
            try {
              const parsed = JSON.parse(data);
              if (parsed.content) {
                fullContent += parsed.content;
                if (onChunk) {
                  onChunk(parsed.content, fullContent);
                }
              }
              if (parsed.error) {
                throw new Error(parsed.error);
              }
            } catch (e) {
              if (e.message && !e.message.includes('JSON')) {
                throw e;
              }
            }
          }
        }
      }

      return fullContent;
    } catch (error) {
      console.error('AI 调用错误:', error);
      throw error;
    }
  }

  // 兼容旧接口
  isConfigured() {
    return true;
  }

  saveConfig() {
    // 不需要前端保存配置
  }
}

// 创建全局实例
const aiManager = new AIManager();
