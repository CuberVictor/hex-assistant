// 性格测试逻辑

class PersonalityTest {
  constructor() {
    this.data = null;
    this.state = {
      phase: 'home',     // home | quiz | result
      currentQuestion: 0,
      answers: {},
      result: null
    };
    this.elements = {};
  }

  // 初始化
  async init() {
    // 加载数据
    try {
      const resp = await fetch('personality_data.json');
      this.data = await resp.json();
    } catch (e) {
      console.error('加载性格测试数据失败:', e);
      return;
    }

    // 缓存 DOM 元素
    this.elements = {
      homeView: document.getElementById('personality-home'),
      quizView: document.getElementById('personality-quiz'),
      resultView: document.getElementById('personality-result'),
      startBtn: document.getElementById('personality-start-btn'),
      previewGrid: document.getElementById('personality-preview-grid'),
      progressFill: document.getElementById('personality-progress-fill'),
      progressText: document.getElementById('personality-progress-text'),
      questionText: document.getElementById('personality-question-text'),
      optionsContainer: document.getElementById('personality-options'),
      resultImage: document.getElementById('personality-result-img'),
      resultName: document.getElementById('personality-result-name'),
      resultTagline: document.getElementById('personality-result-tagline'),
      resultDesc: document.getElementById('personality-result-desc'),
      resultLabel: document.getElementById('personality-result-label'),
      statsGrid: document.getElementById('personality-stats-grid'),
      strengthPower: document.getElementById('personality-strength-power'),
      strengthRisk: document.getElementById('personality-strength-risk'),
      shareText: document.getElementById('personality-share-text'),
      shareBtn: document.getElementById('personality-share-btn'),
      copyBtn: document.getElementById('personality-copy-btn'),
      restartBtn: document.getElementById('personality-restart-btn'),
      modal: document.getElementById('personality-modal'),
      modalClose: document.getElementById('personality-modal-close'),
      modalTitle: document.getElementById('personality-modal-title'),
      modalDesc: document.getElementById('personality-modal-desc'),
      modalImage: document.getElementById('personality-modal-img')
    };

    this.renderPreviewGrid();
    this.bindEvents();
    this.showView('home');
  }

  // 绑定事件
  bindEvents() {
    this.elements.startBtn.addEventListener('click', () => this.startQuiz());
    this.elements.restartBtn.addEventListener('click', () => this.restart());
    this.elements.shareBtn.addEventListener('click', () => this.shareResult());
    this.elements.copyBtn.addEventListener('click', () => this.copyResult());
    this.elements.modalClose.addEventListener('click', () => this.closeModal());
    this.elements.modal.addEventListener('click', (e) => {
      if (e.target === this.elements.modal) this.closeModal();
    });
  }

  // 渲染首页人格预览网格
  renderPreviewGrid() {
    const grid = this.elements.previewGrid;
    grid.innerHTML = '';
    this.data.results.forEach(r => {
      const card = document.createElement('div');
      card.className = 'personality-preview-card';
      card.innerHTML = `
        <img src="images/personality/${r.id}.webp" alt="${r.name}" loading="lazy">
        <div class="personality-preview-name">${r.name}</div>
      `;
      card.addEventListener('click', () => this.showDetailModal(r));
      grid.appendChild(card);
    });
  }

  // 显示详情弹窗
  showDetailModal(result) {
    this.elements.modalTitle.textContent = result.name;
    this.elements.modalDesc.textContent = result.tagline + '\n' + result.description;
    this.elements.modalImage.src = `images/personality/${result.id}.webp`;
    this.elements.modalImage.alt = result.name;
    this.elements.modal.classList.add('active');
  }

  // 关闭弹窗
  closeModal() {
    this.elements.modal.classList.remove('active');
  }

  // 切换视图
  showView(phase) {
    this.state.phase = phase;
    this.elements.homeView.style.display = phase === 'home' ? 'block' : 'none';
    this.elements.quizView.style.display = phase === 'quiz' ? 'block' : 'none';
    this.elements.resultView.style.display = phase === 'result' ? 'block' : 'none';
  }

  // 开始测试
  startQuiz() {
    this.state.currentQuestion = 0;
    this.state.answers = {};
    this.state.result = null;
    this.showView('quiz');
    this.renderQuestion();
  }

  // 渲染当前题目
  renderQuestion() {
    const q = this.data.questions[this.state.currentQuestion];
    const total = this.data.questions.length;
    const current = this.state.currentQuestion + 1;
    const percent = Math.round((this.state.currentQuestion / total) * 100);

    // 进度
    this.elements.progressFill.style.width = `${percent}%`;
    this.elements.progressText.textContent = `${current} / ${total}`;
    document.getElementById('personality-progress-percent').textContent = `${percent}%`;

    // 题目
    this.elements.questionText.textContent = q.text;

    // 选项
    const container = this.elements.optionsContainer;
    container.innerHTML = '';
    q.options.forEach(opt => {
      const btn = document.createElement('button');
      btn.className = 'personality-option';
      btn.innerHTML = `
        <span class="personality-option-label">${opt.id.toUpperCase()}</span>
        <span class="personality-option-text">${opt.text}</span>
      `;
      btn.addEventListener('click', () => this.selectOption(opt.id));
      container.appendChild(btn);
    });
  }

  // 选择选项
  selectOption(optionId) {
    const q = this.data.questions[this.state.currentQuestion];
    this.state.answers[q.id] = optionId;

    if (this.state.currentQuestion < this.data.questions.length - 1) {
      this.state.currentQuestion++;
      this.renderQuestion();
    } else {
      this.calculateResult();
    }
  }

  // 计算结果
  calculateResult() {
    const scoreMap = {};

    this.data.questions.forEach(q => {
      const answerId = this.state.answers[q.id];
      if (!answerId) return;
      const option = q.options.find(o => o.id === answerId);
      if (!option) return;

      option.weights.forEach((typeId, index) => {
        const score = index === 0 ? 2 : 1;
        scoreMap[typeId] = (scoreMap[typeId] || 0) + score;
      });
    });

    // 按分数排序，平分时按 results 数组顺序
    const resultIndexMap = {};
    this.data.results.forEach((r, i) => { resultIndexMap[r.id] = i; });

    const sorted = Object.entries(scoreMap).sort((a, b) => {
      if (b[1] !== a[1]) return b[1] - a[1];
      return (resultIndexMap[a[0]] ?? 999) - (resultIndexMap[b[0]] ?? 999);
    });

    const winnerId = sorted[0]?.[0] || this.data.results[0].id;
    this.state.result = this.data.results.find(r => r.id === winnerId);
    this.showResult();
  }

  // 显示结果
  showResult() {
    const r = this.state.result;
    if (!r) return;

    this.showView('result');

    // 结果图片
    this.elements.resultImage.src = `images/personality/${r.id}.webp`;
    this.elements.resultImage.alt = r.name;

    // 基本信息
    this.elements.resultLabel.textContent = `你的结果`;
    this.elements.resultName.textContent = `${r.code} ${r.name}`;
    this.elements.resultTagline.textContent = r.tagline;
    this.elements.resultDesc.textContent = r.description;

    // 四维属性条
    const statLabels = this.data.statLabels;
    this.elements.statsGrid.innerHTML = '';
    Object.entries(r.stats).forEach(([key, value]) => {
      const item = document.createElement('div');
      item.className = 'personality-stat-item';
      item.innerHTML = `
        <div class="personality-stat-header">
          <span class="personality-stat-name">${statLabels[key] || key}</span>
          <span class="personality-stat-value">${value}</span>
        </div>
        <div class="personality-stat-bar">
          <div class="personality-stat-fill" style="width: 0%"></div>
        </div>
      `;
      this.elements.statsGrid.appendChild(item);

      // 动画：延迟设置宽度
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          item.querySelector('.personality-stat-fill').style.width = `${value}%`;
        });
      });
    });

    // 优势 / 劣势
    this.elements.strengthPower.textContent = r.strength;
    this.elements.strengthRisk.textContent = r.weakness;

    // 分享文本
    this.elements.shareText.textContent = `我是 ${r.code} ${r.name}：${r.tagline}\n\n${r.description}`;
  }

  // 复制结果
  async copyResult() {
    const r = this.state.result;
    if (!r) return;
    const text = `我是 ${r.code} ${r.name}：${r.tagline}\n${r.description}\n\n来测测你是哪种海克斯大乱斗玩家 → ${window.location.href}`;
    try {
      await navigator.clipboard.writeText(text);
      const original = this.elements.copyBtn.textContent;
      this.elements.copyBtn.textContent = '✓ 已复制';
      setTimeout(() => { this.elements.copyBtn.textContent = original; }, 2000);
    } catch (e) {
      // fallback
      const ta = document.createElement('textarea');
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      const original = this.elements.copyBtn.textContent;
      this.elements.copyBtn.textContent = '✓ 已复制';
      setTimeout(() => { this.elements.copyBtn.textContent = original; }, 2000);
    }
  }

  // 分享结果
  async shareResult() {
    const r = this.state.result;
    if (!r) return;
    const text = `我是 ${r.code} ${r.name}：${r.tagline}`;
    const url = window.location.href;

    if (navigator.share) {
      try {
        await navigator.share({ title: '斗BTI - 海克斯大乱斗人格测试', text, url });
      } catch (e) {
        // 用户取消
      }
    } else {
      this.copyResult();
    }
  }

  // 重测
  restart() {
    this.startQuiz();
  }
}

// 创建全局实例并初始化
const personalityTest = new PersonalityTest();
document.addEventListener('DOMContentLoaded', () => {
  personalityTest.init();
});
