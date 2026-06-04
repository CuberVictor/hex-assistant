# 海克斯大乱斗辅助助手 - 实现计划

## Context

用户想要创建一个英雄联盟海克斯大乱斗（ARAM）辅助助手网页应用。该应用允许玩家选择英雄和已拥有的海克斯强化，然后通过 AI 智能体推荐最佳的海克斯选择。

**当前状态：** 项目从零开始，目录为空
**技术栈：** 纯前端 (HTML/CSS/JS)
**推荐逻辑：** AI API 调用（Claude/GPT）

---

## 项目结构

```
hks/
├── index.html              # 主页面
├── css/
│   └── style.css          # 样式文件
├── js/
│   ├── app.js             # 主应用逻辑
│   ├── data.js            # 英雄和海克斯数据
│   ├── ui.js              # UI 交互逻辑
│   └── ai.js              # AI API 调用
├── images/
│   └── champions/         # 英雄头像（可选）
└── README.md              # 项目说明
```

---

## 功能模块

### 1. 数据层 (data.js)

**英雄数据结构：**
```javascript
const champions = [
  {
    id: 1,
    name: "寒冰射手",
    nameEn: "Ashe",
    tags: ["射手", "辅助"],
    tier: "A",
    aramRating: 75
  },
  // ... 更多英雄
]
```

**海克斯强化数据结构：**
```javascript
const hexAugments = [
  {
    id: 1,
    name: "风暴聚集",
    description: "每10秒获得自适应之力",
    tier: "silver",      // silver, gold, prismatic
    tags: ["输出", "后期"],
    synergy: ["射手", "法师"]
  },
  // ... 更多海克斯
]
```

**初始示例数据：**
- 20-30 个常用 ARAM 英雄
- 15-20 个海克斯强化（覆盖银色、金色、棱彩）

---

### 2. UI 界面 (index.html + style.css + ui.js)

**布局设计：**
```
┌─────────────────────────────────────────────────────┐
│                海克斯大乱斗助手                        │
│  [设置 API Key] [设置 Bot ID]                        │
├─────────────────────────────────────────────────────┤
│  ┌─────────────────┐  ┌─────────────────────────┐  │
│  │   英雄选择区域    │  │    海克斯选择区域         │  │
│  │  [网格展示头像]   │  │   [卡片展示海克斯]       │  │
│  │  点击选择英雄     │  │   点击选择已拥有海克斯    │  │
│  └─────────────────┘  └─────────────────────────┘  │
├─────────────────────────────────────────────────────┤
│              [ 获取推荐 ] 按钮                        │
├─────────────────────────────────────────────────────┤
│  ┌───────────────────────────────────────────────┐  │
│  │              推荐结果区域                       │  │
│  │  - 推荐的海克斯及理由                          │  │
│  │  - 备选方案                                   │  │
│  │  - 搭配建议                                   │  │
│  └───────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────┘
```

**交互流程：**
1. 用户在英雄网格中点击选择当前英雄
2. 用户在海克斯列表中勾选已拥有的海克斯选项
3. 点击"获取推荐"按钮
4. 显示 AI 推荐结果（包含理由）

---

### 3. AI 推荐逻辑 (ai.js)

**Coze API 调用方式：**
```javascript
async function getRecommendation(hero, availableAugments) {
  const prompt = `
    你是一个英雄联盟海克斯大乱斗专家。
    当前英雄：${hero.name}（${hero.tags.join('、')}）
    可选海克斯：${availableAugments.map(a => a.name + '-' + a.description).join('\n')}
    
    请推荐最佳的3个海克斯选择，并说明理由。
    返回 JSON 格式：
    {
      "recommendations": [
        {"augment": "海克斯名", "reason": "推荐理由", "rank": 1},
        ...
      ]
    }
  `
  
  // 调用 Coze API
  const response = await callCozeAPI(prompt)
  return JSON.parse(response)
}
```

**Coze API 配置：**
- API 端点：`https://api.coze.cn/v3/chat`（国内版）
- 认证方式：Bearer Token（API Key）
- 用户需要在页面输入自己的 Coze API Key 和 Bot ID

---

### 4. 主应用逻辑 (app.js)

**状态管理：**
```javascript
const state = {
  selectedHero: null,
  selectedAugments: [],
  recommendation: null,
  isLoading: false
}
```

**核心函数：**
- `selectHero(heroId)` - 选择英雄
- `toggleAugment(augmentId)` - 切换海克斯选择
- `getRecommendation()` - 获取 AI 推荐
- `renderRecommendation()` - 渲染推荐结果

---

## 实现步骤

### 第一阶段：基础框架（1-2小时）

1. **创建项目结构**
   - 创建 `index.html` 基础 HTML 结构
   - 创建 `css/style.css` 基础样式
   - 创建 `js/data.js` 示例数据

2. **英雄选择界面**
   - 网格布局展示英雄头像
   - 点击高亮选中状态
   - 响应式设计

3. **海克斯选择界面**
   - 卡片布局展示海克斯
   - 按品质分组（银色/金色/棱彩）
   - 多选功能

### 第二阶段：AI 集成（1-2小时）

4. **AI API 集成**
   - 创建 `js/ai.js` API 调用模块
   - 实现 API Key 输入界面
   - 处理 API 响应和错误

5. **推荐结果展示**
   - 渲染推荐列表
   - 显示推荐理由
   - 加载状态动画

### 第三阶段：优化完善（1小时）

6. **UI/UX 优化**
   - 添加动画效果
   - 优化移动端适配
   - 添加使用说明

7. **数据完善**
   - 补充更多英雄数据
   - 补充更多海克斯数据
   - 优化数据结构

---

## 关键技术点

### 1. 纯前端 API 调用
```javascript
// Claude API 调用示例
async function callClaudeAPI(prompt, apiKey) {
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify({
      model: 'claude-3-sonnet-20240229',
      max_tokens: 1024,
      messages: [{ role: 'user', content: prompt }]
    })
  })
  return response.json()
}
```

### 2. 本地存储
```javascript
// 保存 API Key 和历史记录
localStorage.setItem('apiKey', key)
localStorage.setItem('history', JSON.stringify(history))
```

### 3. 响应式设计
```css
.hero-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
  gap: 10px;
}

@media (max-width: 768px) {
  .hero-grid {
    grid-template-columns: repeat(auto-fill, minmax(60px, 1fr));
  }
}
```

---

## 后续扩展

- [ ] 添加英雄头像图片
- [ ] 支持历史推荐记录
- [ ] 添加胜率数据统计
- [ ] 支持团队阵容分析
- [ ] 添加海克斯获取概率显示
- [ ] 支持导出推荐结果

---

## 验证方式

1. **功能验证**
   - 英雄选择：点击英雄能正确选中/取消
   - 海克斯选择：能多选海克斯选项
   - AI 推荐：能正确调用 API 并显示结果

2. **UI 验证**
   - 桌面端：1920x1080 正常显示
   - 移动端：375px 宽度正常适配
   - 交互反馈：选中状态、加载动画正常

3. **API 验证**
   - API Key 输入和保存正常
   - API 调用错误有友好提示
   - 推荐结果格式正确

---

## 需要用户确认

1. **Coze API 配置**：请提供以下信息
   - Coze API 端点（国内版: https://api.coze.cn 或海外版: https://api.coze.com）
   - Bot ID（你的智能体 ID）
   - API Key 获取方式

2. **数据来源**：后续如何完善英雄和海克斯数据？
   - 手动整理
   - 从 wiki 爬取
   - 使用第三方 API

3. **英雄头像**：是否需要显示英雄头像图片？
   - 需要（需要图片资源）
   - 先用文字代替
