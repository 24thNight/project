import React from 'react';
import { Message } from './ai-chat';
import { motion } from 'framer-motion';

interface MessageBubbleProps {
  message: Message;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  // 根据消息角色设置不同的样式
  const getBubbleStyle = () => {
    switch (message.role) {
      case 'user':
        return 'bg-blue-600 text-white rounded-tl-2xl rounded-tr-2xl rounded-br-2xl';
      case 'assistant':
        return 'bg-gray-100 text-gray-800 rounded-tl-2xl rounded-tr-2xl rounded-bl-2xl';
      case 'system':
        return 'bg-amber-100 text-amber-800 rounded-2xl';
      default:
        return 'bg-gray-100 text-gray-800 rounded-2xl';
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
        <div key={`code-${match.index}`} className="my-2 bg-gray-800 text-gray-200 p-3 rounded overflow-x-auto">
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
    <div className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-[80%] p-3 ${getBubbleStyle()}`}>
        <div className="text-sm">
          {renderContent(message.content)}
        </div>
        <div className={`text-xs mt-1 ${message.role === 'user' ? 'text-blue-200' : 'text-gray-500'} text-right`}>
          {formatTime(message.timestamp)}
        </div>
      </div>
    </div>
  );
};

export default MessageBubble; 