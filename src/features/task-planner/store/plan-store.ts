import { create } from 'zustand';
import { 
  Plan, 
  CreatePlanParams, 
  UpdatePlanParams,
  AddTaskParams,
  Task
} from '../types';
import { plannerApi } from '../utils/api';
import { devError } from '../../../lib/utils';

interface PlanState {
  plans: Plan[];
  activePlanId: string | null;
  isLoading: boolean;
  error: string | null;
  
  // 查询方法
  getActivePlans: () => Plan[];
  getDeletedPlans: () => Plan[];
  getPlanById: (id: string) => Plan | undefined;
  getCurrentStage: (planId: string) => { stage: any, plan: Plan } | null;
  
  // 操作方法
  fetchPlans: () => Promise<void>;
  setActivePlan: (id: string | null) => void;
  addPlan: (planData: CreatePlanParams) => Promise<string | null>;
  updatePlan: (id: string, updates: Partial<Plan>) => Promise<void>;
  renamePlan: (id: string, newTitle: string) => Promise<void>;
  deletePlan: (id: string) => Promise<void>;
  addTask: (params: AddTaskParams) => Promise<Task | null>;
}

export const usePlanStore = create<PlanState>((set, get) => ({
  plans: [],
  activePlanId: null,
  isLoading: false,
  error: null,
  
  // 查询方法 - 不会触发状态更新
  getActivePlans: () => {
    return get().plans.filter(plan => plan.status !== 'deleted');
  },
  
  getDeletedPlans: () => {
    return get().plans.filter(plan => plan.status === 'deleted');
  },
  
  getPlanById: (id: string) => {
    return get().plans.find(plan => plan.id === id);
  },
  
  getCurrentStage: (planId: string) => {
    const plan = get().plans.find(p => p.id === planId);
    if (!plan) return null;
    
    const stage = plan.stages.find(s => s.id === plan.currentStageId);
    if (!stage) return null;
    
    return { stage, plan };
  },

  // 操作方法 - 会触发状态更新
  fetchPlans: async () => {
    set({ isLoading: true, error: null });
    try {
      const plans = await plannerApi.fetchPlans();
      
      // 确保每个plan都有有效的stages数组
      const validatedPlans = plans.map(plan => ({
        ...plan,
        stages: plan.stages || []
      }));
      
      set({ plans: validatedPlans, isLoading: false });
    } catch (error) {
      devError('Failed to fetch plans:', error);
      set({ 
        error: error instanceof Error ? error.message : '获取计划失败', 
        isLoading: false,
      });
    }
  },

  setActivePlan: (id: string | null) => {
    set({ activePlanId: id });
  },

  addPlan: async (planData: CreatePlanParams) => {
    set({ isLoading: true, error: null });
    try {
      // 调用API创建新计划
      const newPlan = await plannerApi.createPlan(planData);
      
      if (newPlan) {
        // 确保plan有有效的stages数组
        const validatedPlan = {
          ...newPlan,
          stages: newPlan.stages || []
        };
        
        set(state => ({ 
          plans: [...state.plans, validatedPlan],
          isLoading: false 
        }));
        return validatedPlan.id;
      } else {
        // API返回null，创建本地计划
        const localPlan = plannerApi.createLocalPlan(planData);
        
        // 确保在UI上立即显示本地创建的计划
        set(state => ({ 
          plans: [...state.plans, localPlan],
          isLoading: false 
        }));
        
        devError('API创建失败，已创建本地计划:', localPlan.id);
        return localPlan.id;
      }
    } catch (error) {
      devError('Failed to add plan:', error);
      
      // 即使API请求异常，也尝试创建本地计划，确保用户体验
      const localPlan = plannerApi.createLocalPlan(planData);
      
      // 更新状态，让本地计划立即显示
      set(state => ({ 
        plans: [...state.plans, localPlan],
        error: error instanceof Error ? error.message : '创建计划失败',
        isLoading: false 
      }));
      
      devError('API异常，已创建本地计划:', localPlan.id);
      return localPlan.id; // 返回本地计划ID而不是null
    }
  },

  updatePlan: async (id: string, updates: Partial<Plan>) => {
    set({ isLoading: true, error: null });
    try {
      // 调用API更新计划
      await plannerApi.updatePlan(id, updates as UpdatePlanParams);
      set(state => ({
        plans: state.plans.map(plan => 
          plan.id === id ? { ...plan, ...updates, updatedAt: new Date() } : plan
        ),
        isLoading: false
      }));
    } catch (error) {
      devError('Failed to update plan:', error);
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

  renamePlan: async (id: string, newTitle: string) => {
    set({ isLoading: true, error: null });
    try {
      // 调用API重命名计划
      await plannerApi.updatePlan(id, { id, title: newTitle });
      set(state => ({
        plans: state.plans.map(plan => 
          plan.id === id 
            ? { ...plan, title: newTitle, updatedAt: new Date() } 
            : plan
        ),
        isLoading: false
      }));
    } catch (error) {
      devError('Failed to rename plan:', error);
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

  deletePlan: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      // 调用API删除计划（软删除）
      await plannerApi.deletePlan(id);
      set(state => ({
        plans: state.plans.map(plan => 
          plan.id === id 
            ? { ...plan, status: 'deleted' as const, updatedAt: new Date() } 
            : plan
        ),
        isLoading: false
      }));
    } catch (error) {
      devError('Failed to delete plan:', error);
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

  addTask: async (params: AddTaskParams) => {
    set({ isLoading: true, error: null });
    try {
      // 尝试调用API添加任务
      const newTask = await plannerApi.addTask(params);
      
      if (newTask) {
        // API添加成功，更新本地状态
        set(state => ({
          plans: state.plans.map(plan => {
            if (plan.id === params.planId) {
              return {
                ...plan,
                stages: plan.stages.map(stage => {
                  if (stage.id === params.stageId) {
                    return {
                      ...stage,
                      tasks: [...stage.tasks, newTask]
                    };
                  }
                  return stage;
                }),
                updatedAt: new Date()
              };
            }
            return plan;
          }),
          isLoading: false
        }));
        return newTask;
      }
      
      // API返回null，创建本地任务
      const localTask = plannerApi.createLocalTask(params);
      
      // 更新本地状态
      set(state => ({
        plans: state.plans.map(plan => {
          if (plan.id === params.planId) {
            return {
              ...plan,
              stages: plan.stages.map(stage => {
                if (stage.id === params.stageId) {
                  return {
                    ...stage,
                    tasks: [...stage.tasks, localTask]
                  };
                }
                return stage;
              }),
              updatedAt: new Date()
            };
          }
          return plan;
        }),
        isLoading: false
      }));
      
      return localTask;
    } catch (error) {
      devError('Failed to add task:', error);
      set({ 
        error: error instanceof Error ? error.message : '添加任务失败',
        isLoading: false 
      });
      return null;
    }
  }
})); 