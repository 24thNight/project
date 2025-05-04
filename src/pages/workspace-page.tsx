import React, { useState } from 'react';
import AIChat from '../components/features/ai-chat/ai-chat';
import CommandPalette from '../components/features/command/command-palette';
import FileExplorer from '../components/features/workspace/file-explorer';
import FileEditor from '../components/features/workspace/file-editor';
import ResizablePanel from '../components/features/workspace/resizable-panel';
import Navbar from '../components/layouts/navbar';
import { toast } from 'sonner';
import { useLanguage } from '../lib/language-context';
import { Command, useCommandPalette } from '../lib/hooks/use-command-palette';

// 文件内容类型定义
interface FileContents {
  [key: string]: string;
}

/**
 * 工作空间页面
 * 
 * 集成式AI工作环境，可与AI助手交互，管理任务和文件
 */
const WorkspacePage: React.FC = () => {
  const { t, language } = useLanguage();
  const [isLeftSidebarCollapsed, setIsLeftSidebarCollapsed] = useState(false);
  const [isRightSidebarCollapsed, setIsRightSidebarCollapsed] = useState(false);
  
  // 文件状态
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

  // 定义命令
  const workspaceCommands: Command[] = [
    {
      id: 'new-file',
      name: language === 'zh' ? '新建文件' : 'New File',
      description: language === 'zh' ? '创建一个新的文件' : 'Create a new file',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
      ),
      action: () => {
        const fileName = prompt(language === 'zh' ? '请输入文件名:' : 'Enter file name:');
        if (fileName && !openFiles.includes(fileName)) {
          setOpenFiles(prev => [...prev, fileName]);
          setFileContents(prev => ({
            ...prev,
            [fileName]: ''
          }));
          setCurrentFile(fileName);
          toast.success(language === 'zh' ? `文件 ${fileName} 已创建` : `File ${fileName} created`);
        }
      }
    },
    {
      id: 'toggle-left-sidebar',
      name: language === 'zh' ? '切换左侧栏' : 'Toggle Left Sidebar',
      description: language === 'zh' ? '显示或隐藏左侧文件栏' : 'Show or hide the file explorer',
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
      name: language === 'zh' ? '切换AI助手' : 'Toggle AI Assistant',
      description: language === 'zh' ? '显示或隐藏右侧AI助手' : 'Show or hide the AI assistant panel',
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
      name: language === 'zh' ? '询问AI' : 'Ask AI',
      description: language === 'zh' ? '直接向AI助手提问' : 'Ask a question to the AI assistant',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      ),
      action: () => {
        setIsRightSidebarCollapsed(false);
        toast.info(language === 'zh' ? '请在AI助手栏中提问' : 'Please ask in the AI assistant panel');
      }
    }
  ];
  
  // 使用命令面板钩子
  const { isOpen, setIsOpen, commands, executeCommand } = useCommandPalette(workspaceCommands);
  
  // 文件操作处理函数
  const handleFileClick = (fileName: string) => {
    setCurrentFile(fileName);
  };
  
  const handleCreateFile = (fileName: string) => {
    if (!openFiles.includes(fileName)) {
      setOpenFiles(prev => [...prev, fileName]);
      setFileContents(prev => ({
        ...prev,
        [fileName]: ''
      }));
      setCurrentFile(fileName);
    }
  };
  
  const handleContentChange = (fileName: string, content: string) => {
    setFileContents(prev => ({
      ...prev,
      [fileName]: content
    }));
  };

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
  
  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* 顶部导航栏 */}
      <Navbar onOpenCommandPalette={() => setIsOpen(true)} />
      
      {/* 主体内容 */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* 左侧文件浏览器 */}
        <ResizablePanel
          initialWidth={256}
          position="left"
          isCollapsed={isLeftSidebarCollapsed}
          onToggleCollapse={() => setIsLeftSidebarCollapsed(!isLeftSidebarCollapsed)}
        >
          <FileExplorer
            openFiles={openFiles}
            currentFile={currentFile}
            fileContents={fileContents}
            onFileClick={handleFileClick}
            onCreateFile={handleCreateFile}
          />
        </ResizablePanel>
        
        {/* 中间编辑器区域 */}
        <main className="flex-1 overflow-hidden">
          <FileEditor
            currentFile={currentFile}
            fileContents={fileContents}
            onContentChange={handleContentChange}
          />
        </main>
        
        {/* 右侧AI助手 */}
        <ResizablePanel
          initialWidth={384}
          position="right"
          isCollapsed={isRightSidebarCollapsed}
          onToggleCollapse={() => setIsRightSidebarCollapsed(!isRightSidebarCollapsed)}
        >
          <AIChat onSendMessage={handleSendMessage} />
        </ResizablePanel>
      </div>
      
      {/* 命令面板 */}
      {isOpen && (
        <CommandPalette
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          commands={commands}
          onSelect={executeCommand}
        />
      )}
    </div>
  );
};

export default WorkspacePage; 