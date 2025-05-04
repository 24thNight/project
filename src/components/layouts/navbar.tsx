import React from 'react';
import { Button } from '../ui/button';
import { useLanguage } from '../../lib/language-context';

interface NavbarProps {
  onOpenCommandPalette: () => void;
}

/**
 * 导航栏组件
 * 
 * 包含应用Logo、搜索栏、语言切换按钮和用户信息
 */
const Navbar: React.FC<NavbarProps> = ({ onOpenCommandPalette }) => {
  const { language, setLanguage, t } = useLanguage();
  
  const toggleLanguage = () => {
    const newLang = language === 'zh' ? 'en' : 'zh';
    setLanguage(newLang);
  };
  
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-4 py-3">
        {/* 左侧Logo区域 */}
        <div className="flex items-center space-x-2">
          <div className="bg-blue-600 text-white h-8 w-8 rounded flex items-center justify-center font-bold">
            L
          </div>
          <span className="font-semibold text-lg">Linden AI</span>
        </div>
        
        {/* 中间搜索栏 */}
        <div className="hidden sm:flex flex-1 max-w-md mx-8">
          <div 
            className="relative w-full bg-gray-50 border border-gray-200 rounded-md flex items-center px-3 cursor-pointer"
            onClick={onOpenCommandPalette}
          >
            <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <div className="w-full py-2 px-2 text-gray-400 text-sm">
              {language === 'zh' ? '搜索或使用命令...' : 'Search or use commands...'}
            </div>
            <div className="text-xs text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded">⌘K</div>
          </div>
        </div>
        
        {/* 右侧功能区 */}
        <div className="flex items-center space-x-3">
          <Button
            variant="ghost"
            size="sm"
            className="text-gray-700"
            onClick={toggleLanguage}
          >
            {language === 'zh' ? 'EN' : '中文'}
          </Button>

          <Button
            variant="outline"
            className="border-blue-600 text-blue-600 hover:bg-blue-50"
            onClick={() => window.location.href = '/dashboard'}
          >
            <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            {language === 'zh' ? '返回任务计划' : 'Back to Dashboard'}
          </Button>

          <div className="h-8 w-8 rounded-full bg-blue-600 text-white flex items-center justify-center cursor-pointer">
            <span>U</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar; 