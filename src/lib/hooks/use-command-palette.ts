import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { useLanguage } from '../language-context';

export interface Command {
  id: string;
  name: string;
  description: string;
  icon?: React.ReactNode;
  action: () => void;
}

/**
 * 命令面板自定义钩子
 * 
 * 用于管理命令面板状态和命令执行
 */
export const useCommandPalette = (customCommands?: Command[]) => {
  const [isOpen, setIsOpen] = useState(false);
  const { language } = useLanguage();
  
  // 提供默认命令
  const defaultCommands: Command[] = [
    {
      id: 'go-to-dashboard',
      name: language === 'zh' ? '返回任务计划' : 'Go to Dashboard',
      description: language === 'zh' ? '返回到任务计划页面' : 'Return to the task planning dashboard',
      action: () => {
        window.location.href = '/dashboard';
      }
    }
  ];
  
  // 合并自定义命令和默认命令
  const commands = [...(customCommands || []), ...defaultCommands];
  
  // 执行命令
  const executeCommand = (commandId: string) => {
    const command = commands.find(cmd => cmd.id === commandId);
    if (command) {
      command.action();
      setIsOpen(false);
    } else {
      toast.error(language === 'zh' ? '找不到命令' : 'Command not found');
    }
  };
  
  // 监听快捷键
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // 检查Cmd+K或Ctrl+K
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(true);
      }
      
      // ESC关闭面板
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);
  
  return {
    isOpen,
    setIsOpen,
    commands,
    executeCommand
  };
};

export default useCommandPalette; 