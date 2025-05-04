const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 8000;

// 启用CORS以允许前端访问
app.use(cors());
// 解析JSON请求体
app.use(bodyParser.json());

// 数据库文件路径
const DATA_FILE = path.join(__dirname, 'db.json');

// 内存数据库
let db = {
  plans: []
};

// 加载数据
function loadData() {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
      db = data;
      console.log('数据加载成功');
    }
  } catch (error) {
    console.error('加载数据失败:', error);
  }
}

// 保存数据
function saveData() {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(db, null, 2));
    console.log('数据保存成功');
  } catch (error) {
    console.error('保存数据失败:', error);
  }
}

// 模拟延迟的中间件
const simulateDelay = (req, res, next) => {
  const delay = 300 + Math.random() * 700; // 300-1000ms的随机延迟
  setTimeout(next, delay);
};

// 路由处理

// 主页
app.get('/', (req, res) => {
  res.json({ message: 'Mock API服务器正在运行' });
});

// 获取所有计划
app.get('/plans', simulateDelay, (req, res) => {
  res.json({
    success: true,
    data: db.plans
  });
});

// 创建新计划
app.post('/plans', simulateDelay, (req, res) => {
  const { title, description } = req.body;
  
  // 生成唯一ID和默认阶段
  const id = `plan-${Date.now()}`;
  const defaultStageId = `stage-${Date.now()}`;
  
  const newPlan = {
    id,
    title,
    description: description || '',
    currentStageId: defaultStageId,
    stages: [
      {
        id: defaultStageId,
        title: "第一阶段",
        completed: false,
        tasks: []
      }
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
    status: "ongoing",
    progress: 0
  };
  
  // 添加到数据库
  db.plans.push(newPlan);
  saveData();
  
  // 返回创建的计划
  res.status(201).json({
    success: true,
    data: newPlan
  });
});

// 获取特定计划
app.get('/plans/:id', simulateDelay, (req, res) => {
  const plan = db.plans.find(p => p.id === req.params.id);
  
  if (!plan) {
    return res.status(404).json({
      success: false,
      message: '找不到计划'
    });
  }
  
  res.json({
    success: true,
    data: plan
  });
});

// 更新计划
app.put('/plans/:id', simulateDelay, (req, res) => {
  const planIndex = db.plans.findIndex(p => p.id === req.params.id);
  
  if (planIndex === -1) {
    return res.status(404).json({
      success: false,
      message: '找不到计划'
    });
  }
  
  // 更新计划，保留原有字段
  db.plans[planIndex] = {
    ...db.plans[planIndex],
    ...req.body,
    updatedAt: new Date()
  };
  
  saveData();
  
  res.json({
    success: true,
    data: db.plans[planIndex]
  });
});

// 重命名计划
app.patch('/plans/:id/rename', simulateDelay, (req, res) => {
  const { title } = req.body;
  const planIndex = db.plans.findIndex(p => p.id === req.params.id);
  
  if (planIndex === -1) {
    return res.status(404).json({
      success: false,
      message: '找不到计划'
    });
  }
  
  // 更新标题
  db.plans[planIndex].title = title;
  db.plans[planIndex].updatedAt = new Date();
  
  saveData();
  
  res.json({
    success: true,
    data: db.plans[planIndex]
  });
});

// 删除计划（软删除）
app.delete('/plans/:id', simulateDelay, (req, res) => {
  const planIndex = db.plans.findIndex(p => p.id === req.params.id);
  
  if (planIndex === -1) {
    return res.status(404).json({
      success: false,
      message: '找不到计划'
    });
  }
  
  // 软删除
  db.plans[planIndex].status = 'deleted';
  db.plans[planIndex].updatedAt = new Date();
  
  saveData();
  
  res.json({
    success: true,
    data: null,
    message: '计划已删除'
  });
});

// 添加任务到阶段
app.post('/plans/:planId/stages/:stageId/tasks', simulateDelay, (req, res) => {
  const { planId, stageId } = req.params;
  const taskData = req.body;
  
  // 查找计划和阶段
  const plan = db.plans.find(p => p.id === planId);
  if (!plan) {
    return res.status(404).json({
      success: false,
      message: '找不到计划'
    });
  }
  
  const stageIndex = plan.stages.findIndex(s => s.id === stageId);
  if (stageIndex === -1) {
    return res.status(404).json({
      success: false,
      message: '找不到阶段'
    });
  }
  
  // 创建新任务
  const newTask = {
    id: `task-${Date.now()}`,
    title: taskData.title,
    description: taskData.description || '',
    status: taskData.status || 'active',
    priority: taskData.priority || 'medium',
    completed: false,
    createdAt: new Date(),
    updatedAt: new Date()
  };
  
  // 添加到阶段
  plan.stages[stageIndex].tasks.push(newTask);
  
  saveData();
  
  res.status(201).json({
    success: true,
    data: newTask
  });
});

// 开始澄清过程
app.post('/api/clarify/start', (req, res) => {
  const { taskTitle } = req.body;
  
  res.json({
    success: true,
    message: 'Started clarification process'
  });
});

// 澄清问题流
app.get('/api/clarify/stream', (req, res) => {
  const { taskTitle } = req.query;
  
  // 设置SSE头
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  
  // 根据taskTitle动态生成问题
  let questions = [];
  
  if (taskTitle.includes('学习') || taskTitle.includes('考试') || taskTitle.includes('雅思')) {
    questions = [
      '你是否有具体的考试时间？',
      '你的目标分数是多少？',
      '每天预计投入多长时间？',
      '你在哪一部分需要最多的提升？（听说读写）'
    ];
  } else if (taskTitle.includes('健身') || taskTitle.includes('减肥')) {
    questions = [
      '你的当前体重是多少？',
      '你的目标体重是多少？',
      '你每周能锻炼几次？',
      '你有任何健康问题需要考虑吗？'
    ];
  } else {
    questions = [
      '你能详细描述一下这个任务的主要目标是什么吗？',
      '你计划在什么时间段内完成这个任务？',
      '你需要什么资源来完成这个任务？',
      '你预计会遇到哪些挑战或困难？'
    ];
  }
  
  // 每2秒发送一个问题
  let questionIndex = 0;
  
  const sendQuestion = () => {
    if (questionIndex < questions.length) {
      res.write(`data: ${questions[questionIndex]}\n\n`);
      questionIndex++;
      
      if (questionIndex < questions.length) {
        setTimeout(sendQuestion, 2000);
      } else {
        // 全部问题发送完毕，发送结束标记
        setTimeout(() => {
          res.write('data: [END]\n\n');
          res.end();
        }, 2000);
      }
    }
  };
  
  // 开始发送问题
  setTimeout(sendQuestion, 1000);
  
  // 关闭连接的处理
  req.on('close', () => {
    console.log('客户端断开连接');
  });
});

// 在启动服务前，先加载数据
loadData();

// 启动服务器
app.listen(PORT, () => {
  console.log(`Mock服务器运行在 http://localhost:${PORT}`);
}); 