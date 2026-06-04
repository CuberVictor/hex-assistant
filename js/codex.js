// 图鉴模块

const ICON_BASE_URL = 'https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/champion-icons/';

class CodexManager {
  constructor() {
    this.currentType = 'augments'; // augments 或 heroes
    this.currentTier = 'all';
    this.currentRole = 'all';
    this.searchTerm = '';
    this.heroSearchTerm = '';
    this.initialized = false;
  }

  // 初始化
  init() {
    if (this.initialized) return;
    this.initialized = true;

    this.elements = {
      codexGrid: document.getElementById('codex-grid'),
      codexTabs: document.getElementById('codex-tabs'),
      codexSearch: document.getElementById('codex-search'),
      codexCount: document.getElementById('codex-count'),
      heroCodexGrid: document.getElementById('hero-codex-grid'),
      heroCodexTabs: document.getElementById('hero-codex-tabs'),
      heroCodexSearch: document.getElementById('hero-codex-search'),
      heroCodexCount: document.getElementById('hero-codex-count'),
      detailModal: document.getElementById('detail-modal'),
      detailBody: document.getElementById('detail-body'),
      detailClose: document.getElementById('detail-close')
    };

    this.bindEvents();
    this.renderAugments();
    this.renderHeroes();
  }

  // 绑定事件
  bindEvents() {
    // 图鉴类型切换
    document.querySelectorAll('.codex-type-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        this.currentType = btn.dataset.type;
        document.querySelectorAll('.codex-type-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        document.querySelectorAll('.codex-section').forEach(s => s.classList.remove('active'));
        document.getElementById(`codex-${this.currentType}`).classList.add('active');
      });
    });

    // 海克斯品质 Tab
    this.elements.codexTabs.querySelectorAll('.tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        this.currentTier = btn.dataset.tier;
        this.elements.codexTabs.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.renderAugments();
      });
    });

    // 英雄职业 Tab
    this.elements.heroCodexTabs.querySelectorAll('.tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        this.currentRole = btn.dataset.role;
        this.elements.heroCodexTabs.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.renderHeroes();
      });
    });

    // 海克斯搜索
    this.elements.codexSearch.addEventListener('input', (e) => {
      this.searchTerm = e.target.value.toLowerCase();
      this.renderAugments();
    });

    // 英雄搜索
    this.elements.heroCodexSearch.addEventListener('input', (e) => {
      this.heroSearchTerm = e.target.value.toLowerCase();
      this.renderHeroes();
    });

    // 关闭弹窗
    this.elements.detailClose.addEventListener('click', () => this.hideDetail());
    this.elements.detailModal.addEventListener('click', (e) => {
      if (e.target === this.elements.detailModal) {
        this.hideDetail();
      }
    });
  }

  // 渲染海克斯图鉴
  renderAugments() {
    let filtered = [...hexAugments];

    if (this.currentTier !== 'all') {
      filtered = filtered.filter(a => a.tier === this.currentTier);
    }

    if (this.searchTerm) {
      filtered = filtered.filter(a =>
        a.name.toLowerCase().includes(this.searchTerm) ||
        (a.description && a.description.toLowerCase().includes(this.searchTerm))
      );
    }

    this.elements.codexCount.textContent = filtered.length;

    this.elements.codexGrid.innerHTML = filtered.map(augment => {
      const config = tierConfig[augment.tier];
      return `
        <div class="codex-card" data-id="${augment.id}" data-type="augment" style="--tier-color: ${config.color}">
          <div class="codex-icon-wrapper" style="border-color: ${config.color}">
            ${augment.image ? `<img src="${augment.image}" alt="${augment.name}" class="codex-icon" onerror="this.parentElement.innerHTML='<span class=\\'codex-placeholder\\'>${augment.name.charAt(0)}</span>'">` : `<span class="codex-placeholder">${augment.name.charAt(0)}</span>`}
          </div>
          <div class="codex-info">
            <div class="codex-name" style="color: ${config.color}">${augment.name}</div>
            <div class="codex-tier">${config.name}</div>
          </div>
        </div>
      `;
    }).join('');

    this.elements.codexGrid.querySelectorAll('.codex-card').forEach(card => {
      card.addEventListener('click', () => {
        const id = parseInt(card.dataset.id);
        this.showAugmentDetail(id);
      });
    });
  }

  // 渲染英雄图鉴
  renderHeroes() {
    let filtered = [...champions];

    if (this.currentRole !== 'all') {
      filtered = filtered.filter(c => c.tags.includes(this.currentRole));
    }

    if (this.heroSearchTerm) {
      filtered = filtered.filter(c =>
        c.name.toLowerCase().includes(this.heroSearchTerm) ||
        c.nameEn.toLowerCase().includes(this.heroSearchTerm)
      );
    }

    this.elements.heroCodexCount.textContent = filtered.length;

    this.elements.heroCodexGrid.innerHTML = filtered.map(hero => `
      <div class="codex-hero-card" data-id="${hero.id}" data-type="hero">
        <div class="codex-hero-avatar">
          ${hero.iconId ? `<img src="${ICON_BASE_URL}${hero.iconId}.png" alt="${hero.name}" onerror="this.parentElement.innerHTML='<span class=\\'placeholder\\'>${hero.name.charAt(0)}</span>'">` : `<span class="placeholder">${hero.name.charAt(0)}</span>`}
        </div>
        <div class="codex-hero-name">${hero.name}</div>
        <div class="codex-hero-tags">${hero.tags.join(' ')}</div>
        ${hero.winrate ? `<div class="codex-hero-winrate">${hero.winrate}%</div>` : ''}
      </div>
    `).join('');

    this.elements.heroCodexGrid.querySelectorAll('.codex-hero-card').forEach(card => {
      card.addEventListener('click', () => {
        const id = parseInt(card.dataset.id);
        this.showHeroDetail(id);
      });
    });
  }

  // 显示海克斯详情
  showAugmentDetail(augmentId) {
    const augment = hexAugments.find(a => a.id === augmentId);
    if (!augment) return;

    const config = tierConfig[augment.tier];

    let description = augment.description || '暂无描述';
    description = description.replace(/海克斯大乱斗强化符文攻略\s*-\s*/, '');
    description = description.replace(/胜率：[\d.]+%，登场率：[\d.]+%。/, '');
    description = description.replace(/了解哪些英雄最适配该强化符文。/, '');

    const synergyHeroes = this.findSynergyHeroes(augment);

    this.elements.detailBody.innerHTML = `
      <div class="detail-header">
        <div class="detail-icon-wrapper" style="border-color: ${config.color}">
          ${augment.image ? `<img src="${augment.image}" alt="${augment.name}" class="detail-icon">` : `<span class="detail-icon-placeholder">${augment.name.charAt(0)}</span>`}
        </div>
        <div class="detail-title">
          <h2 style="color: ${config.color}">${augment.name}</h2>
          <span class="detail-tier-badge" style="background: ${config.color}">${config.name}海克斯</span>
        </div>
      </div>

      <div class="detail-section">
        <h3>📝 效果描述</h3>
        <p class="detail-desc">${description}</p>
      </div>

      ${synergyHeroes.length > 0 ? `
      <div class="detail-section">
        <h3>🎯 适配英雄</h3>
        <div class="detail-heroes">
          ${synergyHeroes.map(hero => `
            <div class="detail-hero-card">
              <div class="detail-hero-avatar">
                ${hero.iconId ? `<img src="${ICON_BASE_URL}${hero.iconId}.png" alt="${hero.name}">` : `<span class="placeholder">${hero.name.charAt(0)}</span>`}
              </div>
              <div class="detail-hero-name">${hero.name}</div>
              <div class="detail-hero-tags">${hero.tags.join(' ')}</div>
            </div>
          `).join('')}
        </div>
      </div>
      ` : ''}

      <div class="detail-section">
        <h3>💡 使用建议</h3>
        <p class="detail-tips">${this.getAugmentTips(augment)}</p>
      </div>
    `;

    this.elements.detailModal.style.display = 'flex';
  }

  // 显示英雄详情
  showHeroDetail(heroId) {
    const hero = champions.find(c => c.id === heroId);
    if (!hero) return;

    // 查找推荐的海克斯
    const recommendedAugments = this.findRecommendedAugments(hero);

    this.elements.detailBody.innerHTML = `
      <div class="detail-header">
        <div class="detail-icon-wrapper" style="border-color: #00d4ff">
          <div class="detail-hero-large">
            ${hero.iconId ? `<img src="${ICON_BASE_URL}${hero.iconId}.png" alt="${hero.name}">` : `<span class="placeholder">${hero.name.charAt(0)}</span>`}
          </div>
        </div>
        <div class="detail-title">
          <h2>${hero.name}</h2>
          <div class="detail-hero-info">
            <span class="detail-hero-role">${hero.tags.join(' / ')}</span>
            ${hero.winrate ? `<span class="detail-hero-winrate">胜率 ${hero.winrate}%</span>` : ''}
          </div>
        </div>
      </div>

      <div class="detail-section">
        <h3>🎯 推荐海克斯（悬停查看详情）</h3>
        <div class="detail-augments">
          ${recommendedAugments.map(augment => {
            const config = tierConfig[augment.tier];
            let desc = augment.description || '暂无描述';
            desc = desc.replace(/海克斯大乱斗强化符文攻略\s*-\s*/, '');
            desc = desc.replace(/胜率：[\d.]+%，登场率：[\d.]+%。/, '');
            desc = desc.replace(/了解哪些英雄最适配该强化符文。/, '');
            // 截断过长的描述
            if (desc.length > 150) {
              desc = desc.substring(0, 150) + '...';
            }
            return `
              <div class="detail-augment-card tooltip-wrapper" data-desc="${desc.replace(/"/g, '&quot;')}" style="--tier-color: ${config.color}">
                <div class="detail-augment-icon" style="border-color: ${config.color}">
                  ${augment.image ? `<img src="${augment.image}" alt="${augment.name}">` : `<span>${augment.name.charAt(0)}</span>`}
                </div>
                <div class="detail-augment-info">
                  <div class="detail-augment-name" style="color: ${config.color}">${augment.name}</div>
                  <div class="detail-augment-tier">${config.name}</div>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>

      <div class="detail-section">
        <h3>💡 玩法建议</h3>
        <p class="detail-tips">${this.getHeroTips(hero)}</p>
      </div>
    `;

    // 绑定 tooltip 事件
    this.bindTooltips();

    this.elements.detailModal.style.display = 'flex';
  }

  // 隐藏详情
  hideDetail() {
    this.elements.detailModal.style.display = 'none';
    this.removeTooltips();
  }

  // 绑定 tooltip 事件
  bindTooltips() {
    // 移除现有的 tooltip
    this.removeTooltips();

    // 为每个 tooltip-wrapper 添加事件
    document.querySelectorAll('.tooltip-wrapper').forEach(wrapper => {
      const desc = wrapper.dataset.desc;
      if (!desc) return;

      const showTooltip = (e) => {
        const tooltip = document.createElement('div');
        tooltip.className = 'tooltip';
        tooltip.textContent = desc;
        document.body.appendChild(tooltip);

        // 计算位置
        const rect = wrapper.getBoundingClientRect();
        const tooltipRect = tooltip.getBoundingClientRect();

        let left = rect.left + rect.width / 2 - tooltipRect.width / 2;
        let top = rect.top - tooltipRect.height - 10;

        // 防止超出左边
        if (left < 10) left = 10;
        // 防止超出右边
        if (left + tooltipRect.width > window.innerWidth - 10) {
          left = window.innerWidth - tooltipRect.width - 10;
        }
        // 防止超出顶部，改为显示在下方
        if (top < 10) {
          top = rect.bottom + 10;
        }

        tooltip.style.left = left + 'px';
        tooltip.style.top = top + 'px';
        tooltip.style.opacity = '1';
        tooltip.style.visibility = 'visible';

        wrapper._tooltip = tooltip;
      };

      const hideTooltip = () => {
        if (wrapper._tooltip) {
          wrapper._tooltip.remove();
          wrapper._tooltip = null;
        }
      };

      wrapper.addEventListener('mouseenter', showTooltip);
      wrapper.addEventListener('mouseleave', hideTooltip);

      // 保存引用以便清理
      if (!this._tooltipHandlers) this._tooltipHandlers = [];
      this._tooltipHandlers.push({ wrapper, showTooltip, hideTooltip });
    });
  }

  // 移除 tooltips
  removeTooltips() {
    document.querySelectorAll('.tooltip').forEach(t => t.remove());
    if (this._tooltipHandlers) {
      this._tooltipHandlers.forEach(({ wrapper, showTooltip, hideTooltip }) => {
        wrapper.removeEventListener('mouseenter', showTooltip);
        wrapper.removeEventListener('mouseleave', hideTooltip);
      });
      this._tooltipHandlers = [];
    }
  }

  // 查找适配英雄
  findSynergyHeroes(augment) {
    const desc = (augment.description || '').toLowerCase();
    const name = augment.name;

    const keywords = {
      '技能': ['法师', '辅助'],
      '法术': ['法师'],
      '攻击': ['射手', '战士'],
      '攻速': ['射手'],
      '暴击': ['射手', '战士'],
      '治疗': ['辅助', '坦克'],
      '护盾': ['辅助', '坦克'],
      '生命': ['坦克', '战士'],
      '法力': ['法师'],
      '冷却': ['法师', '辅助'],
      '移速': ['刺客', '战士'],
      '穿透': ['刺客', '战士'],
      '吸血': ['战士', '射手'],
      '大招': ['法师', '刺客']
    };

    let matchTags = [];
    for (const [keyword, tags] of Object.entries(keywords)) {
      if (desc.includes(keyword) || name.includes(keyword)) {
        matchTags.push(...tags);
      }
    }

    matchTags = [...new Set(matchTags)];

    if (matchTags.length === 0) {
      return champions.filter(c => c.winrate && c.winrate > 50).slice(0, 6);
    }

    return champions.filter(c =>
      c.tags.some(tag => matchTags.includes(tag))
    ).slice(0, 8);
  }

  // 查找推荐海克斯
  findRecommendedAugments(hero) {
    const tagStr = hero.tags.join(' ');

    return hexAugments.filter(augment => {
      const desc = (augment.description || '').toLowerCase();
      const name = augment.name;

      if (tagStr.includes('法师') && (desc.includes('技能') || desc.includes('法术') || desc.includes('冷却'))) {
        return true;
      }
      if (tagStr.includes('射手') && (desc.includes('攻击') || desc.includes('攻速') || desc.includes('暴击'))) {
        return true;
      }
      if (tagStr.includes('战士') && (desc.includes('吸血') || desc.includes('生命') || desc.includes('攻击'))) {
        return true;
      }
      if (tagStr.includes('坦克') && (desc.includes('生命') || desc.includes('护甲') || desc.includes('护盾'))) {
        return true;
      }
      if (tagStr.includes('辅助') && (desc.includes('治疗') || desc.includes('护盾') || desc.includes('冷却'))) {
        return true;
      }
      if (tagStr.includes('刺客') && (desc.includes('穿透') || desc.includes('移速') || desc.includes('暴击'))) {
        return true;
      }

      return false;
    }).slice(0, 8);
  }

  // 获取海克斯使用建议
  getAugmentTips(augment) {
    const tier = augment.tier;
    const desc = augment.description || '';

    let tips = '';

    if (tier === 'prismatic') {
      tips += '棱彩海克斯是最稀有的，通常提供强大的独特效果。';
    } else if (tier === 'gold') {
      tips += '金色海克斯提供中等强度的增益，性价比较高。';
    } else {
      tips += '银色海克斯是基础增益，但叠加效果也很可观。';
    }

    if (desc.includes('技能急速') || desc.includes('冷却')) {
      tips += ' 适合依赖技能的英雄，如法师和辅助。';
    }
    if (desc.includes('攻击') || desc.includes('攻速')) {
      tips += ' 适合物理输出英雄，如射手和战士。';
    }
    if (desc.includes('生命') || desc.includes('护甲') || desc.includes('魔抗')) {
      tips += ' 适合前排坦克和战士。';
    }

    return tips;
  }

  // 获取英雄玩法建议
  getHeroTips(hero) {
    const tags = hero.tags;

    if (tags.includes('法师')) {
      return '法师英雄通常依赖技能输出，优先选择增加技能急速、法术强度的海克斯。注意站位，保持安全距离输出。';
    }
    if (tags.includes('射手')) {
      return '射手是团队的主要物理输出，优先选择增加攻击力、攻速、暴击的海克斯。注意走位，避免被集火。';
    }
    if (tags.includes('战士')) {
      return '战士英雄兼具输出和生存能力，可以选择吸血、生命值等海克斯。适合在前排承伤的同时输出。';
    }
    if (tags.includes('坦克')) {
      return '坦克的主要职责是承伤和控制，优先选择增加生命值、护甲、魔抗的海克斯。保护后排输出。';
    }
    if (tags.includes('辅助')) {
      return '辅助英雄提供治疗、护盾和控制，优先选择增加治疗效果、冷却缩减的海克斯。保护队友是首要任务。';
    }
    if (tags.includes('刺客')) {
      return '刺客英雄擅长切入后排秒杀脆皮，优先选择穿透、移速、暴击的海克斯。找准时机切入是关键。';
    }

    return '根据英雄特性和阵容需求选择合适的海克斯强化。';
  }
}

// 创建全局实例
const codexManager = new CodexManager();
