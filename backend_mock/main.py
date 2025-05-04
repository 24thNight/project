from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
import asyncio
import time

app = FastAPI()

# 添加CORS中间件
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 在生产环境中应该限制为特定域名
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class TaskRequest(BaseModel):
    taskTitle: str

# 模拟的问题列表
questions = [
    "你是否有具体的考试时间？",
    "你的目标分数是多少？",
    "每天预计投入多长时间？"
]

@app.post("/api/clarify/start")
async def start_clarify(request: TaskRequest):
    """接收任务标题并启动流程"""
    return {"success": True, "message": "Started clarification process"}

async def generate_questions(taskTitle: str):
    """生成问题的异步生成器"""
    # 在实际应用中，这里可能是调用大模型API的地方
    for question in questions:
        # 添加一些延迟，模拟真实场景
        await asyncio.sleep(2)
        yield f"data: {question}\n\n"
    
    # 发送结束标记
    await asyncio.sleep(1)
    yield "data: [END]\n\n"

@app.get("/api/clarify/stream")
async def stream_questions(taskTitle: str):
    """使用SSE流式返回问题"""
    return StreamingResponse(
        generate_questions(taskTitle),
        media_type="text/event-stream"
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000) 