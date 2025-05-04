import React, { useState, useEffect } from 'react';
import { usePlanStore } from '../../../lib/store';
import PlanTreeItem from './plan-tree-item';
import { Button } from '../../ui/button';

interface PlanTreeProps {
  onSelectItem: (id: string, type: 'plan' | 'stage' | 'task') => void;
}

const PlanTree: React.FC<PlanTreeProps> = ({ onSelectItem }) => {
  const { plans, fetchPlans, isLoading, error } = usePlanStore();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<'plan' | 'stage' | 'task'>('plan');
  const [filter, setFilter] = useState<'all' | 'active' | 'deleted'>('active');

  // 加载计划数据
  useEffect(() => {
    fetchPlans();
  }, [fetchPlans]);

  // 按过滤条件筛选计划
  const filteredPlans = plans.filter(plan => {
    if (filter === 'all') return true;
    if (filter === 'active') return plan.status !== 'deleted';
    if (filter === 'deleted') return plan.status === 'deleted';
    return true;
  });

  // 处理选择项
  const handleSelect = (id: string, type: 'plan' | 'stage' | 'task') => {
    setSelectedId(id);
    setSelectedType(type);
    onSelectItem(id, type);
  };

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-gray-700">
        <h2 className="font-medium text-white mb-3">计划浏览器</h2>
        
        {/* 筛选器 */}
        <div className="flex space-x-1 text-xs">
          <Button 
            size="sm"
            variant={filter === 'active' ? 'default' : 'outline'}
            className={filter === 'active' 
              ? 'bg-blue-600 hover:bg-blue-700' 
              : 'border-gray-600 text-gray-300 hover:bg-gray-700'
            }
            onClick={() => setFilter('active')}
          >
            进行中
          </Button>
          <Button 
            size="sm"
            variant={filter === 'deleted' ? 'default' : 'outline'}
            className={filter === 'deleted' 
              ? 'bg-blue-600 hover:bg-blue-700' 
              : 'border-gray-600 text-gray-300 hover:bg-gray-700'
            }
            onClick={() => setFilter('deleted')}
          >
            回收站
          </Button>
          <Button 
            size="sm"
            variant={filter === 'all' ? 'default' : 'outline'}
            className={filter === 'all' 
              ? 'bg-blue-600 hover:bg-blue-700' 
              : 'border-gray-600 text-gray-300 hover:bg-gray-700'
            }
            onClick={() => setFilter('all')}
          >
            全部
          </Button>
        </div>
      </div>
      
      <div className="flex-1 overflow-auto py-2">
        {isLoading && (
          <div className="flex justify-center items-center h-full text-gray-400">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            加载中...
          </div>
        )}
        
        {error && (
          <div className="text-center py-4 text-red-400">
            <svg className="w-8 h-8 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p>{error}</p>
          </div>
        )}
        
        {!isLoading && !error && filteredPlans.length === 0 && (
          <div className="text-center py-4 text-gray-400">
            <svg className="w-8 h-8 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <p>没有找到计划</p>
          </div>
        )}
        
        {!isLoading && !error && filteredPlans.map((plan) => (
          <PlanTreeItem 
            key={plan.id}
            item={plan}
            type="plan"
            level={0}
            isActive={selectedId === plan.id && selectedType === 'plan'}
            onSelect={handleSelect}
          />
        ))}
      </div>
      
      {/* 底部操作按钮 */}
      <div className="p-3 border-t border-gray-700">
        <Button 
          className="w-full bg-blue-600 hover:bg-blue-700 text-white"
          onClick={() => window.location.href = '/dashboard'}
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          返回仪表盘
        </Button>
      </div>
    </div>
  );
};

export default PlanTree; 