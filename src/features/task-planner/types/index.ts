export type TaskStatus = 'active' | 'completed' | 'deleted';

export type TaskPriority = 'high' | 'medium' | 'low';

export interface Task {
  id: string;
  title: string;
  description?: string;
  dueDate?: Date;
  status: TaskStatus;
  priority: TaskPriority;
  completed: boolean;
}

export type PlanStatus = 'ongoing' | 'completed' | 'deleted';

export interface PlanStage {
  id: string;
  title: string;
  tasks: Task[];
  completed: boolean;
}

export interface Plan {
  id: string;
  title: string;
  description?: string;
  currentStageId: string;
  stages: PlanStage[];
  createdAt: Date;
  updatedAt: Date;
  status: PlanStatus;
  progress: number; // 0-100
  delayedDays?: number;
}

// 创建新计划时的请求参数类型
export interface CreatePlanParams {
  title: string;
  description?: string;
}

// 更新计划时的请求参数类型
export interface UpdatePlanParams {
  id: string;
  title?: string;
  description?: string;
  currentStageId?: string;
  status?: PlanStatus;
}

// 向计划添加任务的参数类型
export interface AddTaskParams {
  planId: string;
  stageId: string;
  task: Omit<Task, 'id'>;
} 