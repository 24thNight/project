import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePlanStore } from '../store/plan-store';
import { CreatePlanParams } from '../types';

/**
 * 提供任务计划常用操作的钩子
 */
export const usePlanActions = () => {
  const navigate = useNavigate();
  const { 
    addPlan, 
    deletePlan, 
    renamePlan, 
    updatePlan, 
    setActivePlan 
  } = usePlanStore();

  /**
   * 创建新计划并跳转到澄清页面
   */
  const createAndClarifyPlan = useCallback(async (planData: CreatePlanParams) => {
    const planId = await addPlan(planData);
    if (planId) {
      navigate(`/clarify?taskTitle=${encodeURIComponent(planData.title)}`);
    }
  }, [addPlan, navigate]);

  /**
   * 进入计划执行页面
   */
  const enterPlan = useCallback((planId: string) => {
    setActivePlan(planId);
    navigate(`/execution?planId=${planId}`);
  }, [setActivePlan, navigate]);

  /**
   * 查看计划摘要
   */
  const viewPlanSummary = useCallback((planId: string) => {
    navigate(`/summary?planId=${planId}`);
  }, [navigate]);

  /**
   * 软删除计划
   */
  const removePlan = useCallback(async (planId: string) => {
    await deletePlan(planId);
  }, [deletePlan]);

  /**
   * 重命名计划
   */
  const changePlanName = useCallback(async (planId: string, newTitle: string) => {
    await renamePlan(planId, newTitle);
  }, [renamePlan]);

  return {
    createAndClarifyPlan,
    enterPlan,
    viewPlanSummary,
    removePlan,
    changePlanName
  };
}; 