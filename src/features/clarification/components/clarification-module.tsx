import React, { useState, useRef, useEffect, useCallback } from 'react';
import { toast } from 'sonner';

// 定义问答组件的通用类型
export interface Question {
  id: string;
  text: string;
}

export interface Answer {
  questionId: string;
  text: string;
}

export interface QuestionAnswerResult {
  questions: Question[];
  answers: Answer[];
  metadata?: Record<string, any>;
}

// 组件属性定义
interface QuestionAnswerModuleProps {
  // 基本配置
  title: string;
  description?: string;
  
  // 数据源和回调
  onFetchQuestions: (metadata?: Record<string, any>) => Promise<Question[]> | Question[] | null;
  onStreamQuestions?: (
    onQuestion: (question: Question) => void, 
    onComplete: () => void, 
    onError: (error: any) => void,
    metadata?: Record<string, any>
  ) => () => void; // 返回清理函数
  onComplete: (result: QuestionAnswerResult) => void;
  onCancel: () => void;
  
  // 自定义选项
  metadata?: Record<string, any>;
  showProgressIndicator?: boolean;
  autoFocus?: boolean;
  
  // 界面定制
  language?: 'en' | 'zh';
  className?: string;
  customStyles?: {
    container?: string;
    title?: string;
    questionBox?: string;
    answerBox?: string;
    input?: string;
    button?: string;
  };
}

// 多语言支持
const translations = {
  en: {
    yourGoal: 'Your Goal:',
    loading: 'Loading questions...',
    answerPlaceholder: 'Type your answer...',
    enterToSubmit: 'Press Enter to submit',
    waitingNext: 'Waiting for the next question...',
    allQuestionsAnswered: 'All questions answered. Processing...',
    waitingMoreQuestions: 'Please wait for more questions',
    answerAllFirst: 'Please answer all questions first',
    allQuestionsReceived: "All questions received! You can continue when you've answered all questions.",
    pleaseAnswerAll: 'Please complete all questions before continuing',
    generatingResult: 'Generating result...',
    continue: 'Continue',
    back: 'Back',
    errors: {
      missingTitle: 'Missing title',
      fetchFailed: 'Failed to fetch questions',
      streamError: 'Error connecting to the server',
      generic: 'An error occurred'
    }
  },
  zh: {
    yourGoal: '目标：',
    loading: '正在加载问题...',
    answerPlaceholder: '输入你的回答...',
    enterToSubmit: '按Enter提交',
    waitingNext: '等待下一个问题...',
    allQuestionsAnswered: '所有问题已回答完毕，正在处理...',
    waitingMoreQuestions: '请等待更多问题',
    answerAllFirst: '请先回答所有问题',
    allQuestionsReceived: "所有问题已接收完毕！完成所有问题后即可继续。",
    pleaseAnswerAll: '请在继续前完成所有问题',
    generatingResult: '正在生成结果...',
    continue: '继续',
    back: '返回',
    errors: {
      missingTitle: '缺少标题',
      fetchFailed: '获取问题失败',
      streamError: '连接服务器时出错',
      generic: '发生错误'
    }
  }
};

// 日志辅助函数，仅在开发环境输出
const devLog = (message: string, ...args: any[]) => {
  if (process.env.NODE_ENV !== 'production') {
    console.log(`[QuestionAnswerModule] ${message}`, ...args);
  }
};

// 错误日志辅助函数，仅在开发环境输出
const devError = (message: string, ...args: any[]) => {
  if (process.env.NODE_ENV !== 'production') {
    console.error(`[QuestionAnswerModule] ${message}`, ...args);
  }
};

/**
 * 通用问答组件
 * 支持静态问题集或流式接收问题
 * 可用于调查问卷、需求澄清、引导式对话等场景
 */
const QuestionAnswerModule: React.FC<QuestionAnswerModuleProps> = ({
  title,
  description,
  onFetchQuestions,
  onStreamQuestions,
  onComplete,
  onCancel,
  metadata = {},
  showProgressIndicator = true,
  autoFocus = true,
  language = 'en',
  className = '',
  customStyles = {}
}) => {
  // 翻译函数
  const t = (key: string): string => {
    const keys = key.split('.');
    let value: any = translations[language];
    
    for (const k of keys) {
      if (value && value[k]) {
        value = value[k];
      } else {
        return key; // 未找到翻译时返回原键名
      }
    }
    
    return value;
  };

  // 状态管理
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Record<string, string>>({}); // 按问题ID存储答案
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentInput, setCurrentInput] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isComplete, setIsComplete] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const cleanupRef = useRef<(() => void) | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // 初始化：获取问题
  useEffect(() => {
    if (!title) {
      toast.error(t('errors.missingTitle'));
      onCancel();
      return;
    }

    setIsLoading(true);
    setError(null);

    // 使用流式接口获取问题
    if (onStreamQuestions) {
      try {
        devLog('设置流式问题接收');
        
        // 处理新问题
        const handleNewQuestion = (question: Question) => {
          setQuestions(prev => [...prev, question]);
          setIsLoading(false);
        };
        
        // 处理流结束
        const handleStreamComplete = () => {
          devLog('问题流接收完成');
          setIsComplete(true);
        };
        
        // 处理错误
        const handleStreamError = (error: any) => {
          devError('流接收错误:', error);
          toast.error(t('errors.streamError'));
          setError(t('errors.streamError'));
          setIsLoading(false);
        };
        
        // 设置流处理，获取清理函数
        const cleanup = onStreamQuestions(
          handleNewQuestion,
          handleStreamComplete,
          handleStreamError,
          metadata
        );
        
        // 保存清理函数
        cleanupRef.current = cleanup;
        
      } catch (error) {
        devError('设置流接收时出错:', error);
        toast.error(t('errors.generic'));
        setError(t('errors.generic'));
        setIsLoading(false);
      }
    }
    // 使用普通方法获取问题
    else {
      const fetchQuestions = async () => {
        try {
          devLog('获取问题集');
          const result = await onFetchQuestions(metadata);
          
          if (result) {
            setQuestions(result);
            setIsComplete(true); // 静态问题集一次性全部加载完毕
          } else {
            devError('获取问题返回空值');
            toast.error(t('errors.fetchFailed'));
            setError(t('errors.fetchFailed'));
          }
          
          setIsLoading(false);
        } catch (error) {
          devError('获取问题时出错:', error);
          toast.error(t('errors.generic'));
          setError(t('errors.generic'));
          setIsLoading(false);
        }
      };
      
      fetchQuestions();
    }

    // 组件卸载时清理
    return () => {
      if (cleanupRef.current) {
        devLog('执行清理函数');
        cleanupRef.current();
        cleanupRef.current = null;
      }
    };
  }, [title, onFetchQuestions, onStreamQuestions, onCancel, t, metadata]);

  // 当所有问题回答完毕且问题流结束时检查是否可以完成
  useEffect(() => {
    const allQuestionsReceived = isComplete;
    const allQuestionsAnswered = questions.length > 0 && 
      questions.every(q => answers[q.id] !== undefined);
    
    // 如果所有问题都已接收并回答，自动完成
    if (allQuestionsReceived && allQuestionsAnswered && currentIndex === questions.length) {
      devLog('所有问题已回答并且流已结束，准备完成');
      
      // 转换答案格式
      const formattedAnswers = questions.map(question => ({
        questionId: question.id,
        text: answers[question.id] || ''
      }));
      
      // 返回结果
      onComplete({
        questions,
        answers: formattedAnswers,
        metadata
      });
    }
  }, [currentIndex, questions, answers, isComplete, onComplete, metadata]);

  // 当切换当前问题时自动聚焦输入框
  useEffect(() => {
    if (autoFocus && currentIndex < questions.length && !isComplete) {
      inputRef.current?.focus();
    }
  }, [currentIndex, questions.length, isComplete, autoFocus]);

  // 提交当前问题的答案
  const handleSubmitAnswer = useCallback(() => {
    if (currentInput.trim() === '' || currentIndex >= questions.length) return;

    const currentQuestion = questions[currentIndex];
    devLog(`提交问题 ${currentQuestion.id} 的答案:`, currentInput.trim());
    
    setAnswers(prev => ({ 
      ...prev, 
      [currentQuestion.id]: currentInput.trim() 
    }));
    
    setCurrentInput('');
    setCurrentIndex(prev => prev + 1);
  }, [currentInput, currentIndex, questions]);

  // 处理按键事件（回车提交）
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSubmitAnswer();
    }
  };

  // 处理继续按钮点击 - 如果所有问题都已回答可以完成
  const handleContinue = () => {
    const allAnswered = questions.length > 0 && 
      questions.every(q => answers[q.id] !== undefined);
      
    if (isComplete && allAnswered) {
      // 转换答案格式
      const formattedAnswers = questions.map(question => ({
        questionId: question.id,
        text: answers[question.id] || ''
      }));
      
      // 返回结果
      onComplete({
        questions,
        answers: formattedAnswers,
        metadata
      });
    } else {
      toast.error(t('pleaseAnswerAll'));
    }
  };

  // 计算已回答的问题数
  const answeredCount = questions.filter(q => answers[q.id] !== undefined).length;
  const totalQuestions = questions.length;
  const progress = totalQuestions > 0 ? (answeredCount / totalQuestions) * 100 : 0;

  // 合并自定义样式
  const styles = {
    container: `bg-white rounded-xl shadow-lg p-6 md:p-10 space-y-6 md:space-y-8 max-w-2xl w-full mx-auto ${className} ${customStyles.container || ''}`,
    title: `text-center border-b pb-4 mb-4 ${customStyles.title || ''}`,
    questionBox: `p-4 rounded-lg ${customStyles.questionBox || ''}`,
    answerBox: `mt-3 ml-4 ${customStyles.answerBox || ''}`,
    input: `w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${customStyles.input || ''}`,
    button: `px-4 py-2 rounded-lg transition-colors ${customStyles.button || ''}`
  };

  return (
    <div className={styles.container}>
      {/* 标题区域 */}
      <div className={styles.title}>
        <p className="text-sm text-gray-500 mb-1">{t('yourGoal')}</p>
        <h1 className="text-xl md:text-2xl font-semibold text-gray-800">{title}</h1>
        {description && <p className="text-gray-600 mt-2">{description}</p>}
      </div>

      {/* 进度指示器 */}
      {showProgressIndicator && questions.length > 0 && (
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div 
            className="bg-indigo-600 h-2.5 rounded-full transition-all duration-300 ease-in-out" 
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      {/* 加载状态 */}
      {isLoading && (
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <div className="rounded-full h-8 w-8 border-b-2 border-indigo-600 mb-4 animate-spin"></div>
          <p className="text-gray-600">{t('loading')}</p>
        </div>
      )}

      {/* 错误状态 */}
      {error && !isLoading && (
        <div className="text-center py-6">
          <div className="text-red-500 mb-4">
            <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <p className="mt-2">{error}</p>
          </div>
          <button 
            onClick={onCancel}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            {t('back')}
          </button>
        </div>
      )}

      {/* 问答区域 */}
      {!isLoading && !error && (
        <div className="space-y-6">
          {questions.map((question, index) => (
            // 仅渲染已回答的问题和当前问题
            index <= currentIndex && (
              <div key={question.id} className="overflow-hidden">
                <div className={`${styles.questionBox} ${index < currentIndex ? 'bg-gray-50' : 'bg-indigo-50 border border-indigo-100'}`}>
                  {/* 问题 */}
                  <p className="text-gray-800 mb-3">
                    <span className="font-medium">Q{index + 1}:</span> {question.text}
                  </p>

                  {/* 已回答问题的答案显示 */}
                  {index < currentIndex && answers[question.id] && (
                    <div className="ml-4 pl-3 border-l-2 border-indigo-200">
                      <p className="text-indigo-700 italic">{answers[question.id]}</p>
                    </div>
                  )}

                  {/* 当前问题的输入框 */}
                  {index === currentIndex && !isComplete && (
                    <div className={styles.answerBox}>
                      <div className="relative">
                        <input
                          ref={inputRef}
                          type="text"
                          value={currentInput}
                          onChange={(e) => setCurrentInput(e.target.value)}
                          onKeyDown={handleKeyDown}
                          placeholder={t('answerPlaceholder')}
                          className={styles.input}
                          disabled={currentIndex !== index || isComplete}
                          aria-label={`Answer to question ${index + 1}`}
                        />
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-gray-400 pointer-events-none">
                          {t('enterToSubmit')}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )
          ))}

          {/* 等待/完成消息 */}
          {!isLoading && !error && (
            <div className="text-center py-4">
              {/* 情况1：问题仍在流入，当前问题已回答 */}
              {!isComplete && currentIndex === questions.length && questions.length > 0 && (
                <div className="text-indigo-600">
                  <div className="flex justify-center space-x-2 mb-2">
                    <div className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                  <p>{t('waitingNext')}</p>
                </div>
              )}

              {/* 情况2：所有问题已回答且流结束 */}
              {isComplete && currentIndex === questions.length && questions.length > 0 && questions.every(q => answers[q.id] !== undefined) && (
                <div className="text-green-600">
                  <svg className="w-6 h-6 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <p>{t('allQuestionsAnswered')}</p>
                </div>
              )}

              {/* 情况3：流结束但并非所有问题都已回答 */}
              {isComplete && currentIndex < questions.length && (
                <div className="text-gray-600">
                  <svg className="w-6 h-6 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p>{t('allQuestionsReceived')}</p>
                </div>
              )}
            </div>
          )}
          
          {/* 操作按钮 */}
          <div className="flex justify-between pt-4 border-t">
            <button 
              onClick={onCancel}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              {t('back')}
            </button>
            
            <button 
              onClick={handleContinue}
              disabled={!isComplete || !questions.every(q => answers[q.id] !== undefined)}
              className={`${styles.button} ${
                isComplete && questions.every(q => answers[q.id] !== undefined)
                  ? 'bg-indigo-600 hover:bg-indigo-700 text-white'
                  : 'bg-indigo-300 cursor-not-allowed text-white'
              }`}
            >
              {t('continue')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuestionAnswerModule; 