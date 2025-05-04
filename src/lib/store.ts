import { create } from 'zustand';
import { Plan, mockPlans } from '../types/task';
import { planApi } from './api';
import { Language } from './i18n';

interface PlanState {
  plans: Plan[];
  focusPlanId: string | null;
  isLoading: boolean;
  error: string | null;
  language: Language;
  
  // Actions
  setLanguage: (lang: Language) => void;
  fetchPlans: (lang?: Language) => Promise<void>;
  getPlanById: (id: string) => Plan | undefined;
  setFocusPlan: (id: string | null) => void;
  addPlan: (plan: Partial<Plan>, lang?: Language) => Promise<string>;
  updatePlan: (id: string, updates: Partial<Plan>, lang?: Language) => Promise<void>;
  renamePlan: (id: string, newTitle: string, lang?: Language) => Promise<void>;
  deletePlan: (id: string, lang?: Language) => Promise<void>;
  getCurrentStage: (planId: string) => { stage: any, plan: Plan } | null;
}

export const usePlanStore = create<PlanState>((set, get) => ({
  plans: [],
  focusPlanId: null,
  isLoading: false,
  error: null,
  language: 'zh',
  
  setLanguage: (lang: Language) => {
    set({ language: lang });
  },

  fetchPlans: async (lang) => {
    const currentLang = lang || get().language;
    set({ isLoading: true, error: null });
    try {
      // 使用API从后端获取计划列表
      const plans = await planApi.fetchPlans(currentLang);
      
      // Ensure every plan has a valid stages array
      const validatedPlans = plans.map(plan => ({
        ...plan,
        stages: plan.stages || []
      }));
      
      // 如果服务器返回空列表，但本地已有计划，则保留本地计划
      if (validatedPlans.length === 0 && get().plans.length > 0) {
        console.warn('Server returned empty plans list, keeping local plans');
        set({ isLoading: false });
        return;
      }
      
      set({ plans: validatedPlans, isLoading: false });
    } catch (error) {
      console.error('Failed to fetch plans:', error);
      
      // 如果已有本地计划数据，则保持本地数据不变，不替换为mock数据
      if (get().plans.length > 0) {
        set({ 
          error: error instanceof Error ? error.message : '获取计划失败', 
          isLoading: false
        });
      } else {
        // 只有在本地没有数据时才使用mock数据
        set({ 
          error: error instanceof Error ? error.message : '获取计划失败', 
          isLoading: false,
          // 如果API失败且本地没有数据，使用mock数据作为后备
          plans: mockPlans
        });
      }
    }
  },

  getPlanById: (id: string) => {
    return get().plans.find(plan => plan.id === id);
  },

  setFocusPlan: (id: string | null) => {
    set({ focusPlanId: id });
  },

  addPlan: async (planData: Partial<Plan>, lang) => {
    const currentLang = lang || get().language;
    set({ isLoading: true, error: null });
    try {
      // 调用API创建新计划
      const newPlan = await planApi.createPlan(planData, currentLang);
      
      // Ensure the plan has a valid stages array
      const validatedPlan = {
        ...newPlan,
        stages: newPlan.stages || []
      };
      
      set(state => ({ 
        plans: [...state.plans, validatedPlan],
        isLoading: false 
      }));
      return validatedPlan.id;
    } catch (error) {
      console.error('Failed to add plan:', error);
      set({ 
        error: error instanceof Error ? error.message : '创建计划失败',
        isLoading: false 
      });
      
      // 回退到本地创建 (不依赖后端)
      // 使用 API 模块中的方法创建本地计划，确保结构完整
      const newPlan = planApi.createLocalPlan({
        title: planData.title || "新建计划",
        description: planData.description || "",
        ...planData
      });
      
      // Local plan should already have stages array from planApi.createLocalPlan
      set(state => ({ plans: [...state.plans, newPlan] }));
      return newPlan.id;
    }
  },

  updatePlan: async (id: string, updates: Partial<Plan>, lang) => {
    const currentLang = lang || get().language;
    set({ isLoading: true, error: null });
    try {
      // 调用API更新计划
      await planApi.updatePlan(id, updates, currentLang);
      set(state => ({
        plans: state.plans.map(plan => 
          plan.id === id ? { ...plan, ...updates, updatedAt: new Date() } : plan
        ),
        isLoading: false
      }));
    } catch (error) {
      console.error('Failed to update plan:', error);
      set({ 
        error: error instanceof Error ? error.message : '更新计划失败',
        isLoading: false 
      });
      
      // 仍在本地更新UI以保持响应性
      set(state => ({
        plans: state.plans.map(plan => 
          plan.id === id ? { ...plan, ...updates, updatedAt: new Date() } : plan
        )
      }));
    }
  },

  renamePlan: async (id: string, newTitle: string, lang) => {
    const currentLang = lang || get().language;
    set({ isLoading: true, error: null });
    try {
      // 调用API重命名计划
      await planApi.renamePlan(id, newTitle, currentLang);
      set(state => ({
        plans: state.plans.map(plan => 
          plan.id === id 
            ? { ...plan, title: newTitle, updatedAt: new Date() } 
            : plan
        ),
        isLoading: false
      }));
    } catch (error) {
      console.error('Failed to rename plan:', error);
      set({ 
        error: error instanceof Error ? error.message : '重命名计划失败',
        isLoading: false 
      });
      
      // 仍在本地更新UI以保持响应性
      set(state => ({
        plans: state.plans.map(plan => 
          plan.id === id 
            ? { ...plan, title: newTitle, updatedAt: new Date() } 
            : plan
        )
      }));
    }
  },

  deletePlan: async (id: string, lang) => {
    const currentLang = lang || get().language;
    set({ isLoading: true, error: null });
    try {
      // 调用API删除计划（软删除）
      await planApi.deletePlan(id, currentLang);
      set(state => ({
        plans: state.plans.map(plan => 
          plan.id === id 
            ? { ...plan, status: 'deleted' as const, updatedAt: new Date() } 
            : plan
        ),
        isLoading: false
      }));
    } catch (error) {
      console.error('Failed to delete plan:', error);
      set({ 
        error: error instanceof Error ? error.message : '删除计划失败',
        isLoading: false 
      });
      
      // 仍在本地更新UI以保持响应性
      set(state => ({
        plans: state.plans.map(plan => 
          plan.id === id 
            ? { ...plan, status: 'deleted' as const, updatedAt: new Date() } 
            : plan
        )
      }));
    }
  },

  getCurrentStage: (planId: string) => {
    const plan = get().plans.find(p => p.id === planId);
    if (!plan) return null;
    
    const stage = plan.stages.find(s => s.id === plan.currentStageId);
    if (!stage) return null;
    
    return { stage, plan };
  }
})); 