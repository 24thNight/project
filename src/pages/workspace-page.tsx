import React, { useState, useEffect } from 'react';
import { Button } from '../components/ui/button';
import AIChat from '../components/features/ai-chat/ai-chat';
import CommandPalette from '../components/features/command/command-palette';
import { toast } from 'sonner';

const WorkspacePage: React.FC = () => {
  const [isLeftSidebarCollapsed, setIsLeftSidebarCollapsed] = useState(false);
  const [isRightSidebarCollapsed, setIsRightSidebarCollapsed] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);

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
        toast.success('新文件已创建');
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
      name: '返回仪表盘',
      description: '返回到主仪表盘页面',
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

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* 顶部导航栏 */}
      <header className="h-14 bg-white border-b border-gray-200 flex items-center px-4 shadow-sm z-10">
        <div className="flex items-center space-x-2">
          <div className="bg-blue-600 text-white h-8 w-8 rounded flex items-center justify-center font-bold">
            A
          </div>
          <span className="font-semibold text-lg">AI Assistant</span>
        </div>
        
        <div className="flex-1 flex justify-center">
          <div 
            className="max-w-md w-full bg-gray-50 border border-gray-200 rounded-md flex items-center px-3 cursor-pointer"
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

        <div className="flex items-center space-x-3">
          <Button variant="ghost" size="sm">帮助</Button>
          <div className="h-8 w-8 rounded-full bg-blue-600 text-white flex items-center justify-center">
            <span>U</span>
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
          
          {/* 这里添加文件树组件 */}
          <div className="flex-1 overflow-auto p-2">
            {!isLeftSidebarCollapsed && (
              <div className="py-2">
                <div className="flex items-center text-gray-300 hover:text-white py-1 px-2 rounded hover:bg-gray-700 cursor-pointer">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  <span>workspace.txt</span>
                </div>
                <div className="flex items-center text-gray-300 hover:text-white py-1 px-2 rounded hover:bg-gray-700 cursor-pointer">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  <span>project.json</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 中央工作区 */}
        <div className="flex-1 overflow-auto bg-white">
          <div className="h-full flex items-center justify-center text-gray-400">
            <div className="text-center">
              <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h3 className="text-xl font-medium mb-2">工作区</h3>
              <p className="max-w-md text-sm mb-4">这里将显示您选择的文件或文档内容</p>
              <Button 
                variant="outline" 
                className="text-blue-600 border-blue-600"
                onClick={() => setIsCommandPaletteOpen(true)}
              >
                使用命令 <span className="ml-1 text-xs bg-gray-100 px-1.5 py-0.5 rounded">⌘K</span>
              </Button>
            </div>
          </div>
        </div>

        {/* 右侧边栏 - AI助手 */}
        <div className={`bg-white border-l border-gray-200 flex flex-col ${isRightSidebarCollapsed ? 'w-14' : 'w-80'} transition-all duration-300`}>
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <h2 className={`font-medium ${isRightSidebarCollapsed ? 'hidden' : 'block'}`}>AI 助手</h2>
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
                    content: '您好！我是AI助手，有什么我可以帮助您的吗？',
                    timestamp: new Date()
                  }
                ]}
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