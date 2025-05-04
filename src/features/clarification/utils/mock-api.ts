import { Answer, StreamEvent } from '../types';
import { Language } from '../../../lib/i18n';

// 使用与StreamEvent中questionType相同的类型定义
type QuestionType = 'open' | 'multiple_choice' | 'scale' | 'strength' | 'weakness' | 'opportunity' | 'threat';

// 预设的中英文问题对
interface MockQuestion {
  en: string;
  zh: string;
  type?: QuestionType;
}

// 更丰富的问题集合，添加SWOT分析问题类型
const mockQuestionPairs: MockQuestion[] = [
  {
    en: "What are your strengths in English learning? For example, large vocabulary, good listening skills, etc.",
    zh: "你在英语学习方面有哪些优势？例如词汇量大、听力好等",
    type: 'strength'
  },
  {
    en: "What are the main difficulties you encounter in preparing for the IELTS exam?",
    zh: "你在雅思考试备考中遇到的主要困难是什么？",
    type: 'weakness'
  },
  {
    en: "What favorable factors in your environment can help you improve your English?",
    zh: "你的环境中有哪些有利因素可以帮助你提高英语水平？",
    type: 'opportunity'
  },
  {
    en: "What objective factors might hinder your preparation?",
    zh: "有哪些可能会阻碍你备考的客观因素？",
    type: 'threat'
  },
  {
    en: "What is your main motivation for achieving this goal?",
    zh: "请描述一下你想实现这个目标的主要原因是什么？",
    type: 'open'
  },
  {
    en: "In what timeframe would you like to complete this goal?",
    zh: "你希望在什么时间范围内完成这个目标？",
    type: 'open'
  },
  {
    en: "How will you measure success for this goal?",
    zh: "你将如何衡量这个目标的成功？",
    type: 'open'
  }
];

// 根据语言选择问题列表
const getMockQuestions = (lang: Language = 'en'): Array<{text: string, type: QuestionType}> => {
  return mockQuestionPairs.map(q => ({
    text: q[lang],
    type: q.type || 'open'
  }));
};

// 生成唯一ID
const generateId = () => `id-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

// 模拟延迟
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// 存储会话状态的缓存
const sessionCache: Record<string, {
  currentQuestionIndex: number,
  questions: Array<{text: string, type: QuestionType}>,
  lang: Language,
  streamNextQuestion: () => Promise<void>,
  sendEndEvent: () => void,
  isClosed: boolean
}> = {};

export const mockClarificationApi = {
  // 开始一个新的会话
  startSession: async (planId?: string, lang: Language = 'en') => {
    // 模拟网络延迟
    await delay(800);
    const sessionId = `session-${Date.now()}`;
    
    // 初始化会话缓存
    const questions = getMockQuestions(lang);
    sessionCache[sessionId] = {
      currentQuestionIndex: 0,
      questions,
      lang,
      streamNextQuestion: async function() {},  // 将在createQuestionStream中设置
      sendEndEvent: function() {},  // 将在createQuestionStream中设置
      isClosed: false
    };
    
    return sessionId;
  },
  
  // 提交答案
  submitAnswer: async (sessionId: string, answer: Answer, lang: Language = 'en') => {
    // 模拟网络延迟
    await delay(500);
    
    // 检查会话是否存在
    if (!sessionCache[sessionId]) {
      console.error('[Mock API] Session not found:', sessionId);
      return false;
    }
    
    const session = sessionCache[sessionId];
    
    // 如果还有下一个问题，流式发送它
    if (session.currentQuestionIndex < session.questions.length - 1) {
      // 增加问题索引
      session.currentQuestionIndex += 1;
      
      // 延迟一点时间后发送下一个问题
      setTimeout(() => {
        if (!session.isClosed) {
          session.streamNextQuestion();
        }
      }, 800);
    } else {
      // 这是最后一个问题的答案，发送END事件
      setTimeout(() => {
        if (!session.isClosed) {
          session.sendEndEvent();
        }
      }, 800);
    }
    
    return true;
  },
  
  // 完成会话并生成计划
  completeSession: async (sessionId: string) => {
    // 模拟网络延迟
    await delay(1200);
    
    console.log(`[Mock API] 完成会话: ${sessionId}`);
    
    // 清理会话缓存
    if (sessionCache[sessionId]) {
      sessionCache[sessionId].isClosed = true;
      delete sessionCache[sessionId];
      console.log(`[Mock API] 会话缓存已清理: ${sessionId}`);
    } else {
      console.log(`[Mock API] 警告: 尝试完成不存在的会话: ${sessionId}`);
    }
    
    // 生成一个新的计划ID
    const newPlanId = `plan-${Date.now()}`;
    console.log(`[Mock API] 生成的计划ID: ${newPlanId}`);
    
    return newPlanId;
  },
  
  // 创建模拟问题流
  createQuestionStream: (
    sessionId: string,
    onEvent: (event: StreamEvent) => void,
    onError: (error: string) => void,
    lang: Language = 'en'
  ) => {
    // 检查会话是否存在
    if (!sessionCache[sessionId]) {
      onError(`Session ${sessionId} not found`);
      return { close: () => {} };
    }
    
    const session = sessionCache[sessionId];
    
    // 设置发送END事件的函数
    session.sendEndEvent = () => {
      if (session.isClosed) return;
      
      console.log('[Mock API] Sending END event');
      
      // 发送END事件
      onEvent({
        type: 'end',
        data: '[END]'
      });
    };
    
    // 设置流式发送问题的函数
    session.streamNextQuestion = async () => {
      if (session.isClosed || session.currentQuestionIndex >= session.questions.length) return;
      
      const index = session.currentQuestionIndex;
      const question = session.questions[index];
      const questionId = generateId();
      
      // 模拟流式传输单词
      const words = question.text.split(' ');
      
      // 先发送空字符，触发UI显示
      onEvent({
        type: 'question',
        data: '',
      });
      
      // 逐个单词发送，模拟流式效果
      for (let i = 0; i < words.length; i++) {
        if (session.isClosed) return;
        
        // 中文使用较短的延迟，因为字符较少
        await delay(session.lang === 'zh' ? 200 : 250);
        
        onEvent({
          type: 'question',
          data: (i === 0 ? '' : ' ') + words[i],
        });
      }
      
      // 发送问题完成事件
      await delay(300);
      
      if (!session.isClosed) {
        onEvent({
          type: 'completion',
          data: 'question completed',
          id: questionId,
          questionType: question.type,
          required: true
        });
      }
    };
    
    // 开始发送第一个问题
    setTimeout(() => {
      if (!session.isClosed) {
        session.streamNextQuestion();
      }
    }, 1000);
    
    // 返回关闭连接的方法
    return {
      close: () => {
        if (sessionCache[sessionId]) {
          sessionCache[sessionId].isClosed = true;
        }
        console.log('Mock SSE connection closed');
      }
    };
  }
}; 