import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useLanguage } from '../lib/language-context';
import { Button } from '../components/ui/button';

interface LocationState {
  taskTitle: string;
  answers: string[];
}

const PlanPage: React.FC = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as LocationState;
  
  // 如果没有正确的状态数据，重定向到首页
  if (!state || !state.taskTitle || !state.answers) {
    setTimeout(() => {
      navigate('/dashboard');
    }, 100);
    return <div className="flex justify-center items-center h-screen">Redirecting...</div>;
  }
  
  const { taskTitle, answers } = state;
  
  const handleBackToDashboard = () => {
    navigate('/dashboard');
  };
  
  return (
    <div className="min-h-screen zen-bg p-4 md:p-6">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6 md:p-8">
        <h1 className="text-xl md:text-2xl font-bold mb-6">您的计划已生成</h1>
        
        <div className="mb-8 p-4 bg-indigo-50 rounded-lg border border-indigo-100">
          <h2 className="text-base md:text-lg font-medium text-indigo-800 mb-2">目标：</h2>
          <p className="text-lg md:text-xl">{taskTitle}</p>
        </div>
        
        <div className="mb-8">
          <h2 className="text-lg font-medium mb-4">您提供的信息：</h2>
          <div className="bg-gray-50 p-4 rounded-lg space-y-3">
            {answers.map((answer, index) => (
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
            返回首页
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PlanPage; 