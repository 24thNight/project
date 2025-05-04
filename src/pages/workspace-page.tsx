import React, { useState, useEffect } from 'react';
import { Button } from '../components/ui/button';
import AIChat, { Message } from '../components/features/ai-chat/ai-chat';
import CommandPalette from '../components/features/command/command-palette';
import { toast } from 'sonner';

// 文件内容类型定义
interface FileContents {
  [key: string]: string;
}

const WorkspacePage: React.FC = () => {
  const [isLeftSidebarCollapsed, setIsLeftSidebarCollapsed] = useState(false);
  const [isRightSidebarCollapsed, setIsRightSidebarCollapsed] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [openFiles, setOpenFiles] = useState(['workspace.txt']);
  const [currentFile, setCurrentFile] = useState('workspace.txt');
  const [fileContents, setFileContents] = useState<FileContents>({
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
  });

  // 定义可用命令
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
        window.location.href = '/dashboard';
      }
    }
  ];

  // 处理AI消息
  const handleSendMessage = async (message: string, references?: string[]): Promise<string> => {
    // 模拟AI响应
    return new Promise((resolve) => {
      setTimeout(() => {
        let response = '';
        
        // 根据消息内容模拟不同的响应
        if (message.toLowerCase().includes('任务拆解')) {
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
              onClick={() => window.location.href = '/dashboard'}
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
        <div className={`bg-gray-800 text-white flex flex-col ${isLeftSidebarCollapsed ? 'w-14' : 'w-64'} transition-all duration-300 border-r border-gray-700`}>
          <div className="flex items-center justify-between p-4 border-b border-gray-700">
            <h2 className={`font-medium ${isLeftSidebarCollapsed ? 'hidden' : 'block'}`}>文件浏览器</h2>
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
          
          {/* 文件树组件 */}
          <div className="flex-1 overflow-auto p-2">
            {!isLeftSidebarCollapsed && (
              <div className="py-2">
                {Object.keys(fileContents).map(fileName => (
                  <div 
                    key={fileName}
                    className={`flex items-center ${fileName === currentFile ? 'text-white bg-gray-700' : 'text-gray-300 hover:text-white'} py-1 px-2 rounded hover:bg-gray-700 cursor-pointer`}
                    onClick={() => {
                      if (!openFiles.includes(fileName)) {
                        setOpenFiles(prev => [...prev, fileName]);
                      }
                      setCurrentFile(fileName);
                    }}
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    <span>{fileName}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* 中央工作区 - Cursor风格 */}
        <div className="flex-1 overflow-auto bg-white flex flex-col">
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
        </div>

        {/* 右侧边栏 - AI助手 (Cursor风格) */}
        <div className={`bg-white border-l border-gray-200 flex flex-col ${isRightSidebarCollapsed ? 'w-14' : 'w-96'} transition-all duration-300`}>
          <div className="flex items-center justify-between p-3 border-b border-gray-200">
            <h2 className={`font-medium text-sm ${isRightSidebarCollapsed ? 'hidden' : 'block'}`}></h2>
            <button 
              onClick={() => setIsRightSidebarCollapsed(!isRightSidebarCollapsed)}
              className="text-gray-400 hover:text-gray-600"
            >
              {isRightSidebarCollapsed ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                </svg>
              )}
            </button>
          </div>
          
          {/* 集成AI聊天组件 */}
          <div className="flex-1 overflow-hidden">
            {!isRightSidebarCollapsed ? (
              <AIChat 
                initialMessages={[
                  {
                    id: '1',
                    role: 'system',
                    content: '您好！我是AI助手，有什么我可以帮助您的吗？您可以使用@引用文件，也可以切换智能体模式和对话模式，或者选择不同的AI模型。',
                    timestamp: new Date()
                  }
                ]}
                onSendMessage={handleSendMessage}
              />
            ) : (
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