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

  // 保留这些方法以兼容旧代码
  isConfigured() {
    return true; // 后端已配置
  }

  saveConfig() {
    // 不需要前端保存配置
  }
}

// 创建全局实例
const aiManager = new AIManager();
