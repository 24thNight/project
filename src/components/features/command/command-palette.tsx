import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Input } from '../../ui/input';
import { Command } from '../../../lib/hooks/use-command-palette';
import { useLanguage } from '../../../lib/language-context';

interface CommandPaletteProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  commands: Command[];
  onSelect: (commandId: string) => void;
}

const CommandPalette: React.FC<CommandPaletteProps> = ({ 
  isOpen, 
  setIsOpen,
  commands = [],
  onSelect
}) => {
  const { language } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  
  // 当面板打开时，聚焦到输入框
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);
  
  // 过滤命令
  const filteredCommands = commands.filter(command => 
    command.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    command.description.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // 键盘导航
  const handleKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < filteredCommands.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => prev > 0 ? prev - 1 : 0);
        break;
      case 'Enter':
        e.preventDefault();
        if (filteredCommands[selectedIndex]) {
          executeCommand(filteredCommands[selectedIndex]);
        }
        break;
      case 'Escape':
        e.preventDefault();
        handleClose();
        break;
      default:
        break;
    }
  };
  
  // 执行命令
  const executeCommand = (command: Command) => {
    onSelect(command.id);
    handleClose();
  };
  
  const handleClose = () => {
    setIsOpen(false);
    setSearchTerm('');
    setSelectedIndex(0);
  };
  
  // 点击背景关闭
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-start justify-center pt-20"
          onClick={handleBackdropClick}
        >
          <motion.div 
            className="bg-white rounded-lg shadow-2xl w-full max-w-2xl overflow-hidden"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
          >
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center">
                <svg 
                  className="h-5 w-5 text-gray-400 mr-2" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
                  />
                </svg>
                <Input
                  ref={inputRef}
                  type="text"
                  placeholder={language === 'zh' ? '输入命令或搜索...' : 'Type a command or search...'}
                  className="flex-1 border-none focus:ring-0 text-lg"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setSelectedIndex(0);
                  }}
                  onKeyDown={handleKeyDown}
                />
              </div>
            </div>
            
            <div className="max-h-80 overflow-y-auto">
              {filteredCommands.length > 0 ? (
                <ul>
                  {filteredCommands.map((command, index) => (
                    <li 
                      key={command.id}
                      className={`px-4 py-3 hover:bg-gray-100 cursor-pointer flex items-center ${
                        selectedIndex === index ? 'bg-blue-50 border-l-2 border-blue-500' : ''
                      }`}
                      onClick={() => executeCommand(command)}
                      onMouseEnter={() => setSelectedIndex(index)}
                    >
                      <div className="text-gray-500 mr-3">
                        {command.icon}
                      </div>
                      <div className="flex-1">
                        <div className="font-medium">{command.name}</div>
                        <div className="text-sm text-gray-500">{command.description}</div>
                      </div>
                      {selectedIndex === index && (
                        <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded">
                          {language === 'zh' ? '回车执行' : 'Enter to execute'}
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="py-6 text-center text-gray-500">
                  <svg className="w-12 h-12 mx-auto text-gray-300 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p>{language === 'zh' ? '没有找到匹配的命令' : 'No matching commands found'}</p>
                </div>
              )}
            </div>
            
            <div className="p-3 bg-gray-50 border-t border-gray-200 text-xs text-gray-500 flex justify-between">
              <div className="flex space-x-4">
                <span className="flex items-center">
                  <kbd className="px-1.5 py-0.5 bg-gray-100 rounded border border-gray-300 mr-1">↑</kbd>
                  <kbd className="px-1.5 py-0.5 bg-gray-100 rounded border border-gray-300 mr-1">↓</kbd>
                  <span>{language === 'zh' ? '导航' : 'Navigate'}</span>
                </span>
                <span className="flex items-center">
                  <kbd className="px-1.5 py-0.5 bg-gray-100 rounded border border-gray-300 mr-1">Enter</kbd>
                  <span>{language === 'zh' ? '执行' : 'Execute'}</span>
                </span>
              </div>
              
              <span className="flex items-center">
                <kbd className="px-1.5 py-0.5 bg-gray-100 rounded border border-gray-300 mr-1">Esc</kbd>
                <span>{language === 'zh' ? '关闭' : 'Close'}</span>
              </span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default CommandPalette; 