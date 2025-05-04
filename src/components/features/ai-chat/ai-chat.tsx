import React, { useState, useRef, useEffect } from 'react';
import { Button } from '../../ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import MessageBubble from './message-bubble';
import ThinkingIndicator from './thinking-indicator';
import { toast } from 'sonner';

// 定义消息类型
export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  references?: string[]; // 引用的文件或资源
  imageUrl?: string; // 图片URL
}

// 定义AI模型类型
type AIModel = 'claude-3.7-sonnet' | 'claude-3-opus' | 'gpt-4'; 

// 定义AI模式类型
type AIMode = 'agent' | 'chat' | 'manual';

interface AIChatProps {
  initialMessages?: Message[];
  onSendMessage?: (message: string, references?: string[], imageUrl?: string) => Promise<string>;
  onClose?: () => void;
}

const AIChat: React.FC<AIChatProps> = ({ 
  initialMessages = [], 
  onSendMessage,
  onClose
}) => {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [inputValue, setInputValue] = useState('');
  const [status, setStatus] = useState<'idle' | 'thinking' | 'responding' | 'error'>('idle');
  const [selectedModel, setSelectedModel] = useState<AIModel>('claude-3.7-sonnet');
  const [mode, setMode] = useState<AIMode>('agent');
  const [isModelDropdownOpen, setIsModelDropdownOpen] = useState(false);
  const [isModeDropdownOpen, setIsModeDropdownOpen] = useState(false);
  const [references, setReferences] = useState<string[]>([]);
  const [showReferenceSelector, setShowReferenceSelector] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | undefined>(undefined);
  const [isRecording, setIsRecording] = useState(false);
  const [availableFiles, setAvailableFiles] = useState([
    'workspace.txt', 
    'project.json', 
    'README.md', 
    'src/components/features/plan-tree/plan-tree.tsx'
  ]);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const modelDropdownRef = useRef<HTMLDivElement>(null);
  const modeDropdownRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  
  // 处理点击外部关闭下拉菜单
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modelDropdownRef.current && !modelDropdownRef.current.contains(event.target as Node)) {
        setIsModelDropdownOpen(false);
      }
      if (modeDropdownRef.current && !modeDropdownRef.current.contains(event.target as Node)) {
        setIsModeDropdownOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // 自动滚动到最新消息
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // 自动调整输入框高度
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = 'auto';
      inputRef.current.style.height = `${Math.min(inputRef.current.scrollHeight, 200)}px`;
    }
  }, [inputValue]);

  // 监听容器大小变化
  useEffect(() => {
    if (!chatContainerRef.current) return;
    
    const resizeObserver = new ResizeObserver(() => {
      // 强制更新滚动位置以确保消息可见
      if (messagesEndRef.current) {
        messagesEndRef.current.scrollIntoView({ behavior: 'auto' });
      }
    });
    
    resizeObserver.observe(chatContainerRef.current);
    
    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  const generateId = () => {
    return Date.now().toString(36) + Math.random().toString(36).substring(2);
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() && !imageUrl && status !== 'idle') return;
    
    // 创建用户消息
    const userMessage: Message = {
      id: generateId(),
      role: 'user',
      content: inputValue,
      timestamp: new Date(),
      references: references.length > 0 ? [...references] : undefined,
      imageUrl
    };
    
    // 更新状态并清空输入
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setReferences([]);
    setImageUrl(undefined);
    setShowReferenceSelector(false);
    if (inputRef.current) {
      inputRef.current.style.height = 'auto';
    }
    setStatus('thinking');
    
    try {
      // 如果没有提供onSendMessage回调，使用模拟响应
      const response = onSendMessage 
        ? await onSendMessage(inputValue, references, imageUrl) 
        : await simulateResponse(inputValue, references, imageUrl);
      
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
  const simulateResponse = async (message: string, refs?: string[], img?: string): Promise<string> => {
    // 返回模拟的响应
    return new Promise((resolve) => {
      const responses = [
        "我理解你的问题。让我帮你分析一下...",
        "这是一个很好的问题。根据我的分析...",
        "我可以协助你解决这个问题。首先，你需要...",
        "让我思考一下最佳的解决方案。",
        "根据最新的研究和最佳实践，我建议..."
      ];
      
      let response = responses[Math.floor(Math.random() * responses.length)];
      
      if (message) {
        response += ` 你的问题是关于"${message}"的。`;
      }
      
      // 如果有引用文件，添加相关内容
      if (refs && refs.length > 0) {
        response += ` 我已查看了你引用的文件: ${refs.join(', ')}。`;
      }

      // 如果有图片，添加相关内容
      if (img) {
        response += " 我已分析了你上传的图片。";
      }
      
      if (mode === 'agent') {
        response += " 作为智能体模式，我会主动帮你执行任务和提供解决方案。";
      } else if (mode === 'chat') {
        response += " 作为对话模式，我会回答你的问题，但不会主动执行任务。";
      } else {
        response += " 作为手动模式，我需要你指导我该如何进行操作。";
      }
      
      // 模拟网络延迟
      setTimeout(() => {
        resolve(response);
      }, 1500);
    });
  };

  // 处理输入值变化
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setInputValue(value);
    
    // 检测是否输入了@符号
    if (value.endsWith('@') && !showReferenceSelector) {
      setShowReferenceSelector(true);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    } else if (e.key === '@') {
      setShowReferenceSelector(true);
    } else if (e.key === 'Escape') {
      setShowReferenceSelector(false);
      setIsModelDropdownOpen(false);
      setIsModeDropdownOpen(false);
    }
  };
  
  const handleReferenceSelect = (file: string) => {
    if (!references.includes(file)) {
      setReferences(prev => [...prev, file]);
      toast.success(`已引用 ${file}`);
    }
    setShowReferenceSelector(false);
  };
  
  const handleRemoveReference = (file: string) => {
    setReferences(prev => prev.filter(ref => ref !== file));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // 在实际应用中，你可能需要将文件上传到服务器并获取URL
      // 这里我们仅模拟这个过程，生成一个临时的对象URL
      const tempUrl = URL.createObjectURL(file);
      setImageUrl(tempUrl);
      toast.success(`已上传图片: ${file.name}`);
    }
  };

  const handleVoiceInput = () => {
    if (!('webkitSpeechRecognition' in window)) {
      toast.error('您的浏览器不支持语音识别功能');
      return;
    }

    setIsRecording(!isRecording);
    
    if (!isRecording) {
      // 在实际应用中，你需要使用语音识别API
      // 这里我们仅模拟这个过程
      toast.info('正在录音...');
      setTimeout(() => {
        setInputValue(prev => prev + " [语音输入的文本]");
        setIsRecording(false);
        toast.success('语音识别完成');
      }, 2000);
    } else {
      toast.info('已停止录音');
    }
  };

  const clearImage = () => {
    setImageUrl(undefined);
  };

  const getModeLabel = () => {
    switch (mode) {
      case 'agent': return '智能体模式';
      case 'chat': return '对话模式';
      case 'manual': return '手动模式';
      default: return '智能体模式';
    }
  };

  return (
    <div className="flex flex-col h-full bg-white text-gray-800" ref={chatContainerRef}>
      {/* 修改后的头部样式 - 使用更简单的图标 */}
      <div className="flex justify-between items-center px-4 py-3 bg-gray-50 border-b border-gray-200">
        <div className="flex items-center gap-2.5 text-sm font-medium text-gray-700">
          {/* 使用更简单的AI图标 */}
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M12 4.5v2M19.5 12h-2M12 19.5v-2M4.5 12h2M16.5 7.5l-1.5 1.5M7.5 16.5l1.5-1.5M16.5 16.5l-1.5-1.5M7.5 7.5l1.5 1.5M12 12a3 3 0 100-6 3 3 0 000 6z" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span className="relative" style={{ top: '0.5px' }}>AI 助手</span>
        </div>
        <div className="flex items-center gap-2">
          {/* 模型选择下拉菜单 */}
          <div className="relative" ref={modelDropdownRef}>
            <button 
              className="flex items-center gap-1 px-3 py-1.5 text-sm bg-white hover:bg-gray-100 text-gray-700 border border-gray-300 rounded-md shadow-sm"
              onClick={() => setIsModelDropdownOpen(!isModelDropdownOpen)}
              aria-label="选择AI模型"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              <span className="hidden sm:inline">{selectedModel}</span>
              <span className="sm:inline sm:hidden">AI</span>
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
            {isModelDropdownOpen && (
              <div className="absolute right-0 mt-1 w-48 rounded-md shadow-lg z-10 bg-white border border-gray-200">
                <div className="py-1">
                  <button
                    className={`block px-4 py-2 text-xs w-full text-left ${
                      selectedModel === 'claude-3.7-sonnet' ? 'bg-gray-100' : ''
                    }`}
                    onClick={() => {
                      setSelectedModel('claude-3.7-sonnet');
                      setIsModelDropdownOpen(false);
                    }}
                  >
                    claude-3.7-sonnet
                  </button>
                  <button
                    className={`block px-4 py-2 text-xs w-full text-left ${
                      selectedModel === 'claude-3-opus' ? 'bg-gray-100' : ''
                    }`}
                    onClick={() => {
                      setSelectedModel('claude-3-opus');
                      setIsModelDropdownOpen(false);
                    }}
                  >
                    claude-3-opus
                  </button>
                  <button
                    className={`block px-4 py-2 text-xs w-full text-left ${
                      selectedModel === 'gpt-4' ? 'bg-gray-100' : ''
                    }`}
                    onClick={() => {
                      setSelectedModel('gpt-4');
                      setIsModelDropdownOpen(false);
                    }}
                  >
                    gpt-4
                  </button>
                </div>
              </div>
            )}
          </div>
          
          {/* 模式选择下拉菜单 */}
          <div className="relative" ref={modeDropdownRef}>
            <button 
              className="flex items-center gap-1 px-3 py-1.5 text-sm bg-white hover:bg-gray-100 text-gray-700 border border-gray-300 rounded-md shadow-sm"
              onClick={() => setIsModeDropdownOpen(!isModeDropdownOpen)}
              aria-label="选择AI模式"
            >
              <span className="hidden sm:inline">{getModeLabel()}</span>
              <span className="sm:inline sm:hidden">模式</span>
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
            {isModeDropdownOpen && (
              <div className="absolute right-0 mt-1 w-32 rounded-md shadow-lg z-10 bg-white border border-gray-200">
                <div className="py-1">
                  <button
                    className={`block px-4 py-2 text-xs w-full text-left ${
                      mode === 'agent' ? 'bg-gray-100' : ''
                    }`}
                    onClick={() => {
                      setMode('agent');
                      setIsModeDropdownOpen(false);
                    }}
                  >
                    智能体模式
                  </button>
                  <button
                    className={`block px-4 py-2 text-xs w-full text-left ${
                      mode === 'chat' ? 'bg-gray-100' : ''
                    }`}
                    onClick={() => {
                      setMode('chat');
                      setIsModeDropdownOpen(false);
                    }}
                  >
                    对话模式
                  </button>
                  <button
                    className={`block px-4 py-2 text-xs w-full text-left ${
                      mode === 'manual' ? 'bg-gray-100' : ''
                    }`}
                    onClick={() => {
                      setMode('manual');
                      setIsModeDropdownOpen(false);
                    }}
                  >
                    手动模式
                  </button>
                </div>
              </div>
            )}
          </div>
          
          {/* 关闭按钮 */}
          {onClose && (
            <button 
              onClick={onClose}
              className="flex items-center px-3 py-1.5 text-sm bg-white hover:bg-gray-100 text-gray-700 border border-gray-300 rounded-md shadow-sm"
              aria-label="关闭AI助手"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </div>
      
      {/* 消息历史区域 - Cursor风格 */}
      <div className="flex-1 overflow-y-auto bg-white">
        <div className="px-4 py-4 space-y-6">
          <AnimatePresence>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="max-w-full"
              >
                <MessageBubble message={message} isDarkMode={false} />
              </motion.div>
            ))}
            
            {status === 'thinking' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="max-w-full"
              >
                <ThinkingIndicator isDarkMode={false} />
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* 用于自动滚动的引用元素 */}
          <div ref={messagesEndRef} />
        </div>
      </div>
      
      {/* 显示上传的图片预览 */}
      {imageUrl && (
        <div className="px-3 pt-2 bg-white">
          <div className="relative inline-block">
            <img src={imageUrl} alt="Uploaded" className="max-h-32 rounded-md border border-gray-300" />
            <button 
              className="absolute top-1 right-1 bg-gray-800 bg-opacity-70 text-white rounded-full p-1"
              onClick={clearImage}
              aria-label="删除图片"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}
      
      {/* 底部输入区域 - Cursor风格 */}
      <div className="px-3 pt-2 pb-3 bg-white">
        {/* 显示已选择的引用文件 */}
        {references.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-2 text-gray-700">
            <span className="text-xs mt-0.5">引用文件:</span>
            {references.map(file => (
              <div 
                key={file} 
                className="text-xs rounded px-1.5 py-0.5 flex items-center bg-blue-100 text-blue-800"
              >
                <span className="truncate max-w-[150px]">{file}</span>
                <button 
                  onClick={() => handleRemoveReference(file)}
                  className="ml-1 text-opacity-70 hover:text-opacity-100 flex-shrink-0"
                  aria-label={`删除引用 ${file}`}
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}
        
        <div className="rounded-lg overflow-hidden bg-white border border-gray-300">
          {/* 文本输入区域 */}
          <textarea
            ref={inputRef}
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder={`向 AI 提问... (按 @ 引用文件)`}
            disabled={status !== 'idle'}
            className="w-full px-3 py-2.5 resize-none outline-none bg-white text-gray-800 placeholder-gray-400"
            rows={1}
            style={{ minHeight: '44px', maxHeight: '200px' }}
          />
          
          {/* 底部操作栏 */}
          <div className="flex flex-wrap justify-between items-center px-3 py-2 bg-gray-50 gap-2">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <div className="text-xs text-gray-500 whitespace-nowrap">按 Enter 发送</div>
              
              {/* 引用文件按钮 */}
              <button
                onClick={() => setShowReferenceSelector(!showReferenceSelector)}
                className="text-xs flex items-center text-gray-600 hover:text-gray-700"
                aria-label="引用文件"
              >
                <svg className="w-3.5 h-3.5 mr-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span className="whitespace-nowrap">引用文件</span>
              </button>
              
              {/* 上传图片按钮 */}
              <input 
                type="file" 
                ref={fileInputRef}
                onChange={handleImageUpload}
                accept="image/*"
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="text-xs flex items-center text-gray-600 hover:text-gray-700"
                aria-label="上传图片"
              >
                <svg className="w-3.5 h-3.5 mr-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="whitespace-nowrap">上传图片</span>
              </button>
              
              {/* 语音转文字按钮 */}
              <button
                onClick={handleVoiceInput}
                className={`text-xs flex items-center ${
                  isRecording 
                    ? 'text-red-500' 
                    : 'text-gray-600 hover:text-gray-700'
                }`}
                aria-label={isRecording ? "停止语音录入" : "语音输入"}
              >
                <svg className="w-3.5 h-3.5 mr-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                </svg>
                <span className="whitespace-nowrap">{isRecording ? "录音中..." : "语音输入"}</span>
              </button>
            </div>
            
            <Button 
              onClick={handleSendMessage}
              disabled={(!inputValue.trim() && !imageUrl) || status !== 'idle'}
              className={`h-7 px-3 text-sm font-medium flex-shrink-0 ${
                (!inputValue.trim() && !imageUrl) || status !== 'idle'
                  ? 'opacity-50 cursor-not-allowed'
                  : ''
              } bg-blue-600 hover:bg-blue-700 text-white`}
              aria-label="发送消息"
            >
              发送
            </Button>
          </div>
        </div>
        
        {/* 文件引用选择器 - Cursor风格 */}
        {showReferenceSelector && (
          <div className="mt-1 rounded-md border border-gray-300 bg-white max-h-48 overflow-y-auto shadow-lg">
            <div className="p-2">
              <div className="text-xs font-medium mb-2 px-2">选择要引用的文件：</div>
              <div>
                {availableFiles.map(file => (
                  <div 
                    key={file}
                    className="px-3 py-1.5 text-xs rounded cursor-pointer hover:bg-gray-100"
                    onClick={() => handleReferenceSelect(file)}
                  >
                    <div className="flex items-center">
                      <svg className="w-3.5 h-3.5 mr-2 text-gray-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <span className="truncate">{file}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
        
        {status === 'error' && (
          <div className="text-xs text-red-500 mt-1 ml-2">发送失败，请重试</div>
        )}
      </div>
    </div>
  );
};

export default AIChat; 