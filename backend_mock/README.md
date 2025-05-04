# 澄清问题API服务（模拟）

这是一个使用FastAPI构建的模拟后端服务，用于提供"澄清问题"功能的API。

## 功能

- 通过SSE（Server-Sent Events）技术流式返回问题
- 支持任务标题输入
- 生成3个预设问题
- 使用`[END]`标记问题流结束

## 安装

```bash
pip install -r requirements.txt
```

## 运行

```bash
uvicorn main:app --reload
```

服务将在 `http://localhost:8000` 上运行。

## API端点

1. `POST /api/clarify/start` - 接收任务标题，启动澄清流程
   - 请求体: `{"taskTitle": "我想3个月内考到雅思6.5"}`
   - 响应: `{"success": true, "message": "Started clarification process"}`

2. `GET /api/clarify/stream?taskTitle=xxx` - 通过SSE流式返回问题
   - 查询参数: `taskTitle` - URL编码的任务标题
   - 响应: 流式SSE数据，每条问题一个事件，以`[END]`结束

## 说明

这是一个模拟服务，用于开发和测试前端。在实际应用中，问题生成应该调用大型语言模型API。 