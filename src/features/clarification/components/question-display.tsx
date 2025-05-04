import React from 'react';
import { Question } from '../types';
import { cn } from '../../../lib/utils';
import { t } from '../../../lib/i18n';
import { Language } from '../../../lib/i18n';
import { motion } from 'framer-motion';

interface QuestionDisplayProps {
  question: Question | null;
  isStreamingQuestion: boolean;
  currentStreamedText: string;
  lang: Language;
}

export const QuestionDisplay: React.FC<QuestionDisplayProps> = ({
  question,
  isStreamingQuestion,
  currentStreamedText,
  lang
}) => {
  // If we're streaming a question, show the currently streamed text
  // Otherwise, show the full question text
  const displayText = isStreamingQuestion ? currentStreamedText : (question ? question.text : '');
  
  // Animation variants for the text
  const textVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };
  
  return (
    <div 
      className={cn(
        "bg-card rounded-lg p-6 my-4 shadow-sm border border-border",
        "relative transition-all duration-500",
        "min-h-[120px] flex flex-col justify-center"
      )}
      aria-live="polite"
    >
      {displayText ? (
        <motion.div
          initial="hidden"
          animate="visible"
          variants={textVariants}
          className="text-lg font-medium"
        >
          {displayText}
        </motion.div>
      ) : (
        <div className="text-center text-muted-foreground">
          {t('clarify.loadingQuestions', lang)}
        </div>
      )}
      
      {isStreamingQuestion && (
        <div className="absolute bottom-4 right-4">
          <div className="flex space-x-1">
            <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0ms' }} />
            <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '150ms' }} />
            <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '300ms' }} />
          </div>
        </div>
      )}
    </div>
  );
}; 