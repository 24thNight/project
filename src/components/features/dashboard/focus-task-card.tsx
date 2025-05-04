import React from 'react';
import { Plan } from '../../../types/task';
import { useLanguage } from '../../../lib/language-context';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { getProgressColor } from '../../../lib/utils';

interface FocusTaskCardProps {
  plan: Plan;
  onEnter: (id: string) => void;
}

const FocusTaskCard: React.FC<FocusTaskCardProps> = ({ plan, onEnter }) => {
  const { t } = useLanguage();
  
  if (!plan || !plan.stages) {
    console.error('FocusTaskCard received invalid plan:', plan);
    return (
      <Card className="w-full max-w-2xl mx-auto bg-white border-0 shadow-xl p-4">
        <p className="text-center text-gray-500">数据加载中...</p>
      </Card>
    );
  }
  
  const stage = plan.stages.find(s => s.id === plan.currentStageId);
  const activeTasks = stage?.tasks?.filter(t => !t.completed)?.length || 0;

  return (
    <Card className="w-full max-w-2xl mx-auto bg-white border-0 shadow-xl">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle>{plan.title}</CardTitle>
          {plan.delayedDays && (
            <span className="text-xs px-2 py-1 bg-amber-100 text-amber-800 rounded-full">
              {t('dashboard.status.delayed')}: {plan.delayedDays} {t('dashboard.status.days')}
            </span>
          )}
        </div>
        <div className="flex justify-between items-center mt-2 text-sm text-gray-500">
          <span>
            {t('dashboard.stage')}: {stage?.title || '-'}
          </span>
          <span>{t('dashboard.tasksToday')}: {activeTasks}</span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <div className="flex justify-between text-sm mb-1">
            <span>{t('dashboard.progress')}</span>
            <span>{plan.progress || 0}%</span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-2">
            <div 
              className={`h-2 rounded-full ${getProgressColor(plan.progress || 0)}`} 
              style={{ width: `${plan.progress || 0}%` }}
            />
          </div>
        </div>
        
        <div className="flex justify-end">
          <Button 
            variant="zen" 
            onClick={() => onEnter(plan.id)}
            aria-label={`${t('dashboard.actions.enter')} ${plan.title}`}
          >
            {t('dashboard.actions.enter')}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default FocusTaskCard; 