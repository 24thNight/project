import React from 'react';
import { Message } from './ai-chat';
import { motion } from 'framer-motion';

interface MessageBubbleProps {
  message: Message;
  isDarkMode?: boolean;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message, isDarkMode = false }) => {
  // 获取消息头部样式
  const getHeaderStyle = () => {
    switch (message.role) {
      case 'user':
        return 'border-blue-600';
      case 'assistant':
        return isDarkMode ? 'border-gray-600' : 'border-gray-300';
      case 'system':
        return isDarkMode ? 'border-amber-800' : 'border-amber-300';
      default:
        return isDarkMode ? 'border-gray-600' : 'border-gray-300';
    }
  };

  // 获取内容区域样式
  const getContentStyle = () => {
    switch (message.role) {
      case 'user':
        return isDarkMode 
          ? 'bg-transparent text-gray-200' 
          : 'bg-transparent text-gray-800';
      case 'assistant':
        return isDarkMode 
          ? 'bg-transparent text-gray-200' 
          : 'bg-transparent text-gray-800';
      case 'system':
        return isDarkMode 
          ? 'bg-gray-800 text-amber-100 border border-gray-700 rounded-md px-3 py-2' 
          : 'bg-amber-50 text-amber-800 border border-amber-100 rounded-md px-3 py-2';
      default:
        return isDarkMode 
          ? 'bg-transparent text-gray-200' 
          : 'bg-transparent text-gray-800';
    }
  };

  // 格式化时间戳
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // 消息内容可能包含代码块，我们需要渲染它
  const renderContent = (content: string) => {
    // 简单的代码块识别和渲染
    const codeBlockRegex = /```([a-z]*)\n([\s\S]*?)```/g;
    let lastIndex = 0;
    const parts = [];
    let match;

    // 提取并处理代码块
    while ((match = codeBlockRegex.exec(content)) !== null) {
      // 添加代码块之前的文本
      if (match.index > lastIndex) {
        parts.push(
          <span key={`text-${lastIndex}`} className="whitespace-pre-wrap">
            {content.substring(lastIndex, match.index)}
          </span>
        );
      }

      // 添加代码块
      const language = match[1] || 'plaintext';
      const code = match[2];
      parts.push(
        <div key={`code-${match.index}`} className={`my-2 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-800'} text-gray-200 p-3 rounded-md overflow-x-auto`}>
          <div className="text-xs text-gray-400 mb-1">{language}</div>
          <pre className="font-mono text-sm">{code}</pre>
        </div>
      );

      lastIndex = match.index + match[0].length;
    }

    // 添加最后一部分文本（如果有）
    if (lastIndex < content.length) {
      parts.push(
        <span key={`text-${lastIndex}`} className="whitespace-pre-wrap">
          {content.substring(lastIndex)}
        </span>
      );
    }

    return parts.length > 0 ? parts : <span className="whitespace-pre-wrap">{content}</span>;
  };

  return (
    <div className="mb-6">
      {/* 消息头部 - Cursor风格 */}
      <div className={`flex items-center gap-2 mb-2 ${
        message.role === 'system' ? 'hidden' : ''
      }`}>
        {/* 头像 */}
        {message.role === 'assistant' ? (
          <div className={`w-5 h-5 rounded-full flex-shrink-0 overflow-hidden ${isDarkMode ? 'bg-gray-700' : 'bg-blue-100'} flex items-center justify-center`}>
            <svg className={`w-3.5 h-3.5 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
        ) : message.role === 'user' ? (
          <div className={`w-5 h-5 rounded-full flex-shrink-0 overflow-hidden ${isDarkMode ? 'bg-blue-700' : 'bg-blue-100'} flex items-center justify-center`}>
            <span className={`text-xs font-medium ${isDarkMode ? 'text-white' : 'text-blue-600'}`}>U</span>
          </div>
        ) : null}
        
        {/* 角色名称 */}
        <div className={`text-xs font-medium ${
          message.role === 'assistant' 
            ? (isDarkMode ? 'text-gray-300' : 'text-gray-700')
            : message.role === 'user'
              ? (isDarkMode ? 'text-blue-400' : 'text-blue-600')
              : ''
        }`}>
          {message.role === 'user' ? '你' : message.role === 'system' ? '系统' : ''}
        </div>
        
        {/* 引用文件标签 */}
        {message.references && message.references.length > 0 && (
          <div className="flex flex-wrap gap-1 ml-1">
            {message.references.map(file => (
              <div 
                key={file} 
                className={`text-xs rounded px-1.5 py-0.5 flex items-center ${
                  message.role === 'user'
                    ? (isDarkMode ? 'bg-blue-900/50 text-blue-300' : 'bg-blue-100 text-blue-700')
                    : (isDarkMode ? 'bg-gray-800 text-gray-300 border border-gray-700' : 'bg-gray-100 text-gray-700')
                }`}
              >
                <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span>{file}</span>
              </div>
            ))}
          </div>
        )}
        
        {/* 时间戳 */}
        <div className={`text-xs ${
          isDarkMode ? 'text-gray-500' : 'text-gray-400'
        } ml-auto`}>
          {formatTime(message.timestamp)}
        </div>
      </div>
      
      {/* 消息内容 - Cursor风格 */}
      <div className={`pl-7 ${getContentStyle()}`}>
        <div className="text-sm">
          {renderContent(message.content)}
        </div>
      </div>
    </div>
  );
};

export default MessageBubble; 