import React, { useState } from 'react';
import { Plan, PlanStage, Task } from '../../../types/task';
import { motion } from 'framer-motion';

interface TreeItemProps {
  item: Plan | PlanStage | Task;
  type: 'plan' | 'stage' | 'task';
  level: number;
  isActive: boolean;
  onSelect: (id: string, type: 'plan' | 'stage' | 'task') => void;
}

const PlanTreeItem: React.FC<TreeItemProps> = ({ 
  item, 
  type, 
  level, 
  isActive,
  onSelect 
}) => {
  const [isExpanded, setIsExpanded] = useState(type === 'plan');
  
  // 根据类型获取子项
  const getChildren = () => {
    if (type === 'plan') {
      return (item as Plan).stages || [];
    } else if (type === 'stage') {
      return (item as PlanStage).tasks || [];
    }
    return [];
  };
  
  const children = getChildren();
  const hasChildren = children.length > 0;
  
  // 根据类型获取图标
  const getIcon = () => {
    if (type === 'plan') {
      return (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      );
    } else if (type === 'stage') {
      return (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      );
    } else {
      // 任务图标，根据完成状态显示不同图标
      return (item as Task).completed ? (
        <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ) : (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      );
    }
  };
  
  // 根据类型获取标题
  const getTitle = () => {
    return item.title;
  };
  
  // 获取进度信息
  const getProgress = () => {
    if (type === 'plan') {
      return (item as Plan).progress;
    }
    return null;
  };
  
  // 是否显示警告
  const plan = type === 'plan' ? (item as Plan) : null;
  const showWarning = Boolean(plan && plan.delayedDays && plan.delayedDays > 0);

  return (
    <div className="select-none">
      <div 
        className={`flex items-center py-1 px-2 rounded cursor-pointer ${
          isActive ? 'bg-blue-500 text-white' : 'hover:bg-gray-700'
        }`}
        style={{ paddingLeft: `${(level * 12) + 8}px` }}
        onClick={() => onSelect(item.id, type)}
      >
        {hasChildren && (
          <button
            className="mr-1 w-5 h-5 flex items-center justify-center text-gray-400 hover:text-white"
            onClick={(e) => {
              e.stopPropagation();
              setIsExpanded(!isExpanded);
            }}
          >
            {isExpanded ? (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            )}
          </button>
        )}
        {!hasChildren && <div className="w-5 mr-1" />}
        
        <div className="mr-2">{getIcon()}</div>
        
        <div className="flex-1 truncate">
          {getTitle()}
        </div>

        {getProgress() !== null && (
          <div className="text-xs px-1.5 py-0.5 bg-blue-400 bg-opacity-20 rounded text-blue-200">
            {getProgress()}%
          </div>
        )}
        
        {showWarning && (
          <div className="ml-2 text-amber-300">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
        )}
      </div>
      
      {isExpanded && hasChildren && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.2 }}
        >
          {children.map((child) => (
            <PlanTreeItem
              key={child.id}
              item={child}
              type={type === 'plan' ? 'stage' : 'task'}
              level={level + 1}
              isActive={false}
              onSelect={onSelect}
            />
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default PlanTreeItem; 