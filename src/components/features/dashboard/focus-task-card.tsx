import React from 'react';
import { Plan } from '../../../types/task';
import { useLanguage } from '../../../lib/language-context';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { getProgressColor } from '../../../lib/utils';
import { motion } from 'framer-motion';

interface FocusTaskCardProps {
  plan: Plan;
  onEnter: (id: string) => void;
}

const FocusTaskCard: React.FC<FocusTaskCardProps> = ({ plan, onEnter }) => {
  const { t } = useLanguage();
  
  if (!plan || !plan.stages) {
    if (process.env.NODE_ENV !== 'production') {
      console.error('FocusTaskCard received invalid plan:', plan);
    }
    return (
      <Card className="w-full max-w-2xl mx-auto bg-white border border-gray-200 shadow-sm p-4">
        <div className="flex justify-center items-center py-4">
          <div className="flex space-x-2">
            <div className="w-3 h-3 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: '0ms' }} />
            <div className="w-3 h-3 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: '150ms' }} />
            <div className="w-3 h-3 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: '300ms' }} />
          </div>
        </div>
      </Card>
    );
  }
  
  const stage = plan.stages.find(s => s.id === plan.currentStageId);
  const activeTasks = stage?.tasks?.filter(t => !t.completed)?.length || 0;

  return (
    <motion.div
      initial={{ y: 10, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <Card className="w-full max-w-2xl mx-auto bg-white border border-blue-100 shadow-md overflow-hidden">
        {/* 彩色顶部条 */}
        <div className="h-1.5 bg-gradient-to-r from-blue-600 to-indigo-700" />
        
        <CardHeader className="pb-2 pt-4">
          <div className="flex justify-between items-start">
            <div className="flex items-center">
              <div className="bg-blue-100 p-2 rounded-full mr-3">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                  <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
              </div>
              <CardTitle className="text-xl font-bold text-gray-800">{plan.title}</CardTitle>
            </div>
            
            {plan.delayedDays && (
              <span className="text-xs px-2.5 py-1.5 bg-amber-100 text-amber-800 rounded-full flex items-center">
                <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {plan.delayedDays} {t('dashboard.status.days')}
              </span>
            )}
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="flex items-start space-x-2 bg-gray-50 p-3 rounded-lg">
              <svg className="w-5 h-5 text-gray-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <div>
                <div className="text-xs font-medium text-gray-500 mb-1">{t('dashboard.stage')}</div>
                <div className="text-sm font-semibold">{stage?.title || '-'}</div>
              </div>
            </div>
            
            <div className="flex items-start space-x-2 bg-gray-50 p-3 rounded-lg">
              <svg className="w-5 h-5 text-gray-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <div className="text-xs font-medium text-gray-500 mb-1">{t('dashboard.tasksToday')}</div>
                <div className="text-sm font-semibold">{activeTasks}</div>
              </div>
            </div>
          </div>
          
          <div className="mb-6">
            <div className="flex justify-between text-sm mb-1.5">
              <span className="font-medium text-gray-700">{t('dashboard.progress')}</span>
              <span className="font-medium" style={{color: plan.progress > 70 ? '#059669' : (plan.progress > 30 ? '#0284c7' : '#6b7280')}}>
                {plan.progress || 0}%
              </span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-2.5">
              <motion.div 
                className={`h-2.5 rounded-full ${getProgressColor(plan.progress || 0)}`} 
                style={{ width: '0%' }}
                animate={{ width: `${plan.progress || 0}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
              />
            </div>
          </div>
          
          <div className="flex justify-end">
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Button 
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
                onClick={() => onEnter(plan.id)}
                aria-label={`${t('dashboard.actions.enter')} ${plan.title}`}
              >
                <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
                {t('dashboard.actions.enter')}
              </Button>
            </motion.div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default FocusTaskCard; 