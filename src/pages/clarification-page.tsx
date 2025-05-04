import React, { useEffect } from 'react';
import { useParams, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { ClarificationContainer } from '../features/clarification';
import { Language } from '../lib/i18n';
import { toast } from 'sonner';

interface LocationState {
  goalTitle?: string;
  lang?: Language;
}

const ClarificationPage: React.FC = () => {
  const { planId } = useParams<{ planId: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  // Extract goal title from location state if available
  const state = location.state as LocationState;
  const goalTitle = state?.goalTitle;
  const lang = state?.lang || 'en';
  
  // 检查是否有从URL或状态传递过来的目标标题
  useEffect(() => {
    // 如果没有传递 goalTitle，且也没有 planId（编辑现有计划），提示错误并返回首页
    if (!goalTitle && !planId) {
      toast.error('请先输入您要实现的目标');
      navigate('/');
    }
  }, [goalTitle, planId, navigate]);

  // 检查是否开启了模拟模式
  useEffect(() => {
    if (searchParams.get('useMock') === 'true' && process.env.NODE_ENV !== 'production') {
      console.log('已开启模拟 API 模式');
    }
  }, [searchParams]);
  
  // Handle completion - redirect to the plan details
  const handleComplete = (newPlanId: string) => {
    navigate(`/plans/${newPlanId}`);
  };
  
  if (!goalTitle && !planId) {
    return null;
  }
  
  return (
    <div className="container mx-auto py-8">
      <ClarificationContainer 
        goalTitle={goalTitle}
        planId={planId}
        lang={lang}
        onComplete={handleComplete}
      />
    </div>
  );
};

export default ClarificationPage; 