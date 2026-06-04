// UI 交互模块

class UIManager {
  constructor() {
    this.elements = {};
    this.heroSearchTerm = '';
    this.augmentSearchTerm = '';
    this.activeHeroTab = 'all';
    this.activeAugmentTab = 'all';
  }

  // 初始化 DOM 元素引用
  init() {
    this.elements = {
      heroGrid: document.getElementById('hero-grid'),
      augmentGrid: document.getElementById('augment-grid'),
      heroTabs: document.getElementById('hero-tabs'),
      augmentTabs: document.getElementById('augment-tabs'),
      selectedHero: document.getElementById('selected-hero'),
      selectedAugments: document.getElementById('selected-augments'),
      recommendBtn: document.getElementById('recommend-btn'),
      chatArea: document.getElementById('chat-area'),
      chatMessages: document.getElementById('chat-messages'),
      chatInput: document.getElementById('chat-input'),
      chatSend: document.getElementById('chat-send'),
      loading: document.getElementById('loading'),
      configBtn: document.getElementById('config-btn'),
      configModal: document.getElementById('config-modal'),
      apiKeyInput: document.getElementById('api-key-input'),
      botIdInput: document.getElementById('bot-id-input'),
      saveConfigBtn: document.getElementById('save-config-btn'),
      closeConfigBtn: document.getElementById('close-config-btn'),
      heroSearch: document.getElementById('hero-search'),
      augmentSearch: document.getElementById('augment-search'),
      heroCount: document.getElementById('hero-count'),
      augmentCount: document.getElementById('augment-count')
    };
  }

  // 渲染英雄分类 Tabs
  renderHeroTabs(championsData) {
    const categories = ['all', '战士', '法师', '射手', '坦克', '辅助', '刺客'];
    const categoryIcons = {
      'all': '📋', '战士': '⚔️', '法师': '🔮', '射手': '🏹',
      '坦克': '🛡️', '辅助': '💚', '刺客': '🗡️'
    };

    const counts = { all: championsData.length };
    championsData.forEach(c => {
      c.tags.forEach(tag => {
        counts[tag] = (counts[tag] || 0) + 1;
      });
    });

    this.elements.heroTabs.innerHTML = categories.map(cat => `
      <button class="tab-btn ${this.activeHeroTab === cat ? 'active' : ''}" data-tab="${cat}">
        <span class="tab-icon">${categoryIcons[cat]}</span>
        <span class="tab-name">${cat === 'all' ? '全部' : cat}</span>
        <span class="tab-count">${counts[cat] || 0}</span>
      </button>
    `).join('');

    this.elements.heroTabs.querySelectorAll('.tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        this.activeHeroTab = btn.dataset.tab;
        this.elements.heroTabs.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        if (this.onHeroTabChange) this.onHeroTabChange();
      });
    });
  }

  // 渲染海克斯分类 Tabs
  renderAugmentTabs(augmentsData) {
    const tabs = [
      { key: 'all', name: '全部', color: '#00d4ff' },
      { key: 'prismatic', name: '棱彩', color: tierConfig.prismatic.color },
      { key: 'gold', name: '金色', color: tierConfig.gold.color },
      { key: 'silver', name: '银色', color: tierConfig.silver.color }
    ];

    const counts = { all: augmentsData.length };
    augmentsData.forEach(a => {
      counts[a.tier] = (counts[a.tier] || 0) + 1;
    });

    this.elements.augmentTabs.innerHTML = tabs.map(tab => `
      <button class="tab-btn ${this.activeAugmentTab === tab.key ? 'active' : ''}"
              data-tab="${tab.key}"
              style="--tab-color: ${tab.color}">
        <span class="tab-dot" style="background: ${tab.color}"></span>
        <span class="tab-name">${tab.name}</span>
        <span class="tab-count">${counts[tab.key] || 0}</span>
      </button>
    `).join('');

    this.elements.augmentTabs.querySelectorAll('.tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        this.activeAugmentTab = btn.dataset.tab;
        this.elements.augmentTabs.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        if (this.onAugmentTabChange) this.onAugmentTabChange();
      });
    });
  }

  // 渲染英雄网格
  renderHeroGrid(championsData, selectedHeroId, onSelect) {
    let filtered = championsData;

    if (this.activeHeroTab !== 'all') {
      filtered = filtered.filter(c => c.tags.includes(this.activeHeroTab));
    }

    if (this.heroSearchTerm) {
      const term = this.heroSearchTerm.toLowerCase();
      filtered = filtered.filter(h =>
        h.name.toLowerCase().includes(term) ||
        h.nameEn.toLowerCase().includes(term)
      );
    }

    if (this.elements.heroCount) {
      this.elements.heroCount.textContent = `${filtered.length}`;
    }

    const iconBaseUrl = 'https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/champion-icons/';

    this.elements.heroGrid.innerHTML = filtered.map(hero => `
      <div class="hero-card ${selectedHeroId === hero.id ? 'selected' : ''}"
           data-id="${hero.id}">
        <div class="hero-avatar-wrapper">
          ${hero.iconId ? `<img src="${iconBaseUrl}${hero.iconId}.png" alt="${hero.name}" class="hero-icon" onerror="this.parentElement.innerHTML='<span class=\\'hero-placeholder\\'>${hero.name.charAt(0)}</span>'">` : `<span class="hero-placeholder">${hero.name.charAt(0)}</span>`}
        </div>
        <div class="hero-name">${hero.name}</div>
        ${hero.winrate ? `<div class="hero-winrate">${hero.winrate}%</div>` : ''}
      </div>
    `).join('');

    this.elements.heroGrid.querySelectorAll('.hero-card').forEach(card => {
      card.addEventListener('click', () => {
        const id = parseInt(card.dataset.id);
        onSelect(id);
      });
    });
  }

  // 渲染海克斯网格
  renderAugmentGrid(augments, selectedIds, onToggle) {
    let filtered = augments;

    if (this.activeAugmentTab !== 'all') {
      filtered = filtered.filter(a => a.tier === this.activeAugmentTab);
    }

    if (this.augmentSearchTerm) {
      const term = this.augmentSearchTerm.toLowerCase();
      filtered = filtered.filter(a => a.name.toLowerCase().includes(term));
    }

    if (this.elements.augmentCount) {
      this.elements.augmentCount.textContent = `${filtered.length}`;
    }

    const grouped = {};
    filtered.forEach(a => {
      if (!grouped[a.tier]) grouped[a.tier] = [];
      grouped[a.tier].push(a);
    });

    let html = '';
    const tierOrder = ['prismatic', 'gold', 'silver'];

    tierOrder.forEach(tier => {
      if (!grouped[tier] || grouped[tier].length === 0) return;
      const config = tierConfig[tier];

      html += `
        <div class="augment-section">
          <div class="augment-section-title" style="color: ${config.color}">
            <span class="tier-dot" style="background: ${config.color}"></span>
            ${config.name} (${grouped[tier].length})
          </div>
          <div class="augment-grid">
            ${grouped[tier].map(augment => `
              <div class="augment-card ${selectedIds.includes(augment.id) ? 'selected' : ''}"
                   data-id="${augment.id}"
                   title="${augment.description || '暂无描述'}"
                   style="--tier-color: ${config.color}">
                <div class="augment-icon-wrapper" style="border-color: ${selectedIds.includes(augment.id) ? config.color : 'transparent'}">
                  ${augment.image ? `<img src="${augment.image}" alt="${augment.name}" class="augment-icon" onerror="this.parentElement.innerHTML='<span class=\\'augment-placeholder\\'>${augment.name.charAt(0)}</span>'">` : `<span class="augment-placeholder">${augment.name.charAt(0)}</span>`}
                  ${selectedIds.includes(augment.id) ? '<span class="augment-check">✓</span>' : ''}
                </div>
                <div class="augment-name">${augment.name}</div>
              </div>
            `).join('')}
          </div>
        </div>
      `;
    });

    this.elements.augmentGrid.innerHTML = html;

    this.elements.augmentGrid.querySelectorAll('.augment-card').forEach(card => {
      card.addEventListener('click', () => {
        const id = parseInt(card.dataset.id);
        onToggle(id);
      });
    });
  }

  // 更新已选择信息
  updateSelection(hero, selectedAugments) {
    if (hero) {
      this.elements.selectedHero.innerHTML = `
        <span class="selection-label">当前英雄：</span>
        <span class="selection-value">${hero.name}（${hero.tags.join('、')}）${hero.winrate ? ` - 胜率 ${hero.winrate}%` : ''}</span>
      `;
    } else {
      this.elements.selectedHero.innerHTML = `
        <span class="selection-label">当前英雄：</span>
        <span class="selection-placeholder">请点击选择英雄</span>
      `;
    }

    if (selectedAugments.length > 0) {
      this.elements.selectedAugments.innerHTML = `
        <span class="selection-label">已选海克斯（${selectedAugments.length}个）：</span>
        <span class="selection-value">${selectedAugments.map(a => a.name).join('、')}</span>
      `;
    } else {
      this.elements.selectedAugments.innerHTML = `
        <span class="selection-label">已选海克斯：</span>
        <span class="selection-placeholder">请点击选择拥有的海克斯</span>
      `;
    }
  }

  // 更新推荐按钮状态
  updateRecommendButton(isEnabled, isLoading) {
    this.elements.recommendBtn.disabled = !isEnabled || isLoading;
    this.elements.recommendBtn.textContent = isLoading ? '推荐中...' : '获取推荐';
  }

  // 添加聊天消息
  addMessage(role, content) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `chat-message ${role}`;
    const messageId = 'msg-' + Date.now();
    messageDiv.id = messageId;
    messageDiv.innerHTML = `
      <div class="message-avatar">${role === 'user' ? '👤' : '🤖'}</div>
      <div class="message-content">${content}</div>
    `;
    this.elements.chatMessages.appendChild(messageDiv);
    this.elements.chatMessages.scrollTop = this.elements.chatMessages.scrollHeight;
    return messageId;
  }

  // 移除聊天消息
  removeMessage(messageId) {
    const msg = document.getElementById(messageId);
    if (msg) msg.remove();
  }

  // 显示加载状态
  showLoading(show) {
    this.elements.loading.style.display = show ? 'flex' : 'none';
  }

  // 显示配置弹窗
  showConfigModal() {
    // 从 localStorage 或内存加载配置
    const apiKey = localStorage.getItem('cozeApiKey') || aiManager.apiKey;
    const botId = localStorage.getItem('cozeBotId') || aiManager.botId;

    this.elements.apiKeyInput.value = apiKey;
    this.elements.botIdInput.value = botId;

    // 设置记住勾选框状态
    const rememberCheckbox = document.getElementById('remember-config');
    if (rememberCheckbox) {
      rememberCheckbox.checked = !!localStorage.getItem('cozeConfigSaved');
    }

    this.elements.configModal.style.display = 'flex';
  }

  // 隐藏配置弹窗
  hideConfigModal() {
    this.elements.configModal.style.display = 'none';
  }
}

// 创建全局实例
const uiManager = new UIManager();
