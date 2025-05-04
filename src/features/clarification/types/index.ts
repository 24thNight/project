export interface Question {
  id: string;
  text: string;
  type: 'open' | 'multiple_choice' | 'scale' | 'strength' | 'weakness' | 'opportunity' | 'threat';
  options?: string[];
  required: boolean;
}

export interface Answer {
  questionId: string;
  value: string | number;
  timestamp: Date;
}

export interface ClarificationSession {
  id: string;
  planId?: string;
  status: 'pending' | 'in_progress' | 'completed' | 'error';
  currentQuestionIndex: number;
  questions: Question[];
  answers: Answer[];
  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date;
  isComplete?: boolean;
}

export interface ClarificationState {
  session: ClarificationSession | null;
  isLoading: boolean;
  error: string | null;
  isStreamingQuestion: boolean;
  currentStreamedText: string;
}

export interface StreamEvent {
  type: 'question' | 'completion' | 'error' | 'end';
  data: string;
  id?: string;
  questionType?: 'open' | 'multiple_choice' | 'scale' | 'strength' | 'weakness' | 'opportunity' | 'threat';
  options?: string[];
  required?: boolean;
} 