import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../lib/language-context';
import { usePlanStore } from '../lib/store';
import { Plan } from '../types/task';

import FocusTaskCard from '../components/features/dashboard/focus-task-card';
import PlanCard from '../components/features/dashboard/plan-card';
import NewPlanCard from '../components/features/dashboard/new-plan-card';
import EmptyState from '../components/features/dashboard/empty-state';
import TopNav from '../components/features/dashboard/top-nav';
import NewPlanDialog from '../components/features/dashboard/new-plan-dialog';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';

const DashboardPage = () => {
  const { t, language, setLanguage } = useLanguage();
  const navigate = useNavigate();
  const { plans, fetchPlans, deletePlan } = usePlanStore();
  const [activeTab, setActiveTab] = useState('cards');
  const [selectedPlans, setSelectedPlans] = useState<Plan[]>([]);
  const [isNewPlanDialogOpen, setIsNewPlanDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // 使用useMemo缓存计算结果
  const activePlans = useMemo(() => 
    plans.filter(plan => plan.status !== 'deleted'),
    [plans]
  );
  
  // 使用useMemo缓存计算结果
  const focusPlan = useMemo(() => 
    activePlans.length > 0 
      ? [...activePlans].sort((a, b) => b.progress - a.progress)[0] 
      : null,
    [activePlans]
  );

  // 使用useMemo缓存计算结果
  const deletedPlans = useMemo(() => 
    plans.filter(plan => plan.status === 'deleted'),
    [plans]
  );

  // 使用useMemo检查是否应该显示"添加新卡片"按钮
  const shouldShowNewCard = useMemo(() => 
    activeTab === 'cards' && !plans.some(p => p.title === t('dashboard.newPlan') && p.progress === 0),
    [activeTab, plans, t]
  );

  useEffect(() => {
    fetchPlans();
  }, [fetchPlans]);

  useEffect(() => {
    if (activeTab === 'cards') {
      setSelectedPlans(activePlans);
    } else if (activeTab === 'focus') {
      setSelectedPlans(focusPlan ? [focusPlan] : []);
    } else if (activeTab === 'trash') {
      setSelectedPlans(deletedPlans);
    }
  }, [activeTab, activePlans, focusPlan, deletedPlans]);

  const handleCreatePlan = () => {
    // 打开新计划对话框，而不是直接创建计划
    setIsNewPlanDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsNewPlanDialogOpen(false);
  };

  const handleEnterPlan = (id: string) => {
    navigate(`/execution?planId=${id}`);
  };

  const handleSummaryPlan = (id: string) => {
    navigate(`/summary?planId=${id}`);
  };

  const handleDeletePlan = async (id: string) => {
    try {
      await deletePlan(id);
      // 如果在回收站视图，则保持在此视图
      if (activeTab !== 'trash') {
        setActiveTab('cards');
      }
    } catch (error) {
      if (process.env.NODE_ENV !== 'production') {
        console.error('Failed to delete plan:', error);
      }
    }
  };

  const handleChangeTab = (id: string) => {
    setActiveTab(id);
  };

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'zh' : 'en');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* 顶部导航栏 */}
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
            <div className="relative w-full">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <Input
                type="text"
                placeholder={t('dashboard.search') || '搜索'}
                className="pl-10 pr-4 py-2 border-gray-300 focus:ring-blue-500 focus:border-blue-500 block w-full"
                value={searchQuery}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          
          {/* 右侧功能区 */}
          <div className="flex items-center space-x-3">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={toggleLanguage}
              aria-label={t('dashboard.language')}
              className="text-gray-700"
            >
              {language === 'en' ? '中文' : 'EN'}
            </Button>

            <Button
              className="bg-blue-600 hover:bg-blue-700 text-white"
              onClick={handleCreatePlan}
            >
              <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              {t('dashboard.addNewPlan')}
            </Button>

            <Button
              variant="outline"
              className="border-blue-600 text-blue-600 hover:bg-blue-50"
              onClick={() => window.location.href = '/workspace'}
            >
              <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              AI工作区
            </Button>

            <div className="h-8 w-8 rounded-full bg-blue-600 text-white flex items-center justify-center cursor-pointer">
              <span>D</span>
            </div>
          </div>
        </div>
      </header>

      {/* 主体内容 */}
      <main className="flex-1">
        <div className="max-w-7xl mx-auto py-6">
          {/* 标题区域 */}
          <div className="px-4 mb-6">
            <h2 className="text-2xl font-bold text-gray-800">{t('dashboard.title')}</h2>
          </div>

          {/* Tab导航 */}
          <div className="mb-6">
            <TopNav
              activeTab={activeTab}
              onChangeTab={handleChangeTab}
            />
          </div>

          {/* 内容区域 */}
          <div className="px-4">
            {plans.length === 0 ? (
              <EmptyState onCreatePlan={handleCreatePlan} />
            ) : (
              <>
                {/* Focus Task Card */}
                {focusPlan && activeTab === 'cards' && focusPlan.stages && focusPlan.stages.length > 0 && focusPlan.currentStageId && (
                  <div className="mb-8">
                    <div className="flex items-center mb-3">
                      <svg className="w-5 h-5 text-blue-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                      </svg>
                      <h3 className="text-lg font-medium text-gray-800">{t('dashboard.focusTask')}</h3>
                    </div>
                    <div>
                      <FocusTaskCard 
                        plan={focusPlan} 
                        onEnter={handleEnterPlan} 
                      />
                    </div>
                  </div>
                )}

                {/* 计划卡片网格 */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {selectedPlans.map((plan) => (
                    <div key={plan.id} className="transform transition-transform duration-200 hover:-translate-y-1">
                      <PlanCard
                        plan={plan}
                        onEnter={handleEnterPlan}
                        onSummary={handleSummaryPlan}
                        onDelete={handleDeletePlan}
                      />
                    </div>
                  ))}
                  
                  {/* 添加新计划卡片 */}
                  {shouldShowNewCard && activeTab === 'cards' && (
                    <div className="transform transition-transform duration-200 hover:-translate-y-1">
                      <NewPlanCard onOpenDialog={handleCreatePlan} />
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </main>

      {/* 社区链接区域 */}
      {activeTab === 'cards' && (
        <footer className="border-t border-gray-200 mt-8 bg-white py-6">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex flex-col space-y-3">
              <h3 className="text-lg font-medium text-blue-600">参与社区</h3>
              <p className="text-sm text-gray-500">与团队成员、贡献者和开发者在不同渠道中交流</p>
              <div className="flex space-x-4 mt-2">
                <a 
                  href="https://github.com/your-organization/your-project" 
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="查看GitHub源代码"
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                  </svg>
                </a>
                <a 
                  href="https://dribbble.com/your-organization" 
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="查看Dribbble设计集"
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10c5.51 0 10-4.48 10-10S17.51 2 12 2zm6.605 4.61a8.502 8.502 0 011.93 5.314c-.281-.054-3.101-.629-5.943-.271-.065-.141-.12-.293-.184-.445a25.416 25.416 0 00-.564-1.236c3.145-1.28 4.577-3.124 4.761-3.362zM12 3.475c2.17 0 4.154.813 5.662 2.148-.152.216-1.443 1.941-4.48 3.08-1.399-2.57-2.95-4.675-3.189-5A8.687 8.687 0 0112 3.475zm-3.633.803a53.896 53.896 0 013.167 4.935c-3.992 1.063-7.517 1.04-7.896 1.04a8.581 8.581 0 014.729-5.975zM3.453 12.01v-.21c.37.01 4.512.065 8.775-1.215.25.477.477.965.694 1.453-.109.033-.228.065-.336.098-4.404 1.42-6.747 5.303-6.942 5.629a8.522 8.522 0 01-2.19-5.705zM12 20.547a8.482 8.482 0 01-5.239-1.8c.152-.315 1.888-3.656 6.703-5.337.022-.01.033-.01.054-.022a35.318 35.318 0 011.823 6.475 8.4 8.4 0 01-3.341.684zm4.761-1.465c-.086-.52-.542-3.015-1.659-6.084 2.679-.423 5.022.271 5.314.369a8.468 8.468 0 01-3.655 5.715z" clipRule="evenodd" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </footer>
      )}

      {/* 全局新计划对话框 */}
      <NewPlanDialog 
        isOpen={isNewPlanDialogOpen}
        onClose={handleCloseDialog}
      />
    </div>
  );
};

export default DashboardPage; 