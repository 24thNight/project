import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { Button } from '../components/ui/button';
import AIChat, { Message } from '../components/features/ai-chat/ai-chat';
import CommandPalette from '../components/features/command/command-palette';
import ProjectTree from '../components/features/tree-growth/project-tree';
import { usePlanStore } from '../lib/store';
import { toast } from 'sonner';

// 从URL中获取参数的工具函数
const getQueryParams = () => {
  const params = new URLSearchParams(window.location.search);
  const plan = params.get('plan');
  return {
    plan: plan ? decodeURIComponent(plan) : null
  };
};

// 文件内容类型定义
interface FileContents {
  [key: string]: string;
}

// 工作区标签类型
type WorkspaceTab = 'tree' | 'files';

const WorkspacePage: React.FC = () => {
  const location = useLocation();
  const { addPlan } = usePlanStore(); // 使用计划存储
  const [activeTab, setActiveTab] = useState<WorkspaceTab>('tree'); // 默认显示树页面
  const [isLeftSidebarCollapsed, setIsLeftSidebarCollapsed] = useState(false);
  const [leftSidebarWidth, setLeftSidebarWidth] = useState(256); // Default width of 64 in rem (w-64)
  const [isLeftResizing, setIsLeftResizing] = useState(false);
  const leftResizingRef = useRef<{ startX: number; startWidth: number } | null>(null);
  
  const [isRightSidebarCollapsed, setIsRightSidebarCollapsed] = useState(false);
  const [rightSidebarWidth, setRightSidebarWidth] = useState(384); // Default width of 96 in rem (w-96)
  const [isResizing, setIsResizing] = useState(false);
  const resizingRef = useRef<{ startX: number; startWidth: number } | null>(null);
  
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [openFiles, setOpenFiles] = useState(['workspace.txt']);
  const [currentFile, setCurrentFile] = useState('workspace.txt');
  const [planTitle, setPlanTitle] = useState<string | null>(null);
  
  // 树的进度状态
  const [treeProgress, setTreeProgress] = useState(5); // 默认5%进度
  const [tasksCompleted, setTasksCompleted] = useState(1);
  const [totalTasks, setTotalTasks] = useState(10);
  
  // 生成默认的文件内容
  const generateDefaultFileContents = (plan: string | null) => {
    const defaultContents: FileContents = {
      'workspace.txt': `# 任务计划 AI 工作区

这是一个集成式AI工作环境，你可以：
- 向AI提出关于任务的问题
- 获取关于任务拆解的建议
- 使用AI协助管理和优化你的任务计划

## 使用方法

1. 在右侧AI助手中提问
2. 使用⌘K打开命令面板
3. 使用@符号引用文件和资源`,
      'project.json': `{
  "name": "任务计划",
  "version": "1.0.0",
  "description": "现代化的任务管理应用",
  "framework": "React",
  "components": {
    "plans": "src/components/features/plan-tree/plan-tree.tsx",
    "workspace": "src/pages/workspace-page.tsx",
    "dashboard": "src/pages/dashboard-page.tsx"
  }
}`
    };
    
    // 如果有计划标题，则添加计划相关文件
    if (plan) {
      defaultContents['plan-overview.md'] = `# ${plan}

## 计划概述
这是关于"${plan}"的任务计划。

## 目标
- 完成"${plan}"相关的所有必要任务
- 按时高质量地交付成果
- 保持进度可视化和可追踪

## 时间线
- 开始时间: ${new Date().toLocaleDateString()}
- 预计完成: 待定
`;

      defaultContents['tasks.md'] = `# ${plan} - 任务清单

## 待完成任务
- [ ] 任务1: 定义"${plan}"的具体目标和范围
- [ ] 任务2: 分解"${plan}"为可执行的小步骤
- [ ] 任务3: 为每个步骤设定完成标准

## 已完成任务
- [x] 创建"${plan}"计划
`;
    }
    
    return defaultContents;
  };
  
  // 获取计划信息并初始化文件内容
  useEffect(() => {
    const { plan } = getQueryParams();
    if (plan) {
      setPlanTitle(plan);
      const newFileContents = generateDefaultFileContents(plan);
      setFileContents(newFileContents);
      
      // 打开计划相关文件
      const planFiles = ['plan-overview.md', 'tasks.md'];
      setOpenFiles(prevFiles => ['plan-overview.md', ...prevFiles.filter(file => !planFiles.includes(file))]);
      setCurrentFile('plan-overview.md');
      
      // 打开AI对话框
      setIsRightSidebarCollapsed(false);
      
      // 默认设置项目总任务数
      setTotalTasks(10);
      
      // 将计划保存到计划存储中
      const createPlanInStore = async () => {
        try {
          // 创建计划对象，确保包含所有必要字段
          const defaultStageId = `stage-${Date.now()}`;
          const newPlan = {
            title: plan,
            description: `这是关于"${plan}"的任务计划。`,
            currentStageId: defaultStageId,
            stages: [
              {
                id: defaultStageId,
                title: "初始阶段",
                completed: false,
                tasks: [
                  {
                    id: `task-${Date.now()}-1`,
                    title: `定义"${plan}"的目标和范围`,
                    description: "明确具体目标和验收标准",
                    status: "active" as const,
                    priority: "high" as const,
                    completed: false
                  },
                  {
                    id: `task-${Date.now()}-2`,
                    title: `分解"${plan}"为小步骤`,
                    description: "将大任务分解为可执行的小任务",
                    status: "active" as const,
                    priority: "medium" as const,
                    completed: false
                  },
                  {
                    id: `task-${Date.now()}-3`,
                    title: `创建"${plan}"的进度指标`,
                    description: "设置进度衡量标准",
                    status: "active" as const,
                    priority: "medium" as const,
                    completed: false
                  }
                ]
              }
            ],
            createdAt: new Date(),
            updatedAt: new Date(),
            status: 'ongoing' as const,
            progress: 5 // 初始进度5%
          };
          
          // 添加到计划存储
          const planId = await addPlan(newPlan);
          
          if (planId) {
            toast.success(`计划"${plan}"已创建并保存`, {
              duration: 3000,
              position: 'top-center'
            });
            console.log('成功创建计划，ID:', planId);
          } else {
            throw new Error('创建计划失败：没有返回计划ID');
          }
        } catch (error) {
          console.error('保存计划失败:', error);
          toast.error('保存计划失败，但您仍可以在工作区中工作');
        }
      };
      
      createPlanInStore();
    } else {
      setFileContents(generateDefaultFileContents(null));
    }
  }, [location.search, addPlan]);

  const [fileContents, setFileContents] = useState<FileContents>(generateDefaultFileContents(null));

  // 生成AI初始化消息
  const generateInitialMessages = (): Message[] => {
    const defaultMessage: Message = {
      id: '1',
      role: 'system' as const,
      content: '您好！我是AI助手，有什么我可以帮助您的吗？您可以使用@引用文件，也可以切换智能体模式和对话模式，或者选择不同的AI模型。',
      timestamp: new Date()
    };
    
    // 如果有计划标题，添加计划相关的欢迎消息
    if (planTitle) {
      return [
        defaultMessage,
        {
          id: '2',
          role: 'assistant' as const,
          content: `您好！我看到您正在创建"${planTitle}"的任务计划。

我已经为您初始化了两个文件：
1. **plan-overview.md** - 包含计划概述和目标
2. **tasks.md** - 包含待完成和已完成的任务清单

您需要我帮您做什么？例如：
- 帮您拆解"${planTitle}"任务为更小的步骤
- 制定完成"${planTitle}"的时间线
- 提供关于"${planTitle}"的最佳实践建议`,
          timestamp: new Date()
        }
      ];
    }
    
    return [defaultMessage];
  };

  // 处理AI消息
  const handleSendMessage = async (message: string, references?: string[]): Promise<string> => {
    // 检查是否是完成任务的消息
    const taskCompleteRegex = /(完成|完成了|已完成|标记完成|已完成了|完成任务)\s*([\S\s]*?)(任务|子任务|工作|事项)/i;
    const isTaskComplete = taskCompleteRegex.test(message);
    
    // 如果是完成任务的消息，更新树的进度
    if (isTaskComplete) {
      // 提取任务名称
      const match = message.match(taskCompleteRegex);
      const taskName = match && match[2] ? match[2].trim() : '一个';
      
      // 更新进度
      setTasksCompleted(prev => Math.min(prev + 1, totalTasks));
      const newProgress = Math.min(Math.round((tasksCompleted + 1) / totalTasks * 100), 100);
      setTreeProgress(newProgress);
      
      // 更新任务文件内容
      if (fileContents['tasks.md']) {
        const tasksMd = fileContents['tasks.md'];
        // 查找待完成任务列表中的任务，并将其移动到已完成任务列表
        const updatedTasksMd = tasksMd.replace(
          /- \[ \] (.*)/,
          (match, p1) => {
            if (p1.includes(taskName) || taskName === '一个') {
              return `- [x] ${p1}`;
            }
            return match;
          }
        );
        
        setFileContents(prev => ({
          ...prev,
          'tasks.md': updatedTasksMd
        }));
      }
      
      // 在树增长时显示提示
      toast.success(`🌱 任务"${taskName}"已完成！树成长了一点！`, {
        duration: 3000,
        position: 'top-center',
      });
    }
    
    // 模拟AI响应
    return new Promise((resolve) => {
      setTimeout(() => {
        let response = '';
        
        // 如果是完成任务的消息，提供特定的响应
        if (isTaskComplete) {
          response = `太棒了！我已将此任务标记为已完成。

您的项目进度树也已经成长了一点 🌱

当前进度：${treeProgress}%，已完成 ${tasksCompleted}/${totalTasks} 个任务。

${treeProgress >= 100 ? '恭喜您完成了所有任务！🎉' : '继续努力，您正在取得良好的进展！'}

有什么其他我可以帮您的吗？`;
        }
        // 根据消息内容和计划标题生成响应
        else if (planTitle) {
          if (message.toLowerCase().includes('拆解') || message.toLowerCase().includes('步骤')) {
            response = `我可以帮你拆解"${planTitle}"任务。一个好的任务拆解应该包含以下几个步骤：

1. 明确"${planTitle}"的具体目标和验收标准
2. 将"${planTitle}"分解为3-5个主要阶段
3. 在每个阶段内，确定具体的可执行任务
4. 估计每个任务的时间和资源需求
5. 确定任务之间的依赖关系
6. 设置检查点和里程碑

我已经在tasks.md文件中创建了初始任务列表，您可以根据上述步骤进一步细化任务。您想要我帮您详细拆解哪个方面的任务？`;
          } else if (message.toLowerCase().includes('时间') || message.toLowerCase().includes('计划')) {
            response = `对于"${planTitle}"这样的任务，我建议使用以下时间规划策略：

1. 设置明确的最终截止日期
2. 为每个主要阶段分配时间区间
3. 在关键点设置缓冲时间，预防意外延迟
4. 使用倒推法确定各任务的起始时间
5. 每日/每周检查进度，及时调整计划

您希望我帮您制定详细的时间线吗？如果是，请告诉我"${planTitle}"的预期完成日期。`;
          } else if (message.toLowerCase().includes('最佳实践') || message.toLowerCase().includes('建议')) {
            response = `关于"${planTitle}"，我有以下最佳实践建议：

1. 使用SMART原则（具体、可衡量、可达成、相关、有时限）定义每个任务
2. 设置清晰的优先级，先处理重要且紧急的任务
3. 使用番茄工作法（25分钟专注+5分钟休息）提高效率
4. 每日结束时回顾进度，计划第二天的任务
5. 定期与相关方沟通进度，确保期望一致
6. 使用工具如甘特图可视化进度

这些实践可以帮助您更高效地完成"${planTitle}"。您想了解其中哪个方面的更多细节？`;
          } else if (references && references.length > 0) {
            // 如果有引用文件，基于文件内容给出响应
            // 分析引用文件内容
            const filesContent = references.map(file => {
              const content = fileContents[file] || `(无法读取文件 ${file})`;
              return `${file}: ${content.length > 50 ? content.substring(0, 50) + '...' : content}`;
            }).join('\n');
            
            response = `我已分析了你引用的文件(${filesContent.length} 字节)。以下是我的发现：

根据文件内容，这是一个使用React框架构建的任务管理应用。主要组件包括计划树(plan-tree)、工作区和仪表盘。

我建议你可以：
1. 检查组件之间的数据流是否清晰
2. 确保状态管理逻辑集中且一致
3. 考虑添加单元测试确保功能稳定性`;
          } else {
            response = `关于"${planTitle}"任务，我可以帮您：

- 详细拆解任务步骤
- 制定时间线和里程碑
- 提供最佳实践和效率建议
- 分析潜在风险和解决方案
- 帮您追踪和调整计划进度

您想从哪个方面着手优化"${planTitle}"的计划？`;
          }
        } else if (message.toLowerCase().includes('任务拆解')) {
          response = `我可以帮你拆解任务。一个好的任务拆解应该包含以下几个步骤：

1. 明确任务目标
2. 将大任务分解为小任务
3. 评估每个小任务的优先级
4. 设定每个小任务的完成时间
5. 分配资源

希望这对你有所帮助！`;
        } else if (message.toLowerCase().includes('优化')) {
          response = `要优化你的任务计划，可以考虑以下几点：

1. 使用番茄工作法提高专注度
2. 建立例行公事，减少决策疲劳
3. 批量处理同类型的任务
4. 定期回顾和调整你的计划
5. 使用自动化工具减少重复工作`;
        } else if (references && references.length > 0) {
          // 如果有引用文件，基于文件内容给出响应
          const fileContent = references.map(file => fileContents[file] || `(无法读取文件 ${file})`).join('\n\n');
          response = `我已分析了你引用的文件。以下是我的发现：

根据文件内容，这是一个使用React框架构建的任务管理应用。主要组件包括计划树(plan-tree)、工作区和仪表盘。

我建议你可以：
1. 检查组件之间的数据流是否清晰
2. 确保状态管理逻辑集中且一致
3. 考虑添加单元测试确保功能稳定性`;
        } else {
          response = `我是你的AI助手，可以帮助你:

- 回答关于任务管理的问题
- 提供任务拆解和优化建议
- 分析项目文件和代码

你可以尝试询问关于"任务拆解"或"优化"的问题，或者使用@引用特定文件，我会基于文件内容给你更具体的建议。`;
        }
        
        resolve(response);
      }, 1500);
    });
  };

  // 监听快捷键
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // 检查Cmd+K或Ctrl+K
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // 处理左侧边栏拖拽调整宽度
  const handleLeftResizeMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsLeftResizing(true);
    leftResizingRef.current = {
      startX: e.clientX,
      startWidth: leftSidebarWidth
    };
  };

  useEffect(() => {
    const handleLeftResizeMouseMove = (e: MouseEvent) => {
      if (!isLeftResizing || !leftResizingRef.current) return;
      
      const delta = e.clientX - leftResizingRef.current.startX;
      const newWidth = Math.max(200, Math.min(500, leftResizingRef.current.startWidth + delta));
      setLeftSidebarWidth(newWidth);
    };

    const handleLeftResizeMouseUp = () => {
      setIsLeftResizing(false);
      leftResizingRef.current = null;
    };

    if (isLeftResizing) {
      document.addEventListener('mousemove', handleLeftResizeMouseMove);
      document.addEventListener('mouseup', handleLeftResizeMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleLeftResizeMouseMove);
      document.removeEventListener('mouseup', handleLeftResizeMouseUp);
    };
  }, [isLeftResizing]);

  // 处理右侧边栏拖拽调整宽度
  const handleResizeMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
    resizingRef.current = {
      startX: e.clientX,
      startWidth: rightSidebarWidth
    };
  };

  useEffect(() => {
    const handleResizeMouseMove = (e: MouseEvent) => {
      if (!isResizing || !resizingRef.current) return;
      
      const delta = resizingRef.current.startX - e.clientX;
      const newWidth = Math.max(280, Math.min(800, resizingRef.current.startWidth + delta));
      setRightSidebarWidth(newWidth);
    };

    const handleResizeMouseUp = () => {
      setIsResizing(false);
      resizingRef.current = null;
    };

    if (isResizing) {
      document.addEventListener('mousemove', handleResizeMouseMove);
      document.addEventListener('mouseup', handleResizeMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleResizeMouseMove);
      document.removeEventListener('mouseup', handleResizeMouseUp);
    };
  }, [isResizing]);

  // 定义可用命令 - 添加与树相关的命令
  const commands = [
    {
      id: 'new-file',
      name: '新建文件',
      description: '创建一个新的文件',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
      ),
      action: () => {
        const fileName = prompt('请输入文件名:');
        if (fileName && !openFiles.includes(fileName)) {
          setOpenFiles(prev => [...prev, fileName]);
          setFileContents(prev => ({
            ...prev,
            [fileName]: ''
          }));
          setCurrentFile(fileName);
          toast.success(`文件 ${fileName} 已创建`);
        }
      }
    },
    {
      id: 'toggle-left-sidebar',
      name: '切换左侧栏',
      description: '显示或隐藏左侧文件栏',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
        </svg>
      ),
      action: () => {
        setIsLeftSidebarCollapsed(!isLeftSidebarCollapsed);
      }
    },
    {
      id: 'toggle-right-sidebar',
      name: '切换AI助手',
      description: '显示或隐藏右侧AI助手',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
        </svg>
      ),
      action: () => {
        setIsRightSidebarCollapsed(!isRightSidebarCollapsed);
      }
    },
    {
      id: 'ask-ai',
      name: '询问AI',
      description: '直接向AI助手提问',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      ),
      action: () => {
        setIsRightSidebarCollapsed(false);
        toast.info('请在AI助手栏中提问');
      }
    },
    {
      id: 'go-to-dashboard',
      name: '返回任务计划',
      description: '返回到任务计划页面',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      ),
      action: () => {
        handleReturnToDashboard();
      }
    },
    {
      id: 'view-tree',
      name: '查看进度树',
      description: '查看项目进度可视化树',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
      action: () => {
        setActiveTab('tree');
        toast.success('已切换到进度树视图');
      }
    },
    {
      id: 'view-files',
      name: '查看文件',
      description: '查看项目文件',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      action: () => {
        setActiveTab('files');
        toast.success('已切换到文件视图');
      }
    }
  ];

  // 渲染行号和文本内容
  const renderFileContent = (content: string) => {
    const lines = content.split('\n');
    return lines.map((line, index) => (
      <div key={index} className="flex">
        <div className="text-gray-400 w-10 text-right pr-4 select-none">{index + 1}</div>
        <div>{line}</div>
      </div>
    ));
  };

  // 自定义返回仪表板函数
  const handleReturnToDashboard = () => {
    // 强制全新加载页面以确保计划显示（清除缓存）
    const timestamp = Date.now();
    
    // 为了确保仪表盘重新获取计划数据，使用location.replace而不是href赋值
    // 这避免了浏览器可能的缓存问题
    window.location.replace(`/dashboard?refresh=${timestamp}`);
    
    // 显示一个正在刷新的toast提示
    toast.info('正在刷新并返回仪表盘...', {
      duration: 1500
    });
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* 顶部导航栏 - 统一风格与dashboard-page */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto flex justify-between items-center px-4 py-3">
          {/* 左侧Logo区域 */}
          <div className="flex items-center space-x-2">
            <div className="bg-blue-600 text-white h-8 w-8 rounded flex items-center justify-center font-bold">
              L
            </div>
            <span className="font-semibold text-lg">Linden AI</span>
          </div>
          
          {/* 中间搜索栏 */}
          <div className="hidden sm:flex flex-1 max-w-md mx-8">
            <div 
              className="relative w-full bg-gray-50 border border-gray-200 rounded-md flex items-center px-3 cursor-pointer"
              onClick={() => setIsCommandPaletteOpen(true)}
            >
              <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <div className="w-full py-2 px-2 text-gray-400 text-sm">
                搜索或使用命令...
              </div>
              <div className="text-xs text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded">⌘K</div>
            </div>
          </div>
          
          {/* 右侧功能区 */}
          <div className="flex items-center space-x-3">
            <Button
              variant="ghost"
              size="sm"
              className="text-gray-700"
            >
              EN
            </Button>

            <Button
              variant="outline"
              className="border-blue-600 text-blue-600 hover:bg-blue-50"
              onClick={handleReturnToDashboard}
            >
              <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              返回任务计划
            </Button>

            <div className="h-8 w-8 rounded-full bg-blue-600 text-white flex items-center justify-center cursor-pointer">
              <span>U</span>
            </div>
          </div>
        </div>
      </header>

      {/* 主体内容 */}
      <div className="flex-1 flex overflow-hidden">
        {/* 左侧边栏 - 文件浏览 */}
        <div 
          className={`bg-gray-800 text-white flex flex-col ${
            isLeftSidebarCollapsed ? 'w-14' : ''
          } ${isLeftResizing ? '' : 'transition-all duration-300'} border-r border-gray-700`}
          style={{ width: isLeftSidebarCollapsed ? undefined : `${leftSidebarWidth}px` }}
        >
          <div className="flex items-center justify-between p-4 border-b border-gray-700">
            <h2 className={`font-medium ${isLeftSidebarCollapsed ? 'hidden' : 'block'}`}>项目导航</h2>
            <button 
              onClick={() => setIsLeftSidebarCollapsed(!isLeftSidebarCollapsed)}
              className="text-gray-400 hover:text-white"
            >
              {isLeftSidebarCollapsed ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
                </svg>
              )}
            </button>
          </div>
          
          {/* 导航项目 */}
          <div className="flex-1 overflow-auto p-2">
            {!isLeftSidebarCollapsed && (
              <div className="py-2 space-y-1">
                {/* 树视图选项 */}
                <div 
                  className={`flex items-center ${activeTab === 'tree' ? 'text-white bg-gray-700' : 'text-gray-300 hover:text-white'} py-2 px-3 rounded hover:bg-gray-700 cursor-pointer`}
                  onClick={() => setActiveTab('tree')}
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span>进度树</span>
                </div>
                
                {/* 文件视图选项 */}
                <div 
                  className={`flex items-center ${activeTab === 'files' ? 'text-white bg-gray-700' : 'text-gray-300 hover:text-white'} py-2 px-3 rounded hover:bg-gray-700 cursor-pointer`}
                  onClick={() => setActiveTab('files')}
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span>项目文件</span>
                </div>
                
                {/* 文件列表 */}
                {activeTab === 'files' && (
                  <div className="mt-4 pl-2">
                    <div className="text-xs text-gray-400 uppercase font-semibold mb-2">文件</div>
                    {Object.keys(fileContents).map(fileName => (
                      <div 
                        key={fileName}
                        className={`flex items-center ${fileName === currentFile ? 'text-white bg-gray-700' : 'text-gray-300 hover:text-white'} py-1 px-2 rounded hover:bg-gray-700 cursor-pointer`}
                        onClick={() => {
                          setActiveTab('files');
                          if (!openFiles.includes(fileName)) {
                            setOpenFiles(prev => [...prev, fileName]);
                          }
                          setCurrentFile(fileName);
                        }}
                      >
                        <svg className="w-4 h-4 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                        <span className="truncate text-sm">{fileName}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* 可调整大小的左侧分割线 */}
        {!isLeftSidebarCollapsed && (
          <div 
            className={`w-1.5 hover:bg-blue-300 cursor-col-resize relative ${isLeftResizing ? 'bg-blue-400' : 'bg-transparent'}`}
            onMouseDown={handleLeftResizeMouseDown}
            aria-label="调整文件浏览器大小"
          >
            <div className="absolute inset-y-0 -left-1 -right-1" />
          </div>
        )}

        {/* 中央工作区 - 根据activeTab显示不同内容 */}
        <div className="flex-1 overflow-auto bg-white flex flex-col">
          {activeTab === 'files' ? (
            <>
              {/* 工作区顶部标签栏 */}
              <div className="flex items-center border-b border-gray-200 h-10 bg-gray-50">
                {openFiles.map(file => (
                  <div 
                    key={file}
                    className={`flex items-center px-4 py-1 border-r border-gray-200 text-gray-600 text-sm font-medium cursor-pointer ${
                      file === currentFile ? 'bg-white border-b-2 border-b-blue-500' : 'hover:bg-gray-100'
                    }`}
                    onClick={() => setCurrentFile(file)}
                  >
                    {file}
                    <button 
                      className="ml-2 text-gray-400 hover:text-gray-600"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (openFiles.length > 1) {
                          setOpenFiles(prev => prev.filter(f => f !== file));
                          if (currentFile === file) {
                            setCurrentFile(openFiles.find(f => f !== file) || '');
                          }
                        }
                      }}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
              
              {/* 编辑区域 */}
              <div className="flex-1 overflow-auto p-6">
                <div className="max-w-4xl mx-auto">
                  <div className="font-mono text-sm text-gray-800 whitespace-pre-wrap">
                    {currentFile && fileContents[currentFile] ? 
                      renderFileContent(fileContents[currentFile]) : 
                      <div className="text-gray-400 text-center py-10">没有打开的文件</div>
                    }
                  </div>
                </div>
              </div>
            </>
          ) : (
            /* 树视图 */
            <ProjectTree 
              planTitle={planTitle || '未命名项目'} 
              progress={treeProgress}
              tasksCompleted={tasksCompleted}
              totalTasks={totalTasks}
              onTaskComplete={() => {
                // 更新任务完成数量
                const newTasksCompleted = Math.min(tasksCompleted + 1, totalTasks);
                setTasksCompleted(newTasksCompleted);
                
                // 更新进度
                const newProgress = Math.min(Math.round((newTasksCompleted / totalTasks) * 100), 100);
                setTreeProgress(newProgress);
                
                // 更新任务文件内容 - 将第一个未完成的任务标记为已完成
                if (fileContents['tasks.md']) {
                  const tasksMd = fileContents['tasks.md'];
                  // 查找第一个未完成的任务
                  const updatedTasksMd = tasksMd.replace(
                    /- \[ \] (.*)/,
                    (match, p1) => `- [x] ${p1}`
                  );
                  
                  setFileContents(prev => ({
                    ...prev,
                    'tasks.md': updatedTasksMd
                  }));
                }
                
                // 显示提示
                toast.success('🌱 任务已完成！树成长了一点！', {
                  duration: 3000,
                  position: 'top-center',
                });
              }}
            />
          )}
        </div>

        {/* 可调整大小的右侧分割线 */}
        {!isRightSidebarCollapsed && (
          <div 
            className={`w-1.5 hover:bg-blue-300 cursor-col-resize relative ${isResizing ? 'bg-blue-400' : 'bg-transparent'}`}
            onMouseDown={handleResizeMouseDown}
            aria-label="调整聊天窗口大小"
          >
            <div className="absolute inset-y-0 -left-1 -right-1" />
          </div>
        )}

        {/* 右侧边栏 - AI助手 (Cursor风格) */}
        <div 
          className={`bg-white border-l border-gray-200 flex flex-col ${
            isRightSidebarCollapsed ? 'w-14' : ''
          } ${isResizing ? '' : 'transition-all duration-300'}`}
          style={{ width: isRightSidebarCollapsed ? undefined : `${rightSidebarWidth}px` }}
        >
          {!isRightSidebarCollapsed && (
            <div className="flex-1 overflow-hidden">
              <AIChat 
                initialMessages={generateInitialMessages()}
                onSendMessage={handleSendMessage}
                onClose={() => setIsRightSidebarCollapsed(true)}
              />
            </div>
          )}
          
          {isRightSidebarCollapsed && (
            <div className="h-full flex flex-col items-center pt-4">
              <button 
                className="text-blue-600 hover:text-blue-800"
                onClick={() => setIsRightSidebarCollapsed(false)}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 命令面板 */}
      <CommandPalette 
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        commands={commands}
      />
    </div>
  );
};

export default WorkspacePage; 