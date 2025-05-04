import React from 'react';
import { useLanguage } from '../../../lib/language-context';
import { Button } from '../../../components/ui/button';
import { motion } from 'framer-motion';

interface EmptyStateProps {
  onCreatePlan: () => void;
}

const EmptyState: React.FC<EmptyStateProps> = ({ onCreatePlan }) => {
  const { t } = useLanguage();

  return (
    <motion.div 
      className="flex flex-col items-center justify-center h-[60vh] text-center px-4 max-w-lg mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="relative w-40 h-40 mb-8">
        {/* 背景圆形 */}
        <motion.div 
          className="absolute inset-0 bg-blue-50 rounded-full"
          animate={{ 
            scale: [1, 1.05, 1],
          }}
          transition={{ 
            repeat: Infinity, 
            duration: 3,
            ease: "easeInOut"
          }}
        />
        
        {/* 前景图标 */}
        <motion.div 
          className="absolute inset-0 flex items-center justify-center"
          whileHover={{ rotate: 5 }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="70"
            height="70"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-blue-600"
          >
            <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="12" x2="12" y1="18" y2="12" />
            <line x1="9" x2="15" y1="15" y2="15" />
          </svg>
        </motion.div>
      </div>
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <h3 className="text-2xl font-bold mb-3 text-gray-800">{t('dashboard.emptyTitle')}</h3>
        <p className="text-gray-500 mb-8 max-w-md text-base">
          {t('dashboard.emptyCTA')}
        </p>
      </motion.div>
      
      <motion.div
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
      >
        <Button
          className="px-6 py-2 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium rounded-md shadow-md"
          onClick={onCreatePlan}
          aria-label={t('dashboard.emptyCTA')}
        >
          <svg 
            className="w-5 h-5 mr-2 inline-block" 
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
          {t('dashboard.emptyCTA')}
        </Button>
      </motion.div>
    </motion.div>
  );
};

export default EmptyState; 