# 任务计划 (Task Planning Dashboard)

任务计划是一个现代化的任务管理应用，帮助用户规划、跟踪和完成各种任务和项目。应用采用禅意设计风格，专注于简洁与效率，为用户提供清晰直观的任务管理体验。

![Dashboard Screenshot](https://via.placeholder.com/800x450.png?text=任务计划)

## 功能特性

- 📋 任务计划卡片管理
- 🔍 焦点任务聚焦
- 📈 任务进度可视化
- 🔄 多阶段任务规划
- 🌐 多语言支持 (中文/英文)
- 📱 响应式设计，支持移动端与桌面端
- 🗑️ 回收站功能
- 🔔 操作反馈通知
- 💬 AI助手对话式任务规划
- 🔎 智能命令面板
- 📝 集成式工作空间

## 技术栈

- **前端框架**: React 18 + TypeScript
- **状态管理**: Zustand
- **样式**: Tailwind CSS + shadcn/ui
- **动画**: Framer Motion
- **国际化**: react-i18next
- **HTTP 客户端**: Axios
- **通知**: Sonner Toast
- **路由**: React Router v6

## 项目结构

```
/
├── public/                # 静态资源
└── src/                   # 源代码
    ├── components/        # UI组件
    │   ├── ui/            # 基础UI组件
    │   ├── features/      # 功能组件
    │   │   ├── dashboard/ # 工作台相关组件
    │   │   ├── ai-chat/   # AI助手组件
    │   │   ├── plan-tree/ # 计划树组件
    │   │   ├── workspace/ # 工作空间组件
    │   │   └── command/   # 命令面板组件
    │   ├── layouts/       # 布局组件
    │   └── icons/         # 图标组件
    ├── pages/             # 页面组件
    │   ├── dashboard-page.tsx # 仪表盘页面
    │   ├── plan-page.tsx      # 计划详情页面
    │   ├── workspace-page.tsx # 工作空间页面
    │   ├── clarify-page.tsx   # 任务澄清页面
    │   └── clarification-page.tsx # 澄清过程页面
    ├── lib/               # 工具函数和服务
    │   ├── api.ts         # API服务
    │   ├── store.ts       # 状态管理
    │   ├── i18n.ts        # 国际化
    │   └── utils.ts       # 通用工具函数
    └── types/             # TypeScript类型定义
```

## 主要页面

- **工作空间页面**: 集成式AI工作环境，可与AI助手交互，管理任务和文件
- **仪表盘页面**: 展示所有任务计划的概览，包括进度和优先级
- **计划详情页面**: 显示单个计划的详细信息和阶段
- **澄清页面**: 通过问答方式明确任务目标和需求

## 安装与运行

### 前提条件

- Node.js 14.0+
- npm 或 yarn

### 安装步骤

1. 克隆项目
```bash
git clone https://github.com/yourusername/task-planning-dashboard.git
cd task-planning-dashboard
```

2. 安装依赖
```bash
npm install
# 或
yarn install
```

3. 启动开发服务器
```bash
npm start
# 或
yarn start
```

4. 构建生产版本
```bash
npm run build
# 或
yarn build
```

## AI 功能集成

项目集成了AI助手功能，可以：

- 向AI提问关于任务管理的问题
- 获取任务拆解和优化建议
- 分析项目文件和代码
- 引用文件内容进行上下文交流

使用方法：
1. 在工作空间页面右侧AI助手中提问
2. 使用@符号引用文件和资源
3. 通过命令面板快速访问AI功能

## 命令面板

使用⌘K或Ctrl+K快捷键打开命令面板，可快速执行以下操作：
- 新建文件
- 切换侧边栏
- 询问AI助手
- 返回任务计划页面

## API 集成

### 配置 API 地址

在项目根目录创建 `.env.development.local` 文件 (本地开发环境) 或 `.env.production` (生产环境) 文件：

```
REACT_APP_API_URL=http://your-backend-api.com/api
```

如果未设置，将使用默认值 `https://api.example.com`。

### API 响应格式

所有后端 API 响应都应遵循以下格式：

```typescript
{
  success: boolean;  // 操作是否成功
  data: T;           // 返回的数据
  message?: string;  // 可选的消息，通常在错误时提供
}
```

### 离线支持机制

应用实现了离线容错机制：

- 获取数据失败时使用本地模拟数据
- 创建/更新/删除操作在本地执行，确保 UI 响应
- 网络恢复后可重新获取最新数据

## 多语言支持

应用使用react-i18next实现中文和英文两种语言支持：

- 默认使用英文
- 所有界面文本使用i18n配置
- 使用`t('key')`调用文本
- 通过语言上下文提供器(LanguageProvider)管理语言切换

## 代码组织最佳实践

- **组件拆分原则**: 组件应当保持简洁，每个组件职责单一，避免超过300行的大型组件
- **状态管理**: 页面组件应尽量保持无状态，通过props或Zustand store获取数据
- **关注点分离**: UI渲染与业务逻辑应当分离，业务逻辑放在hooks或store中
- **类型安全**: 避免使用any类型，为所有props和状态定义明确的接口
- **组件接口**: 每个组件应当有明确的props接口定义，包含必要的文档注释

## 贡献

欢迎贡献代码、报告问题或提出建议。请遵循项目的代码规范和提交规范。

## 许可

[MIT](LICENSE)
