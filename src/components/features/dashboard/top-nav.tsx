import React from 'react';
import { useLanguage } from '../../../lib/language-context';
import { cn } from '../../../lib/utils';

interface NavItem {
  id: string;
  label: TranslationKey;
  icon: React.ReactNode;
}

type TranslationKey = 'dashboard.nav.cards' | 'dashboard.nav.focus' | 'dashboard.nav.trash';

interface TopNavProps {
  activeTab: string;
  onChangeTab: (id: string) => void;
}

const TopNav: React.FC<TopNavProps> = ({ activeTab, onChangeTab }) => {
  const { t } = useLanguage();

  const navItems: NavItem[] = [
    {
      id: 'cards',
      label: 'dashboard.nav.cards',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="3" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2" />
          <rect x="14" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2" />
          <rect x="3" y="14" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2" />
          <rect x="14" y="14" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2" />
        </svg>
      ),
    },
    {
      id: 'focus',
      label: 'dashboard.nav.focus',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
          <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="2" />
        </svg>
      ),
    },
    {
      id: 'trash',
      label: 'dashboard.nav.trash',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M3 6H5H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <path 
            d="M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6H19Z" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
          />
        </svg>
      ),
    },
  ];

  return (
    <div className="w-full max-w-6xl mx-auto px-4">
      <div className="flex space-x-4 border-b border-gray-200">
        {navItems.map((item) => (
          <button
            key={item.id}
            className={cn(
              "flex items-center space-x-2 px-4 py-3 text-sm font-medium transition-colors",
              activeTab === item.id 
                ? "text-blue-600 border-b-2 border-blue-600 -mb-[1px]" 
                : "text-gray-500 hover:text-gray-800 hover:bg-gray-50"
            )}
            onClick={() => onChangeTab(item.id)}
            aria-label={t(item.label)}
          >
            <span className="opacity-80">{item.icon}</span>
            <span>{t(item.label)}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default TopNav; 