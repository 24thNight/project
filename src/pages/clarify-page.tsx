import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useLanguage } from '../lib/language-context';
import { Button } from '../components/ui/button';
import { toast } from 'sonner';

// Assume API base URL is configured elsewhere or use environment variable
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000'; // Adjust if needed

// 日志辅助函数，仅在开发环境输出
const devLog = (message: string, ...args: any[]) => {
  if (process.env.NODE_ENV !== 'production') {
    console.log(message, ...args);
  }
};

// 错误日志辅助函数，仅在开发环境输出
const devError = (message: string, ...args: any[]) => {
  if (process.env.NODE_ENV !== 'production') {
    console.error(message, ...args);
  }
};

interface ClarifyPageState {
  taskTitle: string;
  questions: string[];
  answers: string[];
}

const ClarifyPage: React.FC = () => {
  devLog("[ClarifyPage] Component mounted.");
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [taskTitle, setTaskTitle] = useState<string>('');
  const [questions, setQuestions] = useState<string[]>([]);
  const [answers, setAnswers] = useState<Record<number, string>>({}); // Store answers by index
  const [currentIndex, setCurrentIndex] = useState(0); // Index of the question being currently asked/answered
  const [currentInput, setCurrentInput] = useState('');
  const [isLoading, setIsLoading] = useState(true); // Loading state for initial questions
  const [isEnded, setIsEnded] = useState(false); // Flag for receiving [END]
  const eventSourceRef = useRef<EventSource | null>(null);
  const inputRef = useRef<HTMLInputElement>(null); // Ref for focusing input

  // Effect for Initialization (Fetch title, POST, SSE)
  useEffect(() => {
    const title = searchParams.get('taskTitle');
    if (!title) {
      toast.error(t('clarify.error.missingTitle'));
      navigate('/dashboard');
      return;
    }

    const decodedTitle = decodeURIComponent(title);
    setTaskTitle(decodedTitle);
    setIsLoading(true);

    // 创建清理函数，确保在任何情况下都能关闭SSE连接
    const cleanupSSE = () => {
      if (eventSourceRef.current) {
        devLog('[ClarifyPage] Cleaning up SSE connection');
        eventSourceRef.current.close();
        eventSourceRef.current = null;
      }
    };

    // Function to start the process
    const startClarification = async () => {
      try {
        // Close previous connection if exists before starting a new one
        cleanupSSE();

        // 1. Send POST request to start backend process
        devLog('[ClarifyPage] Sending POST /api/clarify/start');
        const postResponse = await fetch(`${API_BASE_URL}/api/clarify/start`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ taskTitle: decodedTitle }),
        });

        if (!postResponse.ok) {
          devError('POST request failed:', postResponse.statusText);
          toast.error(t('clarify.error.startFailed'));
          // Decide if we should still try to connect to SSE or redirect
          // For mock, we can continue to SSE
          // navigate('/dashboard');
          // return;
        }
        devLog('[ClarifyPage] POST request successful');

        // 2. Establish SSE connection
        devLog(`[ClarifyPage] Establishing SSE connection to /api/clarify/stream?taskTitle=${encodeURIComponent(decodedTitle)}`);
        const es = new EventSource(`${API_BASE_URL}/api/clarify/stream?taskTitle=${encodeURIComponent(decodedTitle)}`);
        eventSourceRef.current = es;

        es.onopen = () => {
          devLog('[ClarifyPage] SSE Connection Opened');
          setIsLoading(false); // Stop loading once connection is open
        };

        es.onmessage = (event) => {
          devLog('[ClarifyPage] SSE Message Received:', event.data);
          if (event.data === '[END]') {
            devLog('[ClarifyPage] SSE Received [END] marker');
            setIsEnded(true);
            cleanupSSE(); // 使用统一的清理函数
          } else {
            // Add new question
            setQuestions(prev => [...prev, event.data]);
          }
        };

        es.onerror = (error) => {
          devError('[ClarifyPage] SSE Error:', error);
          toast.error(t('clarify.error.sseError'));
          setIsLoading(false);
          setIsEnded(true); // Assume ended on error to prevent getting stuck
          cleanupSSE(); // 使用统一的清理函数
        };

      } catch (error) {
        devError('[ClarifyPage] Error during clarification start:', error);
        toast.error(t('clarify.error.generic'));
        setIsLoading(false);
        // Maybe navigate back or show error state
        navigate('/dashboard');
      }
    };

    startClarification();

    // 组件卸载时清理
    return cleanupSSE;
  }, [searchParams, navigate, t]);

  // Effect for Navigation when finished
  useEffect(() => {
    // Check if all received questions have been answered AND the [END] marker was received
    if (isEnded && questions.length > 0 && currentIndex === questions.length) {
      devLog('[ClarifyPage] All questions answered and END received. Navigating to /plan...');
      // Convert answers record to simple array in order
      const finalAnswers = questions.map((_, index) => answers[index] || ''); // Get answer or empty string

      // Short delay before navigation
      const timer = setTimeout(() => {
        navigate('/plan', {
          state: { taskTitle, answers: finalAnswers, questions } as ClarifyPageState
        });
      }, 300); // 减少延迟时间
      return () => clearTimeout(timer);
    }
  }, [currentIndex, questions, answers, isEnded, taskTitle, navigate]);

  // Effect to focus input when current question changes
  useEffect(() => {
    if (currentIndex < questions.length && !isEnded) {
      inputRef.current?.focus();
    }
  }, [currentIndex, questions.length, isEnded]);

  // Handle answer submission
  const handleSubmitAnswer = useCallback(() => {
    if (currentInput.trim() === '' || currentIndex >= questions.length) return;

    devLog(`[ClarifyPage] Submitting answer for index ${currentIndex}:`, currentInput.trim());
    setAnswers(prev => ({ ...prev, [currentIndex]: currentInput.trim() }));
    setCurrentInput('');
    setCurrentIndex(prev => prev + 1);
  }, [currentInput, currentIndex, questions.length]);

  // Handle input keydown (Enter)
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSubmitAnswer();
    }
  };

  // 处理返回Dashboard
  const handleBackToDashboard = () => {
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 md:p-6 zen-bg">
      <div className="max-w-2xl w-full bg-white rounded-xl shadow-lg p-6 md:p-10 space-y-6 md:space-y-8">
        {/* Task Title Display */}
        <div className="text-center border-b pb-4 mb-4">
          <p className="text-sm text-gray-500 mb-1">{t('clarify.yourGoal')}</p>
          <h1 className="text-xl md:text-2xl font-semibold text-gray-800">{taskTitle}</h1>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="rounded-full h-8 w-8 border-b-2 border-indigo-600 mb-4"></div>
            <p className="text-gray-600">{t('clarify.loadingQuestions')}</p>
          </div>
        )}

        {/* Q&A Area */}
        {!isLoading && (
          <div className="space-y-6">
            {questions.map((question, index) => (
              // Only render answered questions and the current one
              index <= currentIndex && (
                <div key={index} className="overflow-hidden">
                  <div className={`p-4 rounded-lg ${index < currentIndex ? 'bg-gray-50' : 'bg-indigo-50 border border-indigo-100'}`}>
                    {/* Question */}
                    <p className="text-gray-800 mb-3">
                      <span className="font-medium">Q{index + 1}:</span> {question}
                    </p>

                    {/* Answer Display (for answered questions) */}
                    {index < currentIndex && answers[index] && (
                      <div className="ml-4 pl-3 border-l-2 border-indigo-200">
                        <p className="text-indigo-700 italic">{answers[index]}</p>
                      </div>
                    )}

                    {/* Input Box (for current question) */}
                    {index === currentIndex && !isEnded && (
                      <div className="mt-3 ml-4">
                        <div className="relative">
                          <input
                            ref={inputRef}
                            type="text"
                            value={currentInput}
                            onChange={(e) => setCurrentInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder={t('clarify.answerPlaceholder')}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            disabled={currentIndex !== index || isEnded} // Disable if not current or ended
                            aria-label={`Answer to question ${index + 1}`}
                          />
                          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-gray-400 pointer-events-none">
                            {t('clarify.enterToSubmit')}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )
            ))}

            {/* Waiting/Completion Message */}
            {currentIndex < questions.length && !isEnded && (
              <div className="text-center text-gray-500 pt-4">
                {t('clarify.waitingNext')}
              </div>
            )}
            {isEnded && currentIndex === questions.length && (
              <div className="text-center text-indigo-600 font-medium pt-4">
                {t('clarify.allQuestionsAnswered')}
              </div>
            )}
          </div>
        )}

        {/* No explicit buttons as per requirement */}

      </div>
    </div>
  );
};

export default ClarifyPage; 