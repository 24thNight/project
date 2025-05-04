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

## 技术栈

- **前端框架**: React 18 + TypeScript
- **状态管理**: Zustand
- **样式**: Tailwind CSS + shadcn/ui
- **动画**: Framer Motion
- **国际化**: 自定义 i18n 实现
- **HTTP 客户端**: Axios
- **通知**: Sonner Toast

## 项目结构

```
src/
├── components/            # UI组件
│   ├── ui/                # 基础UI组件
│   └── features/          # 功能组件
│       └── dashboard/     # 工作台相关组件
├── pages/                 # 页面组件
├── lib/                   # 工具函数和服务
│   ├── api.ts             # API服务
│   ├── store.ts           # 状态管理
│   ├── i18n.ts            # 国际化
│   └── utils.ts           # 通用工具函数
└── types/                 # TypeScript类型定义
```

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

### 后端接口列表

前端需要后端实现以下 API 端点：

| 方法   | 路径                     | 描述                 | 请求体                    | 响应                        |
|--------|--------------------------|----------------------|--------------------------|------------------------------|
| GET    | /plans                   | 获取所有计划         | -                         | { success: true, data: Plan[] } |
| GET    | /plans/:id               | 获取单个计划         | -                         | { success: true, data: Plan }   |
| POST   | /plans                   | 创建新计划           | { title, description, ... }| { success: true, data: Plan }   |
| PUT    | /plans/:id               | 更新计划             | { ...updates }            | { success: true, data: Plan }   |
| PATCH  | /plans/:id/rename        | 重命名计划           | { title: string }         | { success: true, data: Plan }   |
| DELETE | /plans/:id               | 删除计划             | -                         | { success: true, data: null }   |
| GET    | /plans/:id/current-stage | 获取计划当前阶段     | -                         | { success: true, data: Stage }  |

### 使用示例

```typescript
// 通过Zustand store使用API
import { usePlanStore } from './lib/store';

function MyComponent() {
  const { plans, fetchPlans, addPlan } = usePlanStore();
  
  // 获取所有计划
  useEffect(() => {
    fetchPlans();
  }, []);
  
  // 创建新计划
  const handleCreatePlan = async () => {
    await addPlan({ title: '新计划' });
  };
  
  return (
    <div>
      {plans.map(plan => (
        <div key={plan.id}>{plan.title}</div>
      ))}
      <button onClick={handleCreatePlan}>创建新计划</button>
    </div>
  );
}
```

### API 测试工具

访问 `/api-test` 路径可以使用内置的 API 测试工具，测试各个接口的功能和返回数据。

## 离线支持

应用实现了离线容错机制：

- 获取数据失败时使用本地模拟数据
- 创建/更新/删除操作在本地执行，确保 UI 响应
- 网络恢复后可重新获取最新数据

## 多语言支持

应用支持中文和英文两种语言，可通过顶部导航栏切换。所有界面文本和消息都支持国际化。

## 开发指南

更多详细的开发指南请查看 [src/lib/README.md](src/lib/README.md)。

## 贡献

欢迎贡献代码、报告问题或提出建议。请遵循项目的代码规范和提交规范。

## 许可

[MIT](LICENSE)
