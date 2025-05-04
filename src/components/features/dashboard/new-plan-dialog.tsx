import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../../lib/language-context';
import { Button } from '../../../components/ui/button';
import { toast } from 'sonner';
import { usePlanStore } from '../../../lib/store';

// 日志辅助函数
const devLog = (message: string, ...args: any[]) => {
  if (process.env.NODE_ENV !== 'production') {
    console.log(message, ...args);
  }
};

interface NewPlanDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const NewPlanDialog: React.FC<NewPlanDialogProps> = ({ isOpen, onClose }) => {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const [userInput, setUserInput] = useState('');
  const [skipClarification, setSkipClarification] = useState(false);
  const { addPlan } = usePlanStore();
  
  useEffect(() => {
    if (isOpen) {
      // Reset input when dialog opens
      setUserInput('');
      setSkipClarification(false);
      
      // Focus the textarea when dialog opens
      const timer = setTimeout(() => {
        const textArea = document.getElementById('plan-goal-input');
        if (textArea) {
          textArea.focus();
        }
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, [isOpen]);
  
  if (!isOpen) return null;
  
  const handleCancel = () => {
    onClose();
  };
  
  const handleNext = async () => {
    if (!userInput.trim()) return;
    
    if (skipClarification) {
      // 跳过澄清步骤，直接创建计划
      devLog(`[Dialog] Creating plan directly without clarification: ${userInput.trim()}`);
      try {
        const planId = await addPlan({
          title: userInput.trim(),
          description: ''
        }, language);
        
        if (planId) {
          // 创建成功，关闭对话框即可，不需要刷新页面
          // 因为addPlan会自动更新store状态，UI会自动更新
          onClose();
          
          // 提示成功
          toast.success('计划创建成功，已添加到页面');
        } else {
          // 如果返回null，说明创建失败，API已显示错误提示
          toast.error('创建计划失败');
        }
      } catch (error) {
        console.error('创建计划失败:', error);
        toast.error('创建计划失败');
      }
    } else {
      // 正常流程，进入澄清页面
      devLog(`[Dialog] Preparing to navigate to clarification page with goal: ${userInput.trim()}`);
      
      // 获取当前URL中的查询参数，如果有的话保留
      const searchParams = new URLSearchParams(window.location.search);
      
      // 在开发环境下添加 useMock=true 参数
      if (process.env.NODE_ENV !== 'production') {
        // 只有在没有明确设置为false的情况下才设置为true
        if (searchParams.get('useMock') !== 'false') {
          searchParams.set('useMock', 'true');
        }
      }
      
      // 准备搜索参数字符串
      const searchString = searchParams.toString();
      const queryString = searchString ? `?${searchString}` : '';
      
      // Navigate to the clarification page with the goal title as state
      navigate(`/clarify-new${queryString}`, {
        state: {
          goalTitle: userInput.trim(),
          lang: language
        }
      });
    }
    
    // Close the dialog
    onClose();
  };
  
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg m-4 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <h2 className="text-xl font-semibold text-gray-800">
            {t('dashboard.newPlanDialog.title')}
          </h2>
          <button 
            onClick={handleCancel}
            className="rounded-full p-2 hover:bg-gray-100 transition-colors"
            aria-label="Close"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
        
        {/* Body */}
        <div className="p-5">
          <label 
            htmlFor="plan-goal-input" 
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            {t('dashboard.newPlanDialog.inputLabel')}
          </label>
          <textarea
            id="plan-goal-input"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder={t('dashboard.newPlanDialog.placeholder')}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all min-h-[120px] text-base"
            maxLength={200}
            autoFocus
          />
          <div className="mt-1 text-xs text-gray-500 text-right">
            {userInput.length}/200
          </div>
          
          {/* 快速模式选项 */}
          <div className="mt-4 flex items-center">
            <input
              id="skip-clarification"
              type="checkbox"
              checked={skipClarification}
              onChange={(e) => setSkipClarification(e.target.checked)}
              className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
            />
            <label htmlFor="skip-clarification" className="ml-2 block text-sm text-gray-700">
              {t('dashboard.newPlanDialog.quickMode') || '快速模式 (跳过问题澄清步骤)'}
            </label>
          </div>
        </div>
        
        {/* Footer */}
        <div className="flex justify-end items-center px-5 py-4 bg-gray-50 border-t border-gray-100">
          <Button 
            variant="outline"
            className="mr-2"
            onClick={handleCancel}
          >
            {t('dashboard.cancel')}
          </Button>
          <Button 
            type="button"
            disabled={!userInput.trim()}
            className="px-6 bg-indigo-600 hover:bg-indigo-700 rounded-full"
            onClick={handleNext}
          >
            {skipClarification 
              ? (t('dashboard.newPlanDialog.create') || '创建') 
              : t('dashboard.newPlanDialog.next')}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NewPlanDialog; 