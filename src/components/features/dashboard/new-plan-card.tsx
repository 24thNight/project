import React from 'react';
import { Card } from '../../../components/ui/card';
import { useLanguage } from '../../../lib/language-context';
import { motion } from 'framer-motion';

interface NewPlanCardProps {
  onOpenDialog: () => void;
}

const NewPlanCard: React.FC<NewPlanCardProps> = ({ onOpenDialog }) => {
  const { t } = useLanguage();

  return (
    <Card 
      className="h-full flex flex-col items-center justify-center p-6 cursor-pointer border border-gray-200 hover:border-blue-300 transition-all duration-200 shadow-sm hover:shadow bg-white"
      onClick={onOpenDialog}
    >
      <div className="h-full w-full flex flex-col items-center justify-center">
        <div className="flex flex-col items-center">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white mb-4"
          >
            <svg 
              className="w-6 h-6" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M12 4v16m8-8H4" 
              />
            </svg>
          </motion.div>
          <p className="text-gray-700 font-medium text-center">{t('dashboard.addNewPlan')}</p>
          <p className="text-xs text-gray-400 mt-2 text-center">{t('dashboard.clickToAdd')}</p>
        </div>
      </div>
    </Card>
  );
};

export default NewPlanCard; 