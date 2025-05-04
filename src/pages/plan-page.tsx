import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { useLanguage } from '../lib/language-context';
import { Button } from '../components/ui/button';
import { toast } from 'sonner';

interface LocationState {
  taskTitle: string;
  answers: string[];
}

const PlanPage: React.FC = () => {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const planId = searchParams.get('id');
  
  // 用于模拟计划数据的状态
  const [planData, setPlanData] = useState<{
    title: string;
    answers: string[];
  } | null>(null);
  
  // 从location.state获取数据
  const state = location.state as LocationState;
  
  useEffect(() => {
    console.log('计划页面已加载，planId:', planId);
    console.log('location.state:', state);
    
    // 如果有planId，从服务器获取计划数据
    if (planId) {
      // 这里应该是真实的API调用，现在用模拟数据
      setTimeout(() => {
        setPlanData({
          title: `测试计划 ${planId}`,
          answers: ["问题1的回答", "问题2的回答", "问题3的回答"]
        });
      }, 500);
    } 
    // 如果有state，使用state中的数据
    else if (state && state.taskTitle) {
      setPlanData({
        title: state.taskTitle,
        answers: state.answers
      });
    }
    // 如果两者都没有，返回首页
    else {
      toast.error('无法加载计划数据');
      navigate('/dashboard');
    }
  }, [planId, state, navigate]);
  
  const handleBackToDashboard = () => {
    navigate('/dashboard');
  };
  
  // 如果数据正在加载，显示加载状态
  if (!planData) {
    return (
      <div className="min-h-screen zen-bg flex justify-center items-center">
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <h2 className="text-xl font-semibold mb-4">{t('api.tests.loading')}</h2>
          <div className="flex justify-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: '0ms' }} />
            <div className="w-3 h-3 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: '150ms' }} />
            <div className="w-3 h-3 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: '300ms' }} />
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen zen-bg p-4 md:p-6">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6 md:p-8">
        <h1 className="text-xl md:text-2xl font-bold mb-6">
          {language === 'zh' ? '您的计划已生成' : 'Your Plan is Ready'}
        </h1>
        
        <div className="mb-8 p-4 bg-indigo-50 rounded-lg border border-indigo-100">
          <h2 className="text-base md:text-lg font-medium text-indigo-800 mb-2">
            {language === 'zh' ? '目标：' : 'Goal:'}
          </h2>
          <p className="text-lg md:text-xl">{planData.title}</p>
          {planId && (
            <p className="text-sm text-gray-500 mt-2">Plan ID: {planId}</p>
          )}
        </div>
        
        <div className="mb-8">
          <h2 className="text-lg font-medium mb-4">
            {language === 'zh' ? '您提供的信息：' : 'Your Information:'}
          </h2>
          <div className="bg-gray-50 p-4 rounded-lg space-y-3">
            {planData.answers.map((answer, index) => (
              <div key={index} className="flex">
                <span className="font-medium mr-2">{index + 1}.</span>
                <p>{answer}</p>
              </div>
            ))}
          </div>
        </div>
        
        <div className="flex justify-between">
          <Button 
            variant="outline" 
            onClick={handleBackToDashboard}
          >
            {language === 'zh' ? '返回首页' : 'Back to Dashboard'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PlanPage; 