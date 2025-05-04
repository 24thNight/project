import React from 'react';
import { useLanguage } from '../../../lib/language-context';
import { Button } from '../../../components/ui/button';

interface EmptyStateProps {
  onCreatePlan: () => void;
}

const EmptyState: React.FC<EmptyStateProps> = ({ onCreatePlan }) => {
  const { t } = useLanguage();

  return (
    <div className="flex flex-col items-center justify-center h-[50vh] text-center px-4">
      <div className="w-24 h-24 mb-6 bg-gray-100 rounded-full flex items-center justify-center">
        {/* Placeholder for illustration - can be replaced with actual SVG */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="40"
          height="40"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-gray-400"
        >
          <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="12" x2="12" y1="18" y2="12" />
          <line x1="9" x2="15" y1="15" y2="15" />
        </svg>
      </div>
      <h3 className="text-xl font-medium mb-2">{t('dashboard.emptyTitle')}</h3>
      <p className="text-gray-500 mb-6 max-w-md">
        {t('dashboard.emptyCTA')}
      </p>
      <Button
        variant="zen"
        size="lg"
        className="px-6 py-2 shadow-sm"
        onClick={onCreatePlan}
        aria-label={t('dashboard.emptyCTA')}
      >
        {t('dashboard.emptyCTA')}
      </Button>
    </div>
  );
};

export default EmptyState; 