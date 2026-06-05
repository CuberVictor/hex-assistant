// 性格测试数据（内嵌，避免 fetch 依赖）
const PERSONALITY_DATA = {
  "meta": { "slug": "aram-mayhem-bti", "title": "海克斯大乱斗人格测试", "shortTitle": "斗BTI", "description": "16个乱斗名场面，测出你的斗B人格。结果主打一个可截图、可转发、可互相伤害。", "resultCount": 18, "questionCount": 16 },
  "statLabels": { "chaos": "抽象", "greed": "贪心", "teamwork": "团队", "mechanics": "操作" },
  "results": [
    { "id": "prismatic-gambler", "code": "PRGM", "name": "棱彩赌狗型", "tagline": "棱彩不赌，人生白过。", "description": "你不是在选强化符文，你是在和命运掰手腕。适配不适配先放一边，爽不爽才是版本答案。", "strength": "爆发力和节目效果拉满。", "weakness": "容易把优势赌成教学素材。", "stats": { "chaos": 96, "greed": 98, "teamwork": 42, "mechanics": 70 } },
    { "id": "king-me-backdoor", "code": "KMBK", "name": "尊我为王偷门型", "tagline": "门在对面，王在路上。", "description": "你眼里没有团战，只有传送门、炮车和一条通往结算动画的邪路。", "strength": "嗅觉离谱，终局能力强。", "weakness": "队友经常不知道你到底在赢还是在送。", "stats": { "chaos": 88, "greed": 86, "teamwork": 48, "mechanics": 74 } },
    { "id": "snowball-engager", "code": "SNBL", "name": "死丢子开团型", "tagline": "雪球中了，人生就不能回头。", "description": "二段不是技能，是宣誓。你开得好叫果断，开坏了叫素材。", "strength": "节奏启动极快。", "weakness": "刹车系统基本是摆设。", "stats": { "chaos": 100, "greed": 62, "teamwork": 76, "mechanics": 64 } },
    { "id": "fountain-loop", "code": "FNTN", "name": "泉水复读机型", "tagline": "死亡、购物、上线，人生三件套。", "description": "你不是没成长，你是在用复活时间思考人生。每次回线都像新开一把。", "strength": "心态恢复快。", "weakness": "经济曲线像心电图。", "stats": { "chaos": 82, "greed": 58, "teamwork": 50, "mechanics": 44 } },
    { "id": "item-accountant", "code": "ITEM", "name": "神装会计型", "tagline": "每1000金币都有它的去处。", "description": "你能在开团前算出三种出装收益，也能在算完时发现队友已经团灭。", "strength": "理解深，科研强。", "weakness": "偶尔输给读条和犹豫。", "stats": { "chaos": 40, "greed": 82, "teamwork": 58, "mechanics": 72 } },
    { "id": "urf-hallucination", "code": "URFF", "name": "无限火力幻觉型", "tagline": "冷却是假的，按钮是真的。", "description": "你玩任何模式都像无限火力。技能好了要按，没好也要按。", "strength": "压迫感强，手速积极。", "weakness": "蓝量和位置感经常抗议。", "stats": { "chaos": 92, "greed": 70, "teamwork": 56, "mechanics": 80 } },
    { "id": "pressure-cooker", "code": "PRSR", "name": "队友压力锅型", "tagline": "不说话，但气压很低。", "description": "你很少打字，但每个撤退ping都带着人生阅历。", "strength": "局势判断敏锐。", "weakness": "容易被四个快乐人包围。", "stats": { "chaos": 36, "greed": 38, "teamwork": 78, "mechanics": 62 } },
    { "id": "kda-cleaner", "code": "KDAC", "name": "KDA保洁员型", "tagline": "不制造混乱，只负责收拾。", "description": "你总能出现在最后一下附近。不是抢，是命运安排。", "strength": "残局处理稳定。", "weakness": "开局存在感偏低。", "stats": { "chaos": 52, "greed": 74, "teamwork": 54, "mechanics": 76 } },
    { "id": "bush-goblin", "code": "BUSH", "name": "草丛伏地魔型", "tagline": "草丛是第二条命。", "description": "你的地图只有两种地形：草里和去草里的路上。", "strength": "偷袭成功率高。", "weakness": "没草的时候安全感掉线。", "stats": { "chaos": 74, "greed": 66, "teamwork": 50, "mechanics": 72 } },
    { "id": "mark-lottery", "code": "MARK", "name": "雪球彩票型", "tagline": "每个雪球都是一张刮刮乐。", "description": "你不是命中率高，你是投得多。中奖那一把能吹三天。", "strength": "机会创造能力强。", "weakness": "亏损样本也很多。", "stats": { "chaos": 94, "greed": 72, "teamwork": 66, "mechanics": 58 } },
    { "id": "one-hp-forward", "code": "ONEH", "name": "残血不回头型", "tagline": "血条越短，胆子越长。", "description": "别人残血回头，你残血上头。你的血量不是限制，是氛围灯。", "strength": "极限操作欲望强。", "weakness": "经常把观众也吓死。", "stats": { "chaos": 90, "greed": 78, "teamwork": 40, "mechanics": 82 } },
    { "id": "five-one-life", "code": "FIVE", "name": "五人一条命型", "tagline": "一个人进，五个人埋。", "description": "你信奉乱斗共同体。队友开了就是大家开了，团灭也要整整齐齐。", "strength": "跟团意志坚定。", "weakness": "容易把坏决定执行得很完美。", "stats": { "chaos": 84, "greed": 44, "teamwork": 96, "mechanics": 60 } },
    { "id": "modifier-victim", "code": "MODS", "name": "Buff受害者型", "tagline": "不是我菜，是隐藏数值。", "description": "你熟读增减伤，永远能从系统里找到一条合理解释。", "strength": "数据敏感，懂版本。", "weakness": "复盘有时像法庭辩护。", "stats": { "chaos": 34, "greed": 58, "teamwork": 46, "mechanics": 68 } },
    { "id": "relic-guard", "code": "RELC", "name": "药包保安型", "tagline": "血包刷新，就是集合号。", "description": "你对血包刷新时间的尊重超过大部分人对兵线的尊重。", "strength": "资源控制强。", "weakness": "容易为一个血包打出世界赛强度。", "stats": { "chaos": 58, "greed": 70, "teamwork": 76, "mechanics": 54 } },
    { "id": "question-mark-damage", "code": "PING", "name": "问号伤害型", "tagline": "精神伤害也是伤害。", "description": "你相信最强的输出不是技能，是一个恰到好处的问号。", "strength": "心理战拉满。", "weakness": "容易把队友也打到。", "stats": { "chaos": 78, "greed": 50, "teamwork": 36, "mechanics": 64 } },
    { "id": "prismatic-preacher", "code": "PRCH", "name": "棱彩传教士型", "tagline": "万物皆可配我那套。", "description": "你有一套信仰构筑，并且准备把它安利给全队。", "strength": "套路熟练度极高。", "weakness": "版本变了也不太听劝。", "stats": { "chaos": 62, "greed": 84, "teamwork": 60, "mechanics": 78 } },
    { "id": "wave-civil-servant", "code": "WAVE", "name": "清兵公务员型", "tagline": "不追梦，只上班。", "description": "你是嚎哭深渊基层工作者。兵线来了，情绪就稳定了。", "strength": "守线稳，节奏不崩。", "weakness": "精彩镜头比较少。", "stats": { "chaos": 28, "greed": 42, "teamwork": 82, "mechanics": 66 } },
    { "id": "last-fight-liar", "code": "LAST", "name": "最后一波骗子型", "tagline": "最后一波，说了六次。", "description": "你说最后一波只是情绪表达，不是事实陈述。第七波才是真正的最后一波。", "strength": "韧性强，永不下班。", "weakness": "队友可能已经点外卖了。", "stats": { "chaos": 70, "greed": 54, "teamwork": 68, "mechanics": 52 } }
  ],
  "questions": [
    { "id": "a1", "text": "第一轮强化刷出来，你最像？", "options": [
      { "id": "a", "text": "看到棱彩眼睛发光，不管适不适配先拿", "weights": ["prismatic-gambler", "prismatic-preacher"] },
      { "id": "b", "text": "先看胜率，再看描述，最后时间到了乱点", "weights": ["item-accountant", "modifier-victim"] },
      { "id": "c", "text": "拿最快乐的，输了也是节目效果", "weights": ["urf-hallucination", "question-mark-damage"] },
      { "id": "d", "text": "我不选，我等队友喷我", "weights": ["pressure-cooker", "last-fight-liar"] }
    ]},
    { "id": "a2", "text": "雪球中了对面C位，你会？", "options": [
      { "id": "a", "text": "进，死也要死在路上", "weights": ["snowball-engager", "one-hp-forward"] },
      { "id": "b", "text": "看队友位置，假装很理性", "weights": ["five-one-life", "pressure-cooker"] },
      { "id": "c", "text": "不进，但疯狂ping队友上", "weights": ["question-mark-damage", "pressure-cooker"] },
      { "id": "d", "text": "二段过去发现是五个人", "weights": ["mark-lottery", "fountain-loop"] }
    ]},
    { "id": "a3", "text": "对面门口有传送门/炮车机会，你会？", "options": [
      { "id": "a", "text": "尊我为王启动，今天就偷", "weights": ["king-me-backdoor", "prismatic-gambler"] },
      { "id": "b", "text": "算了算了，太危险了", "weights": ["wave-civil-servant", "pressure-cooker"] },
      { "id": "c", "text": "我去卖，你们拆", "weights": ["king-me-backdoor", "five-one-life"] },
      { "id": "d", "text": "我只是路过，怎么进泉水了", "weights": ["fountain-loop", "last-fight-liar"] }
    ]},
    { "id": "a4", "text": "队友残血不吃血包，你的反应？", "options": [
      { "id": "a", "text": "我吃，我不装", "weights": ["relic-guard", "kda-cleaner"] },
      { "id": "b", "text": "ping到他怀疑人生", "weights": ["question-mark-damage", "pressure-cooker"] },
      { "id": "c", "text": "让给C位，然后C位死了", "weights": ["five-one-life", "wave-civil-servant"] },
      { "id": "d", "text": "血包？我眼里只有人头", "weights": ["one-hp-forward", "snowball-engager"] }
    ]},
    { "id": "a5", "text": "你拿到离谱棱彩之后？", "options": [
      { "id": "a", "text": "这把不是我C就是我送", "weights": ["prismatic-gambler", "urf-hallucination"] },
      { "id": "b", "text": "立刻改出装，开始科研", "weights": ["item-accountant", "prismatic-preacher"] },
      { "id": "c", "text": "截图发群，游戏先放一边", "weights": ["question-mark-damage", "last-fight-liar"] },
      { "id": "d", "text": "装作很淡定，其实手在抖", "weights": ["kda-cleaner", "one-hp-forward"] }
    ]},
    { "id": "a6", "text": "一波团输了，最真实的原因是？", "options": [
      { "id": "a", "text": "队友没跟我", "weights": ["snowball-engager", "question-mark-damage"] },
      { "id": "b", "text": "我没等队友", "weights": ["one-hp-forward", "fountain-loop"] },
      { "id": "c", "text": "对面太恶心", "weights": ["modifier-victim", "pressure-cooker"] },
      { "id": "d", "text": "我们阵容从出生就输了", "weights": ["modifier-victim", "last-fight-liar"] }
    ]},
    { "id": "a7", "text": "你看到对面五个残血？", "options": [
      { "id": "a", "text": "闪现上去收，全收不了也要上", "weights": ["one-hp-forward", "kda-cleaner"] },
      { "id": "b", "text": "等技能CD，做个正常人", "weights": ["wave-civil-servant", "item-accountant"] },
      { "id": "c", "text": "ping队友，自己后撤", "weights": ["pressure-cooker", "question-mark-damage"] },
      { "id": "d", "text": "被反杀后说「差一点」", "weights": ["mark-lottery", "fountain-loop"] }
    ]},
    { "id": "a8", "text": "大乱斗你最不能忍的是？", "options": [
      { "id": "a", "text": "有人不打架", "weights": ["snowball-engager", "urf-hallucination"] },
      { "id": "b", "text": "有人不清兵", "weights": ["wave-civil-servant", "item-accountant"] },
      { "id": "c", "text": "有人乱吃血包", "weights": ["relic-guard", "pressure-cooker"] },
      { "id": "d", "text": "有人玩得太像排位", "weights": ["question-mark-damage", "prismatic-gambler"] }
    ]},
    { "id": "a9", "text": "你拿坦克时的内心？", "options": [
      { "id": "a", "text": "我是队伍的爹", "weights": ["five-one-life", "relic-guard"] },
      { "id": "b", "text": "我是队伍的命", "weights": ["pressure-cooker", "wave-civil-servant"] },
      { "id": "c", "text": "我是队伍的开团按钮", "weights": ["snowball-engager", "five-one-life"] },
      { "id": "d", "text": "我是队伍的免费视野", "weights": ["fountain-loop", "bush-goblin"] }
    ]},
    { "id": "a10", "text": "你拿ADC时的内心？", "options": [
      { "id": "a", "text": "四保一，快来保我", "weights": ["kda-cleaner", "pressure-cooker"] },
      { "id": "b", "text": "别管我，我会偷输出", "weights": ["bush-goblin", "kda-cleaner"] },
      { "id": "c", "text": "我走位很好，直到被雪球中", "weights": ["mark-lottery", "fountain-loop"] },
      { "id": "d", "text": "我只是想活到三件套", "weights": ["item-accountant", "wave-civil-servant"] }
    ]},
    { "id": "a11", "text": "对面有恶心poke阵容，你会？", "options": [
      { "id": "a", "text": "强开，不能让他们上班这么舒服", "weights": ["snowball-engager", "five-one-life"] },
      { "id": "b", "text": "躲小兵后面当人质", "weights": ["wave-civil-servant", "pressure-cooker"] },
      { "id": "c", "text": "出魔抗，然后继续被打", "weights": ["modifier-victim", "item-accountant"] },
      { "id": "d", "text": "投降按钮是我的第六件装备", "weights": ["last-fight-liar", "fountain-loop"] }
    ]},
    { "id": "a12", "text": "看到「问号能打伤害」这种东西？", "options": [
      { "id": "a", "text": "太艺术了，必须玩", "weights": ["question-mark-damage", "prismatic-preacher"] },
      { "id": "b", "text": "这游戏终于疯了", "weights": ["urf-hallucination", "modifier-victim"] },
      { "id": "c", "text": "我先看看数值", "weights": ["item-accountant", "modifier-victim"] },
      { "id": "d", "text": "我已经准备好被恶心了", "weights": ["pressure-cooker", "relic-guard"] }
    ]},
    { "id": "a13", "text": "你最像哪种残局？", "options": [
      { "id": "a", "text": "1v4还想操作", "weights": ["one-hp-forward", "urf-hallucination"] },
      { "id": "b", "text": "残血守塔守出感情", "weights": ["wave-civil-servant", "relic-guard"] },
      { "id": "c", "text": "偷门差一刀", "weights": ["king-me-backdoor", "last-fight-liar"] },
      { "id": "d", "text": "活着但没用", "weights": ["kda-cleaner", "pressure-cooker"] }
    ]},
    { "id": "a14", "text": "队友说「最后一波」？", "options": [
      { "id": "a", "text": "信了，结果还有五波", "weights": ["last-fight-liar", "fountain-loop"] },
      { "id": "b", "text": "不说话，买装备", "weights": ["item-accountant", "wave-civil-servant"] },
      { "id": "c", "text": "我先开，省得纠结", "weights": ["snowball-engager", "five-one-life"] },
      { "id": "d", "text": "最后一波？我刚复活", "weights": ["fountain-loop", "mark-lottery"] }
    ]},
    { "id": "a15", "text": "你最常被朋友怎么评价？", "options": [
      { "id": "a", "text": "「你是真敢上」", "weights": ["snowball-engager", "one-hp-forward"] },
      { "id": "b", "text": "「你是真能苟」", "weights": ["kda-cleaner", "bush-goblin"] },
      { "id": "c", "text": "「你是真会偷」", "weights": ["king-me-backdoor", "bush-goblin"] },
      { "id": "d", "text": "「你是真抽象」", "weights": ["question-mark-damage", "prismatic-gambler"] }
    ]},
    { "id": "a16", "text": "你的大乱斗人生信条是？", "options": [
      { "id": "a", "text": "棱彩不赌，人生白过", "weights": ["prismatic-gambler", "prismatic-preacher"] },
      { "id": "b", "text": "能偷就偷，不能偷就演", "weights": ["king-me-backdoor", "last-fight-liar"] },
      { "id": "c", "text": "死可以，兵线不能断", "weights": ["wave-civil-servant", "relic-guard"] },
      { "id": "d", "text": "快乐第一，结算第二", "weights": ["urf-hallucination", "mark-lottery"] }
    ]}
  ]
};

// 性格测试逻辑
class PersonalityTest {
  constructor() {
    this.data = PERSONALITY_DATA;
    this.state = {
      phase: 'home',     // home | quiz | result
      currentQuestion: 0,
      answers: {},
      result: null
    };
    this.elements = {};
  }

  // 初始化
  init() {
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
      const card = document.createElement('button');
      card.type = 'button';
      card.className = 'flex flex-col items-center gap-1.5 rounded-lg border border-border/30 bg-card/60 p-2 transition hover:border-rarity-gold/50 hover:bg-card/90 focus:outline-none focus:ring-2 focus:ring-rarity-gold/40 cursor-pointer';
      card.innerHTML = `
        <img src="images/personality/${r.id}.webp" alt="${r.name}" class="w-full aspect-square rounded-md object-cover" loading="lazy" decoding="async">
        <span class="text-[11px] font-medium text-muted-foreground leading-tight text-center line-clamp-2">${r.name}</span>
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
    this.elements.modal.style.display = 'flex';
  }

  // 关闭弹窗
  closeModal() {
    this.elements.modal.style.display = 'none';
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
      btn.className = 'w-full text-left rounded-lg border border-border/40 bg-card/80 p-4 transition-all hover:bg-card hover:border-rarity-gold/50 focus:outline-none focus:ring-2 focus:ring-rarity-gold/30 flex items-start gap-3 cursor-pointer';
      btn.innerHTML = `
        <span class="inline-flex items-center justify-center w-7 h-7 rounded-md bg-rarity-gold/20 text-rarity-gold text-xs font-bold shrink-0 mt-0.5">${opt.id.toUpperCase()}</span>
        <span class="text-sm md:text-base text-foreground">${opt.text}</span>
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
      item.className = 'grid gap-1';
      item.innerHTML = `
        <div class="flex items-center justify-between">
          <span class="text-sm font-medium">${statLabels[key] || key}</span>
          <span class="text-sm text-rarity-gold font-bold">${value}</span>
        </div>
        <div class="h-2 w-full rounded-full bg-secondary overflow-hidden">
          <div class="h-full rounded-full bg-primary transition-all duration-500" style="width: 0%"></div>
        </div>
      `;
      this.elements.statsGrid.appendChild(item);

      // 动画：延迟设置宽度
      const fillBar = item.lastElementChild.firstElementChild;
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          fillBar.style.width = `${value}%`;
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
