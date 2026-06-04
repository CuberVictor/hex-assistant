// 主应用逻辑

class App {
  constructor() {
    this.state = {
      selectedHeroId: null,
      selectedAugmentIds: [],
      isLoading: false
    };
  }

  // 初始化应用
  init() {
    uiManager.init();
    uiManager.onHeroTabChange = () => this.render();
    uiManager.onAugmentTabChange = () => this.render();
    this.render();
    this.bindEvents();
    this.checkConfig();
  }

  // 渲染界面
  render() {
    const selectedHero = champions.find(c => c.id === this.state.selectedHeroId);
    const selectedAugments = hexAugments.filter(a => this.state.selectedAugmentIds.includes(a.id));

    uiManager.renderHeroTabs(champions);
    uiManager.renderAugmentTabs(hexAugments);
    uiManager.renderHeroGrid(champions, this.state.selectedHeroId, (id) => this.selectHero(id));
    uiManager.renderAugmentGrid(hexAugments, this.state.selectedAugmentIds, (id) => this.toggleAugment(id));
    uiManager.updateSelection(selectedHero, selectedAugments);

    const canRecommend = this.state.selectedHeroId && this.state.selectedAugmentIds.length > 0;
    uiManager.updateRecommendButton(canRecommend, this.state.isLoading);
  }

  // 绑定事件
  bindEvents() {
    uiManager.elements.recommendBtn.addEventListener('click', () => this.getRecommendation());
    uiManager.elements.configBtn.addEventListener('click', () => uiManager.showConfigModal());
    uiManager.elements.saveConfigBtn.addEventListener('click', () => this.saveConfig());
    uiManager.elements.closeConfigBtn.addEventListener('click', () => uiManager.hideConfigModal());

    uiManager.elements.configModal.addEventListener('click', (e) => {
      if (e.target === uiManager.elements.configModal) {
        uiManager.hideConfigModal();
      }
    });

    if (uiManager.elements.heroSearch) {
      uiManager.elements.heroSearch.addEventListener('input', (e) => {
        uiManager.heroSearchTerm = e.target.value;
        this.render();
      });
    }

    if (uiManager.elements.augmentSearch) {
      uiManager.elements.augmentSearch.addEventListener('input', (e) => {
        uiManager.augmentSearchTerm = e.target.value;
        this.render();
      });
    }

    // 对话框发送
    if (uiManager.elements.chatSend) {
      uiManager.elements.chatSend.addEventListener('click', () => this.sendMessage());
    }

    if (uiManager.elements.chatInput) {
      uiManager.elements.chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          this.sendMessage();
        }
      });
    }

    // 页面切换
    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const page = link.dataset.page;
        this.switchPage(page);
      });
    });
  }

  // 切换页面
  switchPage(page) {
    // 更新导航状态
    document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
    document.querySelector(`.nav-link[data-page="${page}"]`).classList.add('active');

    // 更新页面显示
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.getElementById(`page-${page}`).classList.add('active');

    // 如果切换到图鉴，初始化图鉴
    if (page === 'codex') {
      codexManager.init();
    }
  }

  // 检查配置
  checkConfig() {
    if (!aiManager.isConfigured()) {
      setTimeout(() => {
        uiManager.showConfigModal();
      }, 500);
    }
  }

  // 选择英雄
  selectHero(heroId) {
    this.state.selectedHeroId = heroId;
    this.render();
  }

  // 切换海克斯选择
  toggleAugment(augmentId) {
    const index = this.state.selectedAugmentIds.indexOf(augmentId);
    if (index === -1) {
      this.state.selectedAugmentIds.push(augmentId);
    } else {
      this.state.selectedAugmentIds.splice(index, 1);
    }
    this.render();
  }

  // 保存配置
  saveConfig() {
    const apiKey = uiManager.elements.apiKeyInput.value.trim();
    const botId = uiManager.elements.botIdInput.value.trim();

    if (!apiKey || !botId) {
      alert('请输入 API Key 和 Bot ID');
      return;
    }

    aiManager.saveConfig(apiKey, botId);
    uiManager.hideConfigModal();
    this.render();
  }

  // 构建提示词（用于传递选择信息给智能体）
  buildPrompt(hero, selectedAugments, userMessage = '') {
    let prompt = '';

    // 添加英雄信息
    if (hero) {
      prompt += `当前英雄：${hero.name}（${hero.tags.join('、')}）`;
      if (hero.winrate) {
        prompt += `，胜率 ${hero.winrate}%`;
      }
      prompt += '\n';
    }

    // 添加海克斯信息
    if (selectedAugments.length > 0) {
      prompt += '\n玩家拥有的海克斯强化：\n';
      selectedAugments.forEach(a => {
        const tierName = tierConfig[a.tier].name;
        prompt += `- ${a.name}（${tierName}）`;
        if (a.description) {
          prompt += `：${a.description}`;
        }
        prompt += '\n';
      });
    }

    // 添加用户消息
    if (userMessage) {
      prompt += `\n用户问题：${userMessage}`;
    } else {
      prompt += '\n请推荐最佳的海克斯选择，并说明理由。';
    }

    return prompt;
  }

  // 获取推荐
  async getRecommendation() {
    if (this.state.isLoading) return;

    const selectedHero = champions.find(c => c.id === this.state.selectedHeroId);
    const selectedAugments = hexAugments.filter(a => this.state.selectedAugmentIds.includes(a.id));

    if (!selectedHero || selectedAugments.length === 0) {
      uiManager.addMessage('system', '⚠️ 请先选择英雄和至少一个海克斯');
      return;
    }

    if (!aiManager.isConfigured()) {
      uiManager.addMessage('system', '⚠️ 请先配置 API Key 和 Bot ID');
      uiManager.showConfigModal();
      return;
    }

    // 构建用户消息显示
    const augmentNames = selectedAugments.map(a => a.name).join('、');
    uiManager.addMessage('user', `请为 <strong>${selectedHero.name}</strong> 推荐海克斯选择<br>已选海克斯：${augmentNames}`);

    this.state.isLoading = true;
    uiManager.showLoading(true);
    uiManager.updateRecommendButton(true, true);

    // 添加加载消息
    const loadingMsgId = uiManager.addMessage('system', '⏳ 正在分析中，请稍候...');

    try {
      // 构建完整的提示词
      const prompt = this.buildPrompt(selectedHero, selectedAugments);

      // 调用 AI API
      const result = await aiManager.chat(prompt);

      // 移除加载消息，显示结果
      uiManager.removeMessage(loadingMsgId);
      uiManager.addMessage('assistant', result.replace(/\n/g, '<br>'));
    } catch (error) {
      uiManager.removeMessage(loadingMsgId);
      uiManager.addMessage('system', `❌ ${error.message || '获取推荐失败，请重试'}`);
    } finally {
      this.state.isLoading = false;
      uiManager.showLoading(false);
      this.render();
    }
  }

  // 发送消息
  async sendMessage() {
    const input = uiManager.elements.chatInput;
    const message = input.value.trim();

    if (!message) return;
    if (this.state.isLoading) return;

    if (!aiManager.isConfigured()) {
      uiManager.addMessage('system', '⚠️ 请先配置 API Key 和 Bot ID');
      uiManager.showConfigModal();
      return;
    }

    // 清空输入框
    input.value = '';

    // 添加用户消息
    uiManager.addMessage('user', message);

    this.state.isLoading = true;
    uiManager.showLoading(true);

    try {
      const selectedHero = champions.find(c => c.id === this.state.selectedHeroId);
      const selectedAugments = hexAugments.filter(a => this.state.selectedAugmentIds.includes(a.id));

      // 构建提示词，包含选择信息
      const prompt = this.buildPrompt(selectedHero, selectedAugments, message);

      // 调用 AI
      const result = await aiManager.chat(prompt);

      // 显示回复
      uiManager.addMessage('assistant', result.replace(/\n/g, '<br>'));
    } catch (error) {
      uiManager.addMessage('system', `❌ ${error.message || '发送失败，请重试'}`);
    } finally {
      this.state.isLoading = false;
      uiManager.showLoading(false);
    }
  }

  // 发送消息
  async sendMessage() {
    const input = uiManager.elements.chatInput;
    const message = input.value.trim();

    if (!message) return;
    if (this.state.isLoading) return;

    if (!aiManager.isConfigured()) {
      uiManager.addMessage('system', '⚠️ 请先配置 API Key 和 Bot ID');
      uiManager.showConfigModal();
      return;
    }

    // 清空输入框
    input.value = '';

    // 添加用户消息
    uiManager.addMessage('user', message);

    this.state.isLoading = true;
    uiManager.showLoading(true);

    try {
      const selectedHero = champions.find(c => c.id === this.state.selectedHeroId);
      const selectedAugments = hexAugments.filter(a => this.state.selectedAugmentIds.includes(a.id));

      // 构建提示词，包含选择信息
      const prompt = this.buildPrompt(selectedHero, selectedAugments, message);

      // 调用 AI
      const result = await aiManager.getRecommendation(selectedHero || { name: '未选择', tags: [] }, selectedAugments);

      // 显示回复
      let response = '';
      if (result.recommendations && result.recommendations.length > 0) {
        result.recommendations.forEach((rec, index) => {
          const medal = index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉';
          response += `${medal} **${rec.augment}**：${rec.reason}\n\n`;
        });
      }
      if (result.analysis) {
        response += result.analysis;
      }
      if (!response) {
        response = typeof result === 'string' ? result : JSON.stringify(result);
      }

      uiManager.addMessage('assistant', response.replace(/\n/g, '<br>'));
    } catch (error) {
      uiManager.addMessage('system', `❌ ${error.message || '发送失败，请重试'}`);
    } finally {
      this.state.isLoading = false;
      uiManager.showLoading(false);
    }
  }
}

// 创建全局实例
const app = new App();

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
  app.init();
});
