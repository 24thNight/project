# API 接口集成文档

本文档描述了如何与后端 API 进行集成，以及 API 接口的使用方法。

## 配置

API 基础 URL 可以通过环境变量配置：

```
REACT_APP_API_URL=https://your-api-endpoint.com
```

如果未设置，将使用默认值 `https://api.example.com`。

要在本地配置此变量，可以在项目根目录创建一个 `.env.development.local` 文件：

```
REACT_APP_API_URL=http://localhost:3001/api
```

## API 响应格式

所有 API 响应都遵循以下格式：

```typescript
{
  success: boolean;  // 操作是否成功
  data: T;           // 返回的数据
  message?: string;  // 可选的消息，通常在错误时提供
}
```

## 错误处理

API 请求失败时会自动显示错误提示，并将错误传播到调用方。所有错误处理逻辑都封装在 `api.ts` 中，包括：

- 网络错误
- 服务器返回的错误消息
- 通用错误

## 多语言支持

API 层支持多语言错误和成功消息，根据当前的应用语言设置自动显示对应的文本。

## 计划 API

### 获取所有计划

```typescript
import { planApi } from '../lib/api';

// 获取计划列表
const plans = await planApi.fetchPlans();
```

### 获取单个计划

```typescript
import { planApi } from '../lib/api';

// 根据 ID 获取计划
const plan = await planApi.getPlanById('plan-123');
```

### 创建新计划

```typescript
import { planApi } from '../lib/api';

// 创建新计划
const newPlan = await planApi.createPlan({
  title: '新计划',
  description: '计划描述'
});
```

### 更新计划

```typescript
import { planApi } from '../lib/api';

// 更新计划
await planApi.updatePlan('plan-123', {
  progress: 50,
  status: 'ongoing'
});
```

### 重命名计划

```typescript
import { planApi } from '../lib/api';

// 重命名计划
await planApi.renamePlan('plan-123', '新名称');
```

### 删除计划

```typescript
import { planApi } from '../lib/api';

// 删除计划
await planApi.deletePlan('plan-123');
```

## Store 集成

所有 API 调用已通过 Zustand store 集成，使用 store 的方法会自动与后端同步：

```typescript
import { usePlanStore } from '../lib/store';

// 在组件中
const { plans, fetchPlans, addPlan, updatePlan, renamePlan, deletePlan } = usePlanStore();

// 获取所有计划
useEffect(() => {
  fetchPlans();
}, []);

// 创建新计划
const handleCreatePlan = async () => {
  const id = await addPlan({ title: '新计划' });
  // 使用返回的 ID 做进一步操作
};

// 更新计划
const handleUpdatePlan = async (id) => {
  await updatePlan(id, { progress: 75 });
};

// 重命名计划
const handleRenamePlan = async (id, newName) => {
  await renamePlan(id, newName);
};

// 删除计划
const handleDeletePlan = async (id) => {
  await deletePlan(id);
};
```

## 离线支持

当 API 请求失败时，store 会回退到本地操作，确保 UI 保持响应：

1. 获取计划失败时会使用模拟数据
2. 创建、更新、删除等操作会在本地执行，确保用户体验不受影响
3. 当网络恢复后，可以重新获取最新数据

## API 测试工具

项目包含一个简单的 API 测试工具，可通过以下地址访问：

```
http://localhost:3000/api-test
```

这个工具允许你测试 API 的基本功能，包括：
- 获取计划列表
- 创建新计划
- 更新计划进度
- 删除计划

这是一个方便的工具，可以验证 API 连接和功能是否正常工作。

## 后端 API 所需实现端点

后端需要实现以下 RESTful API 端点：

| 方法   | 路径                     | 描述                 | 请求体                    | 响应                        |
|--------|--------------------------|----------------------|--------------------------|------------------------------|
| GET    | /plans                   | 获取所有计划         | -                         | { success: true, data: Plan[] } |
| GET    | /plans/:id               | 获取单个计划         | -                         | { success: true, data: Plan }   |
| POST   | /plans                   | 创建新计划           | { title, description, ... }| { success: true, data: Plan }   |
| PUT    | /plans/:id               | 更新计划             | { ...updates }            | { success: true, data: Plan }   |
| PATCH  | /plans/:id/rename        | 重命名计划           | { title: string }         | { success: true, data: Plan }   |
| DELETE | /plans/:id               | 删除计划             | -                         | { success: true, data: null }   |
| GET    | /plans/:id/current-stage | 获取计划当前阶段     | -                         | { success: true, data: Stage }  | 