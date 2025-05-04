import axios from 'axios';
import { Plan, CreatePlanParams, UpdatePlanParams, AddTaskParams, Task } from '../types';
import { toast } from 'sonner';
import { devError } from '../../../lib/utils';

// API base URL - should be configured based on environment
const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://jjnucnlvlsaj.sealoshzh.site';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: false,
});

// Response interface
interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

/**
 * 任务规划模块的API服务
 */
export const plannerApi = {
  /**
   * 获取所有计划
   */
  async fetchPlans(): Promise<Plan[]> {
    try {
      const response = await api.get<ApiResponse<Plan[]>>('/plans');
      return response.data.data;
    } catch (error) {
      devError('Error fetching plans:', error);
      return [];
    }
  },

  /**
   * 获取单个计划详情
   */
  async getPlanById(id: string): Promise<Plan | null> {
    try {
      const response = await api.get<ApiResponse<Plan>>(`/plans/${id}`);
      return response.data.data;
    } catch (error) {
      devError('Error fetching plan details:', error);
      toast.error('无法获取计划详情');
      return null;
    }
  },

  /**
   * 创建新计划
   */
  async createPlan(planData: CreatePlanParams): Promise<Plan | null> {
    try {
      const response = await api.post<ApiResponse<Plan>>('/plans', planData);
      toast.success('计划创建成功');
      return response.data.data;
    } catch (error) {
      devError('Error creating plan:', error);
      // 简化错误处理
      toast.error('服务器连接失败，已创建本地计划');
      return null;
    }
  },

  /**
   * 更新计划
   */
  async updatePlan(id: string, updates: UpdatePlanParams): Promise<Plan | null> {
    try {
      const response = await api.put<ApiResponse<Plan>>(`/plans/${id}`, updates);
      toast.success('计划更新成功');
      return response.data.data;
    } catch (error) {
      devError('Error updating plan:', error);
      toast.error('更新计划失败');
      return null;
    }
  },

  /**
   * 删除计划
   */
  async deletePlan(id: string): Promise<boolean> {
    try {
      await api.delete<ApiResponse<null>>(`/plans/${id}`);
      toast.success('计划已删除');
      return true;
    } catch (error) {
      devError('Error deleting plan:', error);
      toast.error('删除计划失败');
      return false;
    }
  },

  /**
   * 添加任务到阶段
   */
  async addTask(params: AddTaskParams): Promise<Task | null> {
    try {
      const { planId, stageId, task } = params;
      const response = await api.post<ApiResponse<Task>>(`/plans/${planId}/stages/${stageId}/tasks`, task);
      toast.success('任务创建成功');
      return response.data.data;
    } catch (error) {
      devError('Error creating task:', error);
      toast.error('创建任务失败');
      return null;
    }
  },

  /**
   * 创建本地任务（无需API）
   */
  createLocalTask(params: AddTaskParams): Task {
    const id = `task-${Date.now()}`;
    
    return {
      id,
      title: params.task.title,
      description: params.task.description || "",
      status: params.task.status || "active",
      priority: params.task.priority || "medium",
      completed: false,
    };
  },

  /**
   * 创建本地计划（无需API）
   */
  createLocalPlan(planData: CreatePlanParams): Plan {
    const id = `plan-${Date.now()}`;
    const defaultStageId = `stage-${Date.now()}`;
    
    return {
      id,
      title: planData.title,
      description: planData.description || "",
      currentStageId: defaultStageId,
      stages: [
        {
          id: defaultStageId,
          title: "第一阶段",
          completed: false,
          tasks: [],
        },
      ],
      createdAt: new Date(),
      updatedAt: new Date(),
      status: "ongoing",
      progress: 0,
    };
  }
}; 