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

const DashboardPage = () => {
  const { t, language, setLanguage } = useLanguage();
  const navigate = useNavigate();
  const { plans, fetchPlans, deletePlan, addPlan } = usePlanStore();
  const [activeTab, setActiveTab] = useState('cards');
  const [selectedPlans, setSelectedPlans] = useState<Plan[]>([]);
  const [isNewPlanDialogOpen, setIsNewPlanDialogOpen] = useState(false);

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

  const handleDirectCreatePlan = async () => {
    try {
      // 直接创建新计划，而不是导航到 /start
      await addPlan({ 
        title: t('dashboard.newPlan'), 
        description: '' 
      });
      // 确保我们在卡片视图
      setActiveTab('cards');
    } catch (error) {
      if (process.env.NODE_ENV !== 'production') {
        console.error('Failed to create plan:', error);
      }
    }
  };

  const handleNewPlanCreated = () => {
    // 当新计划创建后，确保我们在卡片视图
    setActiveTab('cards');
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
    <div className="min-h-screen zen-bg pb-12">
      {/* Top Bar */}
      <header className="flex justify-between items-center p-6">
        <h1 className="text-2xl font-semibold">Linden AI</h1>
        <div className="flex items-center space-x-2">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={toggleLanguage}
            aria-label={t('dashboard.language')}
          >
            {language === 'en' ? '中文' : 'EN'}
          </Button>
          <Button 
            variant="ghost" 
            size="icon"
            aria-label={t('dashboard.settings')}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" />
              <path d="M9 3H15M12 3V5M19 12H21M3 12H5" stroke="currentColor" strokeWidth="2" />
            </svg>
          </Button>
        </div>
      </header>

      {/* Page Title */}
      <div className="text-center mb-4">
        <h2 className="text-3xl font-bold">{t('dashboard.title')}</h2>
      </div>

      {/* Top Navigation */}
      <div className="flex justify-center mb-8">
        <TopNav
          activeTab={activeTab}
          onChangeTab={handleChangeTab}
        />
      </div>

      {/* Content */}
      {plans.length === 0 ? (
        <EmptyState onCreatePlan={handleCreatePlan} />
      ) : (
        <div className="px-4 max-w-6xl mx-auto">
          {/* Focus Task Card */}
          {focusPlan && activeTab === 'cards' && focusPlan.stages && focusPlan.stages.length > 0 && focusPlan.currentStageId && (
            <div className="mb-10">
              <div className="text-lg font-medium mb-3 text-center">
                {t('dashboard.focusTask')}
              </div>
              <div>
                <FocusTaskCard 
                  plan={focusPlan} 
                  onEnter={handleEnterPlan} 
                />
              </div>
            </div>
          )}

          {/* Task Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {selectedPlans.map((plan) => (
              <div key={plan.id}>
                <PlanCard
                  plan={plan}
                  onEnter={handleEnterPlan}
                  onSummary={handleSummaryPlan}
                  onDelete={handleDeletePlan}
                />
              </div>
            ))}
            
            {/* Add New Plan Card */}
            {shouldShowNewCard && activeTab === 'cards' && (
              <div>
                <NewPlanCard onOpenDialog={handleCreatePlan} />
              </div>
            )}
          </div>
        </div>
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