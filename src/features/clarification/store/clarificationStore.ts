import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { 
  ClarificationState, 
  Answer, 
  Question, 
  ClarificationSession,
  StreamEvent
} from '../types';

interface ClarificationActions {
  // Session actions
  initSession: (planId?: string) => void;
  resetSession: () => void;
  
  // Question and answer actions
  setCurrentStreamedText: (text: string) => void;
  setStreamingStatus: (isStreaming: boolean) => void;
  addQuestion: (question: Question) => void;
  addAnswer: (answer: Answer) => void;
  updateSessionStatus: (status: ClarificationSession['status']) => void;
  
  // Loading and error states
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  
  // Event handling
  handleStreamEvent: (event: StreamEvent) => void;
  completeSession: () => void;
  
  // 标记问题流结束
  markSessionComplete: () => void;
}

type ClarificationStore = ClarificationState & ClarificationActions;

const initialState: ClarificationState = {
  session: null,
  isLoading: false,
  error: null,
  isStreamingQuestion: false,
  currentStreamedText: '',
};

export const useClarificationStore = create<ClarificationStore>()(
  devtools(
    (set, get) => ({
      ...initialState,
      
      initSession: (planId) => {
        const newSession: ClarificationSession = {
          id: `session-${Date.now()}`,
          planId,
          status: 'pending',
          currentQuestionIndex: -1,
          questions: [],
          answers: [],
          createdAt: new Date(),
          updatedAt: new Date(),
          isComplete: false
        };
        
        set({ 
          session: newSession,
          isLoading: false,
          error: null,
          isStreamingQuestion: false,
          currentStreamedText: '',
        });
      },
      
      resetSession: () => {
        set(initialState);
      },
      
      setCurrentStreamedText: (text) => {
        set({ currentStreamedText: text });
      },
      
      setStreamingStatus: (isStreaming) => {
        set({ isStreamingQuestion: isStreaming });
      },
      
      addQuestion: (question) => {
        const { session } = get();
        if (!session) return;
        
        const updatedSession = {
          ...session,
          questions: [...session.questions, question],
          currentQuestionIndex: session.currentQuestionIndex + 1,
          updatedAt: new Date(),
        };
        
        set({ session: updatedSession });
      },
      
      addAnswer: (answer) => {
        const { session } = get();
        if (!session) return;
        
        const updatedSession = {
          ...session,
          answers: [...session.answers, answer],
          updatedAt: new Date(),
          status: 'in_progress' as const,
        };
        
        set({ session: updatedSession });
      },
      
      updateSessionStatus: (status) => {
        const { session } = get();
        if (!session) return;
        
        const updatedSession = {
          ...session,
          status,
          updatedAt: new Date(),
          ...(status === 'completed' ? { completedAt: new Date() } : {}),
        };
        
        set({ session: updatedSession });
      },
      
      markSessionComplete: () => {
        const { session } = get();
        if (!session) return;
        
        const updatedSession = {
          ...session,
          isComplete: true,
          updatedAt: new Date(),
        };
        
        set({ 
          session: updatedSession,
          isStreamingQuestion: false,
          currentStreamedText: '',
        });
        
        // 如果已收到所有答案，自动将会话状态设置为completed
        if (session.answers.length === session.questions.length) {
          get().updateSessionStatus('completed');
        }
      },
      
      setLoading: (isLoading) => {
        set({ isLoading });
      },
      
      setError: (error) => {
        set({ 
          error,
          isLoading: false,
          isStreamingQuestion: false
        });
        
        if (error) {
          const { session } = get();
          if (session) {
            get().updateSessionStatus('error');
          }
        }
      },
      
      handleStreamEvent: (event) => {
        const { isStreamingQuestion } = get();
        
        switch (event.type) {
          case 'question':
            if (!isStreamingQuestion) {
              set({ isStreamingQuestion: true, currentStreamedText: '' });
            }
            
            set((state) => ({ 
              currentStreamedText: state.currentStreamedText + event.data 
            }));
            break;
            
          case 'completion':
            // Create a complete question from the streamed text
            if (isStreamingQuestion && event.id) {
              const newQuestion: Question = {
                id: event.id,
                text: get().currentStreamedText,
                type: event.questionType || 'open',
                options: event.options,
                required: event.required || true,
              };
              
              get().addQuestion(newQuestion);
              set({ 
                isStreamingQuestion: false,
                currentStreamedText: ''
              });
            }
            break;
            
          case 'end':
            // 处理问题流结束事件
            console.log('Received END event, marking session as complete');
            get().markSessionComplete();
            break;
            
          case 'error':
            get().setError(event.data);
            break;
        }
      },
      
      completeSession: () => {
        get().updateSessionStatus('completed');
        set({ 
          isStreamingQuestion: false,
          currentStreamedText: '',
        });
      },
    }),
    { name: 'clarification-store' }
  )
); 