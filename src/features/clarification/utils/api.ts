import axios from 'axios';
import { toast } from 'sonner';
import { t } from '../../../lib/i18n';
import { Language } from '../../../lib/i18n';
import { Answer, StreamEvent } from '../types';
import { mockClarificationApi } from './mock-api';

// API base URL - should be configured based on environment
const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://jjnucnlvlsaj.sealoshzh.site';

// 是否使用模拟API - 在以下情况使用模拟:
// 1. 开发环境 (默认启用)
// 2. 通过URL参数useMock=true显式启用
// 3. 可以通过URL参数useMock=false显式禁用
const shouldUseMockApi = () => {
  // 如果不是开发环境，永远不使用模拟
  if (process.env.NODE_ENV === 'production') {
    return false;
  }
  
  // 检查是否通过URL参数配置
  if (typeof window !== 'undefined') {
    const urlParams = new URLSearchParams(window.location.search);
    const mockParam = urlParams.get('useMock');
    
    // 如果URL参数明确指定了是否使用模拟
    if (mockParam !== null) {
      return mockParam === 'true';
    }
  }
  
  // 检查环境变量配置
  if (process.env.REACT_APP_USE_MOCK === 'false') {
    return false;
  }
  
  // 开发环境下默认启用模拟
  return true;
};

// 用于开发时查看是否使用了模拟API
if (process.env.NODE_ENV !== 'production') {
  console.log(`[Clarification API] Using ${shouldUseMockApi() ? 'MOCK' : 'REAL'} API`);
}

// Create axios instance with the same config as the main API
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: false,
});

// Response interface according to project requirements
interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

// Error handling helper
const handleApiError = (error: any, lang: Language = 'en'): never => {
  let errorMessage = t('api.errors.default', lang);

  if (error && error.response) {
    if (error.response.data?.message) {
      errorMessage = error.response.data.message;
    }
  } else if (error && error.request) {
    errorMessage = t('api.errors.network', lang);
  }

  toast.error(errorMessage);
  throw error;
};

export const clarificationApi = {
  // Start a new clarification session
  startSession: async (planId?: string, lang: Language = 'en') => {
    // 使用模拟API
    if (shouldUseMockApi()) {
      try {
        return await mockClarificationApi.startSession(planId);
      } catch (error) {
        console.error('[Mock API] Error starting session:', error);
        return handleApiError(error, lang);
      }
    }
    
    // 使用真实API
    try {
      const response = await api.post<ApiResponse<{ sessionId: string }>>(
        '/clarification/sessions', 
        { planId }
      );
      return response.data.data.sessionId;
    } catch (error) {
      return handleApiError(error, lang);
    }
  },
  
  // Submit an answer to a question
  submitAnswer: async (sessionId: string, answer: Answer, lang: Language = 'en') => {
    // 使用模拟API
    if (shouldUseMockApi()) {
      try {
        return await mockClarificationApi.submitAnswer(sessionId, answer);
      } catch (error) {
        console.error('[Mock API] Error submitting answer:', error);
        return handleApiError(error, lang);
      }
    }
    
    // 使用真实API
    try {
      const response = await api.post<ApiResponse<{ success: boolean }>>(
        `/clarification/sessions/${sessionId}/answers`,
        { answer }
      );
      return response.data.data.success;
    } catch (error) {
      return handleApiError(error, lang);
    }
  },
  
  // Complete the session and generate the plan
  completeSession: async (sessionId: string, lang: Language = 'en') => {
    // 使用模拟API
    if (shouldUseMockApi()) {
      try {
        return await mockClarificationApi.completeSession(sessionId);
      } catch (error) {
        console.error('[Mock API] Error completing session:', error);
        return handleApiError(error, lang);
      }
    }
    
    // 使用真实API
    try {
      const response = await api.post<ApiResponse<{ planId: string }>>(
        `/clarification/sessions/${sessionId}/complete`
      );
      return response.data.data.planId;
    } catch (error) {
      return handleApiError(error, lang);
    }
  },
  
  // Create an SSE connection for streaming questions
  createQuestionStream: (
    sessionId: string, 
    onEvent: (event: StreamEvent) => void,
    onError: (error: string) => void,
    lang: Language = 'en'
  ): { close: () => void } => {
    // 使用模拟API
    if (shouldUseMockApi()) {
      console.log('[Mock API] Creating mock question stream');
      return mockClarificationApi.createQuestionStream(sessionId, onEvent, onError);
    }
    
    // 使用真实API
    // Check if EventSource is available
    if (!window.EventSource) {
      onError(t('clarify.error.sseError', lang));
      return { close: () => {} };
    }
    
    // Create the SSE connection
    const eventSource = new EventSource(
      `${API_BASE_URL}/clarification/sessions/${sessionId}/stream`
    );
    
    // Handle events
    eventSource.onmessage = (event) => {
      try {
        const parsedEvent: StreamEvent = JSON.parse(event.data);
        onEvent(parsedEvent);
      } catch (err) {
        if (process.env.NODE_ENV !== 'production') {
          console.error('Error parsing SSE event:', err);
        }
        onError(t('clarify.error.generic', lang));
      }
    };
    
    // Handle connection open
    eventSource.onopen = () => {
      if (process.env.NODE_ENV !== 'production') {
        console.log('SSE connection opened');
      }
    };
    
    // Handle errors
    eventSource.onerror = () => {
      if (process.env.NODE_ENV !== 'production') {
        console.error('SSE connection error');
      }
      onError(t('clarify.error.sseError', lang));
      eventSource.close();
    };
    
    // Return a method to close the connection
    return {
      close: () => {
        if (eventSource) {
          eventSource.close();
          if (process.env.NODE_ENV !== 'production') {
            console.log('SSE connection closed');
          }
        }
      }
    };
  }
}; 