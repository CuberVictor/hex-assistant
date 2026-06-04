// AI API 调用模块 - 通过 Vercel Serverless Function 代理

class AIManager {
  constructor() {
    // 使用相对路径调用 Vercel API Route
    this.apiEndpoint = '/api/chat';
  }

  // 调用 AI（通过后端代理）
  async chat(prompt) {
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

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      return data.content;
    } catch (error) {
      console.error('AI 调用错误:', error);
      throw error;
    }
  }

  // 兼容旧接口
  isConfigured() {
    return true; // 后端已配置，无需前端输入
  }

  saveConfig() {
    // 不需要前端保存配置
  }
}

// 创建全局实例
const aiManager = new AIManager();
