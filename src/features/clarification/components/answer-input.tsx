import React, { useState, KeyboardEvent, useRef, useEffect, ChangeEvent } from 'react';
import { Button } from '../../../shared/ui/button';
import { Textarea } from '../../../shared/ui/textarea';
import { t } from '../../../lib/i18n';
import { Language } from '../../../lib/i18n';
import { motion } from 'framer-motion';
import { cn } from '../../../lib/utils';
import { Question } from '../types';

interface AnswerInputProps {
  onSubmit: (answer: string) => void;
  isDisabled: boolean;
  question: Question | null;
  isStreamingQuestion: boolean;
  lang: Language;
}

export const AnswerInput: React.FC<AnswerInputProps> = ({
  onSubmit,
  isDisabled,
  question,
  isStreamingQuestion,
  lang
}) => {
  const [answer, setAnswer] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  // Focus the textarea when a new question appears
  useEffect(() => {
    if (question && !isStreamingQuestion && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [question, isStreamingQuestion]);
  
  const handleSubmit = () => {
    if (answer.trim() && !isDisabled) {
      onSubmit(answer.trim());
      setAnswer('');
    }
  };
  
  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    // Submit on Enter without Shift key
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { 
        duration: 0.3,
        ease: "easeOut"
      }
    }
  };
  
  // Show the input only when we have a question and it's not being streamed
  const showInput = question && !isStreamingQuestion;
  
  return (
    <motion.div
      initial="hidden"
      animate={showInput ? "visible" : "hidden"}
      variants={containerVariants}
      className={cn(
        "bg-background rounded-lg p-4 border border-border shadow-sm",
        "transition-all duration-300",
        { "opacity-50": isDisabled }
      )}
    >
      <div className="space-y-4">
        <Textarea
          ref={textareaRef}
          value={answer}
          onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setAnswer(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={t('clarify.answerPlaceholder', lang)}
          className="min-h-[100px] resize-none"
          disabled={isDisabled || !showInput}
          aria-label={t('clarify.answerPlaceholder', lang)}
        />
        
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">
            {t('clarify.enterToSubmit', lang)}
          </span>
          
          <Button 
            onClick={handleSubmit}
            disabled={isDisabled || !answer.trim() || !showInput}
            aria-label={t('clarify.continue', lang)}
          >
            {t('clarify.continue', lang)}
          </Button>
        </div>
      </div>
    </motion.div>
  );
}; 