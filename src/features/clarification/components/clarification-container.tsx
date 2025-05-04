import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { t } from '../../../lib/i18n';
import { Language } from '../../../lib/i18n';
import { Button } from '../../../shared/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '../../../shared/ui/card';
import { useClarificationSession } from '../hooks/useClarificationSession';
import { QuestionDisplay } from './question-display';
import { AnswerInput } from './answer-input';
import { toast } from 'sonner';

interface ClarificationContainerProps {
  goalTitle?: string;
  planId?: string;
  lang: Language;
  onComplete?: (planId: string) => void;
}

export const ClarificationContainer: React.FC<ClarificationContainerProps> = ({
  goalTitle,
  planId,
  lang,
  onComplete
}) => {
  const navigate = useNavigate();
  const [isCompleting, setIsCompleting] = useState(false);
  
  const {
    session,
    isLoading,
    error,
    isStreamingQuestion,
    currentStreamedText,
    startSession,
    submitAnswer,
    finishSession,
    resetSession,
    canFinishSession
  } = useClarificationSession(planId, lang);
  
  // Start a session when the component mounts
  useEffect(() => {
    startSession();
    
    // Cleanup function
    return () => {
      resetSession();
    };
  }, [startSession, resetSession]);
  
  // Helper to get the current question
  const getCurrentQuestion = () => {
    if (!session || session.questions.length === 0) {
      return null;
    }
    
    return session.questions[session.currentQuestionIndex];
  };
  
  // Handle submitting an answer
  const handleAnswerSubmit = async (answer: string) => {
    const success = await submitAnswer(answer);
    
    if (!success) {
      toast.error(t('api.errors.update', lang));
      return;
    }
  };
  
  // Handle completing the session
  const handleCompleteSession = async () => {
    // 检查是否可以完成会话
    if (!canFinishSession()) {
      // 如果无法完成会话，向用户显示消息
      if (session && !session.isComplete) {
        toast.info(t('clarify.waitingMoreQuestions', lang));
      } else if (session) {
        toast.info(t('clarify.answerAllFirst', lang));
      }
      return;
    }
    
    setIsCompleting(true);
    
    try {
      const newPlanId = await finishSession();
      
      if (newPlanId) {
        // Notify parent component if callback exists
        if (onComplete) {
          onComplete(newPlanId);
        } else {
          // Otherwise navigate to the plan
          console.log('导航到计划页面，planId:', newPlanId);
          navigate(`/plan?id=${newPlanId}`);
        }
      } else {
        toast.error(t('clarify.error.planCreationFailed', lang));
      }
    } catch (err) {
      console.error('完成会话出错:', err);
      toast.error(t('api.errors.default', lang));
    } finally {
      setIsCompleting(false);
    }
  };
  
  // Handle going back to the dashboard
  const handleBack = () => {
    navigate('/');
  };
  
  // Show error state
  if (error) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>{t('clarify.error.generic', lang)}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-destructive">{error}</p>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={handleBack}>
            {t('clarify.back', lang)}
          </Button>
          <Button onClick={() => startSession()}>
            {t('clarify.continue', lang)}
          </Button>
        </CardFooter>
      </Card>
    );
  }
  
  // If we're still loading initially, show a loading state
  if (isLoading && !session) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>{t('clarify.processing', lang)}</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center py-8">
          <div className="flex space-x-2">
            <div className="w-3 h-3 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0ms' }} />
            <div className="w-3 h-3 rounded-full bg-primary animate-bounce" style={{ animationDelay: '150ms' }} />
            <div className="w-3 h-3 rounded-full bg-primary animate-bounce" style={{ animationDelay: '300ms' }} />
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <motion.div 
      className="max-w-2xl mx-auto p-4 space-y-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Card>
        <CardHeader>
          <CardTitle>{t('clarify.title', lang)}</CardTitle>
          {goalTitle && (
            <div className="mt-4 p-3 bg-muted rounded-md">
              <p className="font-medium text-sm">{t('clarify.yourGoal', lang)}</p>
              <p className="text-lg font-bold">{goalTitle}</p>
            </div>
          )}
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Question Display */}
          <QuestionDisplay
            question={getCurrentQuestion()}
            isStreamingQuestion={isStreamingQuestion}
            currentStreamedText={currentStreamedText}
            lang={lang}
          />
          
          {/* Answer Input */}
          <AnswerInput
            onSubmit={handleAnswerSubmit}
            isDisabled={isLoading || isCompleting || isStreamingQuestion || !session || !getCurrentQuestion()}
            question={getCurrentQuestion()}
            isStreamingQuestion={isStreamingQuestion}
            lang={lang}
          />
          
          {/* Status Messages */}
          {session && session.isComplete && (
            <div className="text-center text-muted-foreground">
              <p>{t('clarify.allQuestionsReceived', lang)}</p>
              {session.answers.length < session.questions.length && (
                <p className="mt-2 text-sm">{t('clarify.pleaseAnswerAll', lang)}</p>
              )}
            </div>
          )}
          
          {isCompleting && (
            <div className="text-center text-muted-foreground">
              <p>{t('clarify.generatingPlan', lang)}</p>
            </div>
          )}
        </CardContent>
        
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={handleBack}>
            {t('clarify.back', lang)}
          </Button>
          
          {session && (
            <Button 
              onClick={handleCompleteSession}
              disabled={isLoading || isCompleting || !canFinishSession()}
            >
              {isCompleting ? t('clarify.waiting', lang) : t('clarify.continue', lang)}
            </Button>
          )}
        </CardFooter>
      </Card>
    </motion.div>
  );
}; 