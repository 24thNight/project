import { useEffect, useRef, useCallback } from 'react';
import { useClarificationStore } from '../store/clarificationStore';
import { clarificationApi } from '../utils/api';
import { Answer, StreamEvent } from '../types';
import { toast } from 'sonner';
import { t } from '../../../lib/i18n';
import { Language } from '../../../lib/i18n';

// 开发环境的日志帮助函数
const devLog = (message: string, ...args: any[]) => {
  if (process.env.NODE_ENV !== 'production') {
    console.log(`[Clarification Session] ${message}`, ...args);
  }
};

export const useClarificationSession = (planId?: string, lang: Language = 'en') => {
  const {
    session,
    isLoading,
    error,
    isStreamingQuestion,
    currentStreamedText,
    initSession,
    resetSession,
    handleStreamEvent,
    setError,
    setLoading,
    addAnswer,
    completeSession,
  } = useClarificationStore();
  
  const streamRef = useRef<{ close: () => void } | null>(null);
  
  // Start a new session
  const startSession = useCallback(async () => {
    devLog('Starting new session');
    try {
      setLoading(true);
      resetSession();
      
      // Start a session via the API
      devLog('Calling API to start session');
      const sessionId = await clarificationApi.startSession(planId, lang);
      devLog('Session started with ID:', sessionId);
      
      // Initialize local session state
      initSession(planId);
      
      // Create SSE connection for question streaming
      if (sessionId) {
        devLog('Creating SSE connection');
        streamRef.current = clarificationApi.createQuestionStream(
          sessionId,
          (event: StreamEvent) => {
            devLog('Stream event received:', event.type);
            handleStreamEvent(event);
          },
          (errorMsg: string) => {
            devLog('Stream error:', errorMsg);
            setError(errorMsg);
          },
          lang
        );
      } else {
        devLog('No session ID returned, cannot create stream');
        setError(t('clarify.error.startFailed', lang));
      }
    } catch (err) {
      devLog('Error starting session:', err);
      setError(t('clarify.error.startFailed', lang));
      toast.error(t('clarify.error.startFailed', lang));
    } finally {
      setLoading(false);
    }
  }, [planId, lang, initSession, resetSession, setLoading, setError, handleStreamEvent]);
  
  // Submit an answer to the current question
  const submitAnswer = useCallback(async (value: string | number) => {
    if (!session || !session.questions.length) {
      devLog('Cannot submit answer: no active session or questions');
      return false;
    }
    
    try {
      const currentQuestion = session.questions[session.currentQuestionIndex];
      
      if (!currentQuestion) {
        devLog('Cannot submit answer: no current question');
        return false;
      }
      
      devLog('Submitting answer to question:', currentQuestion.id);
      
      const answer: Answer = {
        questionId: currentQuestion.id,
        value,
        timestamp: new Date(),
      };
      
      // Add the answer to the local state
      addAnswer(answer);
      
      // Submit the answer to the backend
      if (session.id) {
        devLog('Sending answer to API');
        await clarificationApi.submitAnswer(session.id, answer, lang);
        devLog('Answer submitted successfully');
      } else {
        devLog('Session ID missing, answer only stored locally');
      }
      
      return true;
    } catch (err) {
      devLog('Error submitting answer:', err);
      toast.error(t('api.errors.update', lang));
      return false;
    }
  }, [session, addAnswer, lang]);
  
  // 检查会话是否可以完成
  const canFinishSession = useCallback(() => {
    // 会话必须存在
    if (!session) {
      devLog('canFinishSession失败：会话不存在');
      return false;
    }
    
    // 会话必须已经收到 END 事件，标记为完成
    if (!session.isComplete) {
      devLog('canFinishSession失败：会话未标记为完成');
      return false;
    }
    
    // 所有已接收的问题都必须有对应的答案
    const canFinish = session.questions.length > 0 && session.answers.length >= session.questions.length;
    devLog(`canFinishSession检查结果: ${canFinish}, 问题数: ${session.questions.length}, 答案数: ${session.answers.length}`);
    return canFinish;
  }, [session]);
  
  // Finish the session and generate the plan
  const finishSession = useCallback(async () => {
    if (!session) {
      devLog('Cannot finish session: no active session');
      return null;
    }
    
    // 检查会话是否已经结束
    if (!session.isComplete) {
      devLog('Cannot finish session: question stream has not ended yet');
      return null;
    }
    
    try {
      devLog('Finishing session');
      setLoading(true);
      
      // Mark the session as complete locally
      completeSession();
      
      // Complete the session on the backend and generate the plan
      if (session.id) {
        devLog('Calling API to complete session');
        const generatedPlanId = await clarificationApi.completeSession(session.id, lang);
        devLog('Session completed, plan generated with ID:', generatedPlanId);
        return generatedPlanId;
      } else {
        devLog('Session ID missing, cannot complete session on backend');
      }
      
      return null;
    } catch (err) {
      devLog('Error completing session:', err);
      toast.error(t('api.errors.default', lang));
      return null;
    } finally {
      setLoading(false);
    }
  }, [session, completeSession, setLoading, lang]);
  
  // Cleanup effect
  useEffect(() => {
    return () => {
      // Close the SSE connection when the component unmounts
      if (streamRef.current) {
        devLog('Cleaning up SSE connection on unmount');
        streamRef.current.close();
        streamRef.current = null;
      }
    };
  }, []);
  
  return {
    session,
    isLoading,
    error,
    isStreamingQuestion,
    currentStreamedText,
    startSession,
    submitAnswer,
    finishSession,
    resetSession,
    canFinishSession,
  };
}; 