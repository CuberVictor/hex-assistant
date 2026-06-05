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

    // 清除所有选中的海克斯
    const clearBtn = document.getElementById('clear-augments');
    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        this.state.selectedAugmentIds = [];
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
        // 外部链接（如性格测试）直接跳转，不阻止默认行为
        if (link.classList.contains('nav-link-external')) return;
        e.preventDefault();
        const page = link.dataset.page;
        this.switchPage(page);
      });
    });
  }

  // 切换页面
  switchPage(page) {
    document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
    document.querySelector(`.nav-link[data-page="${page}"]`).classList.add('active');

    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.getElementById(`page-${page}`).classList.add('active');

    if (page === 'codex') {
      codexManager.init();
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

  // 构建提示词
  buildPrompt(hero, selectedAugments, userMessage = '') {
    let prompt = '';

    if (hero) {
      prompt += `当前英雄：${hero.name}（${hero.tags.join('、')}）`;
      if (hero.winrate) {
        prompt += `，胜率 ${hero.winrate}%`;
      }
      prompt += '\n';
    }

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

    if (userMessage) {
      prompt += `\n用户问题：${userMessage}`;
    } else {
      prompt += '\n请推荐最佳的海克斯选择，并说明理由。';
    }

    return prompt;
  }

  // 获取推荐（流式输出）
  async getRecommendation() {
    if (this.state.isLoading) return;

    const selectedHero = champions.find(c => c.id === this.state.selectedHeroId);
    const selectedAugments = hexAugments.filter(a => this.state.selectedAugmentIds.includes(a.id));

    if (!selectedHero || selectedAugments.length === 0) {
      uiManager.addMessage('system', '⚠️ 请先选择英雄和至少一个海克斯');
      return;
    }

    const augmentNames = selectedAugments.map(a => a.name).join('、');
    uiManager.addMessage('user', `请为 <strong>${selectedHero.name}</strong> 推荐海克斯选择<br>已选海克斯：${augmentNames}`);

    this.state.isLoading = true;
    uiManager.showLoading(true);
    uiManager.updateRecommendButton(true, true);

    // 创建空的 assistant 消息用于流式更新
    const msgId = uiManager.addMessage('assistant', '⏳ 正在分析中...');

    try {
      const prompt = this.buildPrompt(selectedHero, selectedAugments);

      // 使用流式输出
      await aiManager.chat(prompt, (chunk, fullContent) => {
        // 更新消息内容（打字机效果）
        uiManager.updateMessage(msgId, fullContent.replace(/\n/g, '<br>'));
      });

    } catch (error) {
      uiManager.updateMessage(msgId, `❌ ${error.message || '获取推荐失败，请重试'}`);
    } finally {
      this.state.isLoading = false;
      uiManager.showLoading(false);
      this.render();
    }
  }

  // 发送消息（流式输出）
  async sendMessage() {
    const input = uiManager.elements.chatInput;
    const message = input.value.trim();

    if (!message) return;
    if (this.state.isLoading) return;

    input.value = '';
    uiManager.addMessage('user', message);

    this.state.isLoading = true;
    uiManager.showLoading(true);

    // 创建空的 assistant 消息用于流式更新
    const msgId = uiManager.addMessage('assistant', '⏳ 正在思考...');

    try {
      const selectedHero = champions.find(c => c.id === this.state.selectedHeroId);
      const selectedAugments = hexAugments.filter(a => this.state.selectedAugmentIds.includes(a.id));

      const prompt = this.buildPrompt(selectedHero, selectedAugments, message);

      // 使用流式输出
      await aiManager.chat(prompt, (chunk, fullContent) => {
        uiManager.updateMessage(msgId, fullContent.replace(/\n/g, '<br>'));
      });

    } catch (error) {
      uiManager.updateMessage(msgId, `❌ ${error.message || '发送失败，请重试'}`);
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
