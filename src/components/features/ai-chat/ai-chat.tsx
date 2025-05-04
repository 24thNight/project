import React, { useState, useRef, useEffect } from 'react';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { motion, AnimatePresence } from 'framer-motion';
import MessageBubble from './message-bubble';
import ThinkingIndicator from './thinking-indicator';

// 定义消息类型
export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
}

interface AIChatProps {
  initialMessages?: Message[];
  onSendMessage?: (message: string) => Promise<string>;
}

const AIChat: React.FC<AIChatProps> = ({ 
  initialMessages = [], 
  onSendMessage 
}) => {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [inputValue, setInputValue] = useState('');
  const [status, setStatus] = useState<'idle' | 'thinking' | 'responding' | 'error'>('idle');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 自动滚动到最新消息
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const generateId = () => {
    return Date.now().toString(36) + Math.random().toString(36).substring(2);
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || status !== 'idle') return;
    
    // 创建用户消息
    const userMessage: Message = {
      id: generateId(),
      role: 'user',
      content: inputValue,
      timestamp: new Date()
    };
    
    // 更新状态并清空输入
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setStatus('thinking');
    
    try {
      // 如果没有提供onSendMessage回调，使用模拟响应
      const response = onSendMessage 
        ? await onSendMessage(inputValue) 
        : await simulateResponse(inputValue);
      
      // 添加AI回复
      const assistantMessage: Message = {
        id: generateId(),
        role: 'assistant',
        content: response,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, assistantMessage]);
      setStatus('idle');
    } catch (error) {
      console.error('Failed to get AI response:', error);
      setStatus('error');
      
      // 添加错误消息
      const errorMessage: Message = {
        id: generateId(),
        role: 'system',
        content: '抱歉，发生了错误。请稍后再试。',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, errorMessage]);
      setTimeout(() => setStatus('idle'), 3000);
    }
  };

  // 模拟AI响应，仅用于演示
  const simulateResponse = async (message: string): Promise<string> => {
    // 返回模拟的响应
    return new Promise((resolve) => {
      const responses = [
        "我理解你的问题。让我帮你分析一下...",
        "这是一个很好的问题。根据我的分析...",
        "我可以协助你解决这个问题。首先，你需要...",
        "让我思考一下最佳的解决方案。",
        "根据最新的研究和最佳实践，我建议..."
      ];
      
      // 模拟网络延迟
      setTimeout(() => {
        const randomResponse = responses[Math.floor(Math.random() * responses.length)];
        resolve(`${randomResponse} 你的问题是关于"${message}"的。`);
      }, 1500);
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* 消息历史区域 */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <AnimatePresence>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <MessageBubble message={message} />
            </motion.div>
          ))}
          
          {status === 'thinking' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <ThinkingIndicator />
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* 用于自动滚动的引用元素 */}
        <div ref={messagesEndRef} />
      </div>
      
      {/* 底部输入区域 */}
      <div className="border-t border-gray-200 p-4">
        <div className="flex items-center space-x-2">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="输入您的问题或命令..."
            disabled={status !== 'idle'}
            className="flex-1"
          />
          <Button 
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || status !== 'idle'}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Button>
        </div>
        <div className="flex justify-between items-center mt-2">
          <div className="text-xs text-gray-500">按Enter发送，Shift+Enter换行</div>
          {status === 'error' && (
            <div className="text-xs text-red-500">发送失败，请重试</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AIChat; 