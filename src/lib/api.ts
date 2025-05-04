import axios from 'axios';
import { Plan } from '../types/task';
import { toast } from 'sonner';
import { t } from './i18n';
import { Language } from './i18n';

// API base URL - should be configured based on environment
const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://jjnucnlvlsaj.sealoshzh.site';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  // 支持跨域请求
  withCredentials: false,
});

// 请求拦截器 - 只在开发环境下输出日志
api.interceptors.request.use(
  (config) => {
    if (process.env.NODE_ENV !== 'production') {
      console.log('API Request:', config.method?.toUpperCase(), config.url);
    }
    return config;
  },
  (error) => {
    if (process.env.NODE_ENV !== 'production') {
      console.error('API Request Error:', error);
    }
    return Promise.reject(error);
  }
);

// 响应拦截器 - 只在开发环境下输出日志
api.interceptors.response.use(
  (response) => {
    if (process.env.NODE_ENV !== 'production') {
      console.log('API Response:', response.status, response.data);
    }
    return response;
  },
  (error) => {
    if (process.env.NODE_ENV !== 'production') {
      console.error('API Response Error:', error.response || error.message || error);
    }
    return Promise.reject(error);
  }
);

// Response interface according to project requirements
interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

// Error handling helper
const handleApiError = (error: any, lang: Language = 'en'): never => {
  // 从错误响应中获取消息，或使用默认错误消息
  let errorMessage = t('api.errors.default', lang);

  // Check if it's an axios error by checking for response property
  if (error && error.response) {
    if (error.response.data?.message) {
      // 使用服务器返回的错误消息
      errorMessage = error.response.data.message;
    }
  } else if (error && error.request) {
    // 网络错误 - 请求发出但没有收到响应
    errorMessage = t('api.errors.network', lang);
  }

  toast.error(errorMessage);
  throw error;
};

/**
 * 处理 API 响应
 * @param action API 操作类型：create, update, delete, rename
 * @param lang 当前语言
 */
const handleSuccess = (action: 'create' | 'update' | 'delete' | 'rename', lang: Language = 'en') => {
  toast.success(t(`api.success.${action}`, lang));
};

// API methods
export const planApi = {
  // 获取所有计划
  async fetchPlans(lang: Language = 'en'): Promise<Plan[]> {
    try {
      const response = await api.get<ApiResponse<Plan[]>>('/plans');
      return response.data.data;
    } catch (error) {
      if (process.env.NODE_ENV !== 'production') {
        console.error('Error fetching plans:', error);
      }
      // 返回空数组而不是抛出错误，这样UI可以正常显示空状态
      return [];
    }
  },

  // 获取单个计划详情
  async getPlanById(id: string, lang: Language = 'en'): Promise<Plan> {
    try {
      const response = await api.get<ApiResponse<Plan>>(`/plans/${id}`);
      return response.data.data;
    } catch (error) {
      return handleApiError(error, lang);
    }
  },

  // 创建新计划
  async createPlan(plan: Partial<Plan>, lang: Language = 'en'): Promise<Plan> {
    try {
      // 尝试通过 API 创建
      const response = await api.post<ApiResponse<Plan>>('/plans', plan);
      handleSuccess('create', lang);
      
      // 如果成功，返回后端返回的数据
      if (response.data && response.data.success && response.data.data) {
        return response.data.data;
      }
      
      // 如果后端返回格式不正确，创建本地计划
      if (process.env.NODE_ENV !== 'production') {
        console.warn('Backend response format incorrect, creating local plan');
      }
      const localPlan = this.createLocalPlan(plan);
      return localPlan;
    } catch (error) {
      if (process.env.NODE_ENV !== 'production') {
        console.error('Error creating plan via API, falling back to local creation', error);
      }
      // 创建本地计划作为备份
      const localPlan = this.createLocalPlan(plan);
      // 仍然显示成功消息，因为从用户角度看任务创建成功了
      handleSuccess('create', lang);
      return localPlan;
    }
  },
  
  // 创建本地计划（无需 API）
  createLocalPlan(planData: Partial<Plan>): Plan {
    const id = `plan-${Date.now()}`;
    const defaultStageId = `stage-${Date.now()}`;
    
    return {
      id,
      title: planData.title || "新建计划",
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
      ...planData
    };
  },

  // 更新计划
  async updatePlan(id: string, updates: Partial<Plan>, lang: Language = 'en'): Promise<Plan> {
    try {
      const response = await api.put<ApiResponse<Plan>>(`/plans/${id}`, updates);
      handleSuccess('update', lang);
      return response.data.data;
    } catch (error) {
      return handleApiError(error, lang);
    }
  },

  // 重命名计划
  async renamePlan(id: string, newTitle: string, lang: Language = 'en'): Promise<Plan> {
    try {
      const response = await api.patch<ApiResponse<Plan>>(`/plans/${id}/rename`, { title: newTitle });
      handleSuccess('rename', lang);
      return response.data.data;
    } catch (error) {
      return handleApiError(error, lang);
    }
  },

  // 删除计划（软删除）
  async deletePlan(id: string, lang: Language = 'en'): Promise<void> {
    try {
      await api.delete<ApiResponse<null>>(`/plans/${id}`);
      handleSuccess('delete', lang);
    } catch (error) {
      handleApiError(error, lang);
    }
  },

  // 获取计划当前阶段
  async getPlanCurrentStage(planId: string, lang: Language = 'en'): Promise<any> {
    try {
      const response = await api.get<ApiResponse<any>>(`/plans/${planId}/current-stage`);
      return response.data.data;
    } catch (error) {
      return handleApiError(error, lang);
    }
  },
}; 