import React, { useEffect, useState } from 'react';
import { Plan, PlanStage, Task } from '../../../types/task';
import { Button } from '../../ui/button';
import { getProgressColor } from '../../../lib/utils';
import { motion } from 'framer-motion';
import NewTaskDialog from './new-task-dialog';
import { usePlanStore } from '../../../features/task-planner/store/plan-store';
import { toast } from 'sonner';
import { useLanguage } from '../../../lib/language-context';

interface PlanDetailViewProps {
  itemId: string | null;
  itemType: 'plan' | 'stage' | 'task';
}

const PlanDetailView: React.FC<PlanDetailViewProps> = ({ itemId, itemType }) => {
  const { plans, getPlanById, addTask } = usePlanStore();
  const [selectedItem, setSelectedItem] = useState<Plan | PlanStage | Task | null>(null);
  const [parentPlan, setParentPlan] = useState<Plan | null>(null);
  const [isTaskDialogOpen, setIsTaskDialogOpen] = useState(false);
  const { t } = useLanguage();
  
  // 获取选中的项目和相关数据
  useEffect(() => {
    if (!itemId) {
      setSelectedItem(null);
      setParentPlan(null);
      return;
    }
    
    if (itemType === 'plan') {
      const plan = getPlanById(itemId);
      setSelectedItem(plan || null);
      setParentPlan(plan || null);
    } else if (itemType === 'stage') {
      // 查找包含此阶段的计划
      for (const plan of plans) {
        const stage = plan.stages?.find(s => s.id === itemId);
        if (stage) {
          setSelectedItem(stage);
          setParentPlan(plan);
          return;
        }
      }
      setSelectedItem(null);
      setParentPlan(null);
    } else if (itemType === 'task') {
      // 查找包含此任务的计划和阶段
      for (const plan of plans) {
        for (const stage of plan.stages || []) {
          const task = stage.tasks?.find(t => t.id === itemId);
          if (task) {
            setSelectedItem(task);
            setParentPlan(plan);
            return;
          }
        }
      }
      setSelectedItem(null);
      setParentPlan(null);
    }
  }, [itemId, itemType, plans, getPlanById]);
  
  const handleAddTask = async (taskData: {
    title: string;
    description: string;
    priority: 'high' | 'medium' | 'low';
  }) => {
    if (!parentPlan || !selectedItem || itemType !== 'stage') {
      toast.error(t('task.noStageSelected'));
      return;
    }
    
    try {
      const result = await addTask({
        planId: parentPlan.id,
        stageId: selectedItem.id,
        task: {
          title: taskData.title,
          description: taskData.description,
          priority: taskData.priority,
          status: 'active',
          completed: false
        }
      });
      
      if (result) {
        setIsTaskDialogOpen(false);
        toast.success(t('task.taskCreated'));
      }
    } catch (error) {
      toast.error(t('task.taskCreationFailed'));
      console.error('添加任务出错:', error);
    }
  };
  
  // 处理任务对话框打开
  const handleOpenTaskDialog = () => {
    setIsTaskDialogOpen(true);
  };
  
  // 处理任务对话框关闭
  const handleCloseTaskDialog = () => {
    setIsTaskDialogOpen(false);
  };
  
  // 如果没有选中项目，显示空状态
  if (!selectedItem) {
    return (
      <div className="h-full flex items-center justify-center bg-white text-gray-400">
        <div className="text-center p-8">
          <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h3 className="text-xl font-medium mb-2">工作区</h3>
          <p className="max-w-md text-sm mb-4">请从左侧选择一个计划、阶段或任务</p>
        </div>
      </div>
    );
  }
  
  // 根据选中项目的类型显示不同的内容
  if (itemType === 'plan') {
    const plan = selectedItem as Plan;
    const completedStages = plan.stages?.filter(s => s.completed)?.length || 0;
    const totalStages = plan.stages?.length || 0;
    
    return (
      <div className="h-full flex flex-col bg-white">
        <div className="border-b border-gray-200 p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">{plan.title}</h1>
              {plan.description && (
                <p className="text-gray-500 mt-1">{plan.description}</p>
              )}
            </div>
            <div className="flex space-x-2">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                编辑计划
              </Button>
              <Button variant="outline" className="border-gray-300">
                添加阶段
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-4 mt-6">
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="text-sm text-gray-500 mb-1">进度</div>
              <div className="text-2xl font-bold">{plan.progress}%</div>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div 
                  className={`h-2 rounded-full ${getProgressColor(plan.progress)}`} 
                  style={{ width: `${plan.progress}%` }}
                />
              </div>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="text-sm text-gray-500 mb-1">阶段</div>
              <div className="text-2xl font-bold">{completedStages}/{totalStages}</div>
              <div className="text-sm text-gray-500 mt-2">
                {totalStages === 0 ? '还没有阶段' : 
                  completedStages === totalStages ? '所有阶段已完成' : 
                  `还有 ${totalStages - completedStages} 个阶段待完成`}
              </div>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="text-sm text-gray-500 mb-1">创建时间</div>
              <div className="text-lg font-medium">{plan.createdAt.toLocaleDateString()}</div>
              <div className="text-sm text-gray-500 mt-2">
                上次更新: {plan.updatedAt.toLocaleDateString()}
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex-1 overflow-auto p-6">
          <h2 className="text-xl font-bold mb-4">阶段</h2>
          
          {plan.stages && plan.stages.length > 0 ? (
            <div className="space-y-4">
              {plan.stages.map((stage) => (
                <motion.div 
                  key={stage.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="border border-gray-200 rounded-lg shadow-sm p-4"
                >
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="text-lg font-medium">{stage.title}</h3>
                    <div className="flex items-center">
                      {stage.completed ? (
                        <span className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded-full flex items-center">
                          <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          已完成
                        </span>
                      ) : (
                        <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
                          进行中
                        </span>
                      )}
                      <Button variant="ghost" size="sm" className="ml-2">
                        查看详情
                      </Button>
                    </div>
                  </div>
                  
                  {stage.tasks && stage.tasks.length > 0 ? (
                    <div className="space-y-2">
                      {stage.tasks.map((task) => (
                        <div 
                          key={task.id}
                          className="flex items-center p-2 hover:bg-gray-50 rounded"
                        >
                          <div className="mr-3">
                            {task.completed ? (
                              <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                            ) : (
                              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                            )}
                          </div>
                          <div className="flex-1">
                            <div className={`font-medium ${task.completed ? 'line-through text-gray-500' : 'text-gray-800'}`}>
                              {task.title}
                            </div>
                            {task.description && (
                              <div className="text-sm text-gray-500 mt-1">{task.description}</div>
                            )}
                          </div>
                          <div>
                            {task.priority === 'high' && (
                              <span className="text-xs px-2 py-1 bg-red-100 text-red-800 rounded-full">
                                高优先级
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-4 text-gray-400">
                      没有任务
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-400 border border-dashed border-gray-300 rounded-lg">
              <svg className="w-12 h-12 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <p className="mb-4">这个计划还没有阶段</p>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                添加第一个阶段
              </Button>
            </div>
          )}
        </div>
      </div>
    );
  } else if (itemType === 'stage') {
    const stage = selectedItem as PlanStage;
    
    return (
      <div className="h-full flex flex-col bg-white">
        <div className="border-b border-gray-200 p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <div className="text-sm text-blue-600 mb-1">
                {parentPlan && (
                  <button 
                    className="hover:underline"
                    onClick={() => {/* 处理导航到计划 */}}
                    aria-label={`查看计划: ${parentPlan.title}`}
                  >
                    {parentPlan.title}
                  </button>
                )} / 阶段
              </div>
              <h1 className="text-2xl font-bold text-gray-800">{stage.title}</h1>
            </div>
            <div className="flex space-x-2">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                编辑阶段
              </Button>
              <Button 
                variant="outline" 
                className="border-gray-300"
                onClick={handleOpenTaskDialog}
              >
                {t('task.addTask')}
              </Button>
            </div>
          </div>
          
          <div className="flex items-center mt-4">
            <div className={`px-3 py-1 rounded-full text-sm ${
              stage.completed 
                ? 'bg-green-100 text-green-800' 
                : 'bg-blue-100 text-blue-800'
            }`}>
              {stage.completed ? '已完成' : '进行中'}
            </div>
          </div>
        </div>
        
        <div className="flex-1 overflow-auto p-6">
          <h2 className="text-xl font-bold mb-4">任务列表</h2>
          
          {stage.tasks && stage.tasks.length > 0 ? (
            <div className="space-y-3">
              {stage.tasks.map((task) => (
                <motion.div 
                  key={task.id}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow"
                >
                  <div className="flex items-start">
                    <div className="mr-3 pt-1">
                      {task.completed ? (
                        <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      ) : (
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className={`text-lg font-medium ${task.completed ? 'line-through text-gray-500' : 'text-gray-800'}`}>
                        {task.title}
                      </div>
                      {task.description && (
                        <div className="text-gray-500 mt-1">{task.description}</div>
                      )}
                      <div className="flex items-center mt-3">
                        {task.priority === 'high' && (
                          <span className="text-xs px-2 py-1 bg-red-100 text-red-800 rounded-full mr-2">
                            高优先级
                          </span>
                        )}
                        {task.priority === 'medium' && (
                          <span className="text-xs px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full mr-2">
                            中优先级
                          </span>
                        )}
                        {task.status === 'active' && !task.completed && (
                          <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
                            进行中
                          </span>
                        )}
                      </div>
                    </div>
                    <div>
                      <Button variant="ghost" size="sm">
                        编辑
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-400 border border-dashed border-gray-300 rounded-lg">
              <svg className="w-12 h-12 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <p className="mb-4">这个阶段还没有任务</p>
              <Button 
                className="bg-blue-600 hover:bg-blue-700 text-white"
                onClick={handleOpenTaskDialog}
              >
                {t('task.addFirstTask')}
              </Button>
            </div>
          )}
        </div>
        
        {/* 任务创建对话框 */}
        <NewTaskDialog 
          isOpen={isTaskDialogOpen}
          onClose={handleCloseTaskDialog}
          onSubmit={handleAddTask}
          planId={parentPlan?.id || ''}
          stageId={stage.id}
        />
      </div>
    );
  } else {
    // 任务详情
    const task = selectedItem as Task;
    
    return (
      <div className="h-full flex flex-col bg-white">
        <div className="border-b border-gray-200 p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <div className="text-sm text-blue-600 mb-1">
                {parentPlan && (
                  <button 
                    className="hover:underline"
                    onClick={() => {/* 处理导航到计划 */}}
                    aria-label={`查看计划: ${parentPlan.title}`}
                  >
                    {parentPlan.title}
                  </button>
                )} / 任务
              </div>
              <h1 className="text-2xl font-bold text-gray-800">{task.title}</h1>
            </div>
            <div className="flex space-x-2">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                {t('task.editTask')}
              </Button>
              <Button 
                variant="outline" 
                className={task.completed ? 'border-gray-300 text-gray-700' : 'border-green-500 text-green-700 hover:bg-green-50'}
              >
                {task.completed ? t('task.undoComplete') : t('task.markComplete')}
              </Button>
            </div>
          </div>
          
          <div className="flex items-center mt-4 space-x-3">
            <div className={`px-3 py-1 rounded-full text-sm ${
              task.completed 
                ? 'bg-green-100 text-green-800' 
                : 'bg-blue-100 text-blue-800'
            }`}>
              {task.completed ? t('task.completed') : t('task.active')}
            </div>
            
            {task.priority === 'high' && (
              <div className="px-3 py-1 rounded-full text-sm bg-red-100 text-red-800">
                高优先级
              </div>
            )}
            
            {task.priority === 'medium' && (
              <div className="px-3 py-1 rounded-full text-sm bg-yellow-100 text-yellow-800">
                中优先级
              </div>
            )}
            
            {task.priority === 'low' && (
              <div className="px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-800">
                低优先级
              </div>
            )}
          </div>
        </div>
        
        <div className="flex-1 overflow-auto p-6">
          {task.description ? (
            <div className="prose max-w-none">
              <h2 className="text-xl font-bold mb-4">描述</h2>
              <p>{task.description}</p>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-400 border border-dashed border-gray-300 rounded-lg">
              <svg className="w-12 h-12 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              <p className="mb-4">这个任务还没有描述</p>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                {t('task.addDescription')}
              </Button>
            </div>
          )}
          
          <div className="mt-8">
            <h2 className="text-xl font-bold mb-4">任务动态</h2>
            <div className="space-y-4">
              <div className="flex">
                <div className="mr-3">
                  <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  </div>
                </div>
                <div>
                  <div className="font-medium">任务已创建</div>
                  <div className="text-sm text-gray-500">
                    {new Date().toLocaleDateString()} {new Date().toLocaleTimeString()}
                  </div>
                </div>
              </div>
              
              {task.completed && (
                <div className="flex">
                  <div className="mr-3">
                    <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  </div>
                  <div>
                    <div className="font-medium">任务已完成</div>
                    <div className="text-sm text-gray-500">
                      {new Date().toLocaleDateString()} {new Date().toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
};

export default PlanDetailView; 