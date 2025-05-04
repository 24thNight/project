import React, { useState } from 'react';
import { Plan } from '../../../types/task';
import { useLanguage } from '../../../lib/language-context';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { getProgressColor } from '../../../lib/utils';
import RenamePlanDialog from './rename-plan-dialog';

interface PlanCardProps {
  plan: Plan;
  onEnter: (id: string) => void;
  onSummary: (id: string) => void;
  onDelete: (id: string) => void;
}

const PlanCard: React.FC<PlanCardProps> = ({ 
  plan, 
  onEnter,
  onSummary,
  onDelete
}) => {
  const { t } = useLanguage();
  const stage = plan.stages && plan.stages.length > 0 ? plan.stages.find(s => s.id === plan.currentStageId) : null;
  const activeTasks = stage?.tasks?.filter(t => !t.completed).length || 0;
  const [isRenameDialogOpen, setIsRenameDialogOpen] = useState(false);

  return (
    <>
      <Card className="h-full transition-all duration-300 hover:shadow-md relative group">
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            variant="ghost"
            size="sm"
            className="rounded-full p-1 h-7 w-7 text-gray-500 hover:text-gray-700 hover:bg-gray-100"
            onClick={(e) => {
              e.stopPropagation();
              setIsRenameDialogOpen(true);
            }}
            aria-label={`${t('dashboard.actions.rename')} ${plan.title}`}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M11 4H4C3.46957 4 2.96086 4.21071 2.58579 4.58579C2.21071 4.96086 2 5.46957 2 6V20C2 20.5304 2.21071 21.0391 2.58579 21.4142C2.96086 21.7893 3.46957 22 4 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M18.5 2.5C18.8978 2.10217 19.4374 1.87868 20 1.87868C20.5626 1.87868 21.1022 2.10217 21.5 2.5C21.8978 2.89782 22.1213 3.43739 22.1213 4C22.1213 4.56261 21.8978 5.10217 21.5 5.5L12 15L8 16L9 12L18.5 2.5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </Button>
        </div>
        
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <CardTitle className="text-lg">{plan.title}</CardTitle>
            {plan.delayedDays && (
              <span className="text-xs px-2 py-1 bg-amber-100 text-amber-800 rounded-full">
                {t('dashboard.status.delayed')}: {plan.delayedDays} {t('dashboard.status.days')}
              </span>
            )}
          </div>
          <div className="flex justify-between items-center mt-2 text-xs text-gray-500">
            <span>
              {t('dashboard.stage')}: {stage?.title || t('dashboard.noStage')}
            </span>
            <span>{t('dashboard.tasksToday')}: {activeTasks}</span>
          </div>
        </CardHeader>
        <CardContent className="pb-0">
          <div className="mb-3">
            <div className="flex justify-between text-xs mb-1">
              <span>{t('dashboard.progress')}</span>
              <span>{plan.progress}%</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-1.5">
              <div 
                className={`h-1.5 rounded-full ${getProgressColor(plan.progress)}`} 
                style={{ width: `${plan.progress}%` }}
              />
            </div>
          </div>
        </CardContent>
        <CardFooter className="grid grid-cols-3 gap-1 pt-3">
          <Button 
            variant="zen" 
            size="sm"
            onClick={() => onEnter(plan.id)}
            aria-label={`${t('dashboard.actions.enter')} ${plan.title}`}
          >
            {t('dashboard.actions.enter')}
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => onSummary(plan.id)}
            aria-label={`${t('dashboard.actions.summary')} ${plan.title}`}
          >
            {t('dashboard.actions.summary')}
          </Button>
          <Button 
            variant="ghost" 
            size="sm"
            className="text-red-500 hover:text-red-700 hover:bg-red-50"
            onClick={() => onDelete(plan.id)}
            aria-label={`${t('dashboard.actions.delete')} ${plan.title}`}
          >
            {t('dashboard.actions.delete')}
          </Button>
        </CardFooter>
      </Card>

      <RenamePlanDialog 
        planId={plan.id}
        currentName={plan.title}
        isOpen={isRenameDialogOpen}
        onClose={() => setIsRenameDialogOpen(false)}
      />
    </>
  );
};

export default PlanCard; 