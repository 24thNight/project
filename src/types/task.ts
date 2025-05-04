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

// Mock data for the dashboard
export const mockPlans: Plan[] = [
  {
    id: "plan-1",
    title: "Learn TypeScript and React",
    description: "Master TypeScript and React for web development",
    currentStageId: "stage-1",
    stages: [
      {
        id: "stage-1",
        title: "TypeScript Basics",
        completed: false,
        tasks: [
          {
            id: "task-1",
            title: "Learn TypeScript fundamentals",
            status: "active",
            priority: "high",
            completed: false,
          },
          {
            id: "task-2",
            title: "Practice with TypeScript interfaces",
            status: "active",
            priority: "medium",
            completed: false,
          },
        ],
      },
      {
        id: "stage-2",
        title: "React Fundamentals",
        completed: false,
        tasks: [
          {
            id: "task-3",
            title: "Learn React hooks",
            status: "active",
            priority: "high",
            completed: false,
          },
        ],
      },
    ],
    createdAt: new Date(2025, 4, 1),
    updatedAt: new Date(2025, 4, 2),
    status: "ongoing",
    progress: 30,
  },
  {
    id: "plan-2",
    title: "Design System Project",
    description: "Create a company-wide design system",
    currentStageId: "stage-3",
    stages: [
      {
        id: "stage-3",
        title: "Component Library",
        completed: false,
        tasks: [
          {
            id: "task-4",
            title: "Design button component",
            status: "completed",
            priority: "high",
            completed: true,
          },
          {
            id: "task-5",
            title: "Design card component",
            status: "active",
            priority: "medium",
            completed: false,
          },
        ],
      },
    ],
    createdAt: new Date(2025, 4, 1),
    updatedAt: new Date(2025, 4, 1),
    status: "ongoing",
    progress: 65,
    delayedDays: 2,
  },
  {
    id: "plan-3",
    title: "Marketing Campaign",
    description: "Q2 Marketing Campaign",
    currentStageId: "stage-4",
    stages: [
      {
        id: "stage-4",
        title: "Content Creation",
        completed: false,
        tasks: [
          {
            id: "task-6",
            title: "Write blog posts",
            status: "active",
            priority: "high",
            completed: false,
          },
        ],
      },
    ],
    createdAt: new Date(2025, 3, 15),
    updatedAt: new Date(2025, 4, 1),
    status: "ongoing",
    progress: 45,
  },
]; 