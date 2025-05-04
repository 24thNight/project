import React, { useState } from 'react';
import { useLanguage } from '../../../lib/language-context';
import { Card } from '../../../components/ui/card';
import NewPlanDialog from './new-plan-dialog';

interface NewPlanCardProps {
  onPlanCreated?: () => void;
  onOpenDialog?: () => void;
}

const NewPlanCard: React.FC<NewPlanCardProps> = ({ onPlanCreated, onOpenDialog }) => {
  const { t } = useLanguage();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleOpenDialog = () => {
    if (onOpenDialog) {
      onOpenDialog();
    } else {
      setIsDialogOpen(true);
    }
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    if (onPlanCreated) {
      onPlanCreated();
    }
  };

  return (
    <>
      <Card 
        className="h-full flex flex-col items-center justify-center p-6 cursor-pointer border-dashed border-2 border-gray-300 hover:border-gray-400 transition-all duration-300 hover:shadow-md bg-white/50"
        onClick={handleOpenDialog}
      >
        <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-4">
          <svg 
            width="24" 
            height="24" 
            viewBox="0 0 24 24" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
            className="text-gray-500"
          >
            <path 
              d="M12 5V19M5 12H19" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <p className="text-gray-500 font-medium">{t('dashboard.addNewPlan')}</p>
        <p className="text-xs text-gray-400 mt-2 text-center">{t('dashboard.clickToAdd')}</p>
      </Card>

      {!onOpenDialog && (
        <NewPlanDialog
          isOpen={isDialogOpen}
          onClose={handleCloseDialog}
        />
      )}
    </>
  );
};

export default NewPlanCard; 