import React, { useState } from 'react';
import { planApi } from '../../../lib/api';
import { useLanguage } from '../../../lib/language-context';
import { Button } from '../../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';

const ApiTest: React.FC = () => {
  const { t, language } = useLanguage();
  const [result, setResult] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const apiTests = [
    {
      name: t('api.tests.fetchPlans'),
      action: async () => {
        setLoading(true);
        try {
          const plans = await planApi.fetchPlans(language);
          return JSON.stringify(plans, null, 2);
        } catch (error) {
          return `错误: ${error instanceof Error ? error.message : String(error)}`;
        } finally {
          setLoading(false);
        }
      }
    },
    {
      name: t('api.tests.createPlan'),
      action: async () => {
        setLoading(true);
        try {
          const newPlan = await planApi.createPlan({
            title: '测试计划 ' + new Date().toLocaleTimeString(),
            description: '通过API创建的测试计划'
          }, language);
          return JSON.stringify(newPlan, null, 2);
        } catch (error) {
          return `错误: ${error instanceof Error ? error.message : String(error)}`;
        } finally {
          setLoading(false);
        }
      }
    },
    {
      name: t('api.tests.updatePlan'),
      action: async () => {
        setLoading(true);
        try {
          // 先获取计划列表，然后更新第一个计划
          const plans = await planApi.fetchPlans(language);
          if (plans.length === 0) {
            return '没有可更新的计划';
          }
          
          const plan = plans[0];
          const updatedPlan = await planApi.updatePlan(
            plan.id, 
            { progress: Math.min(100, plan.progress + 10) },
            language
          );
          
          return JSON.stringify(updatedPlan, null, 2);
        } catch (error) {
          return `错误: ${error instanceof Error ? error.message : String(error)}`;
        } finally {
          setLoading(false);
        }
      }
    },
    {
      name: t('api.tests.deletePlan'),
      action: async () => {
        setLoading(true);
        try {
          // 先获取计划列表，然后删除最后一个计划
          const plans = await planApi.fetchPlans(language);
          if (plans.length === 0) {
            return '没有可更新的计划';
          }
          
          const plan = plans[plans.length - 1];
          await planApi.deletePlan(plan.id, language);
          
          return `成功删除计划: ${plan.title}`;
        } catch (error) {
          return `错误: ${error instanceof Error ? error.message : String(error)}`;
        } finally {
          setLoading(false);
        }
      }
    }
  ];

  const runTest = async (test: typeof apiTests[0]) => {
    const result = await test.action();
    setResult(result);
  };

  return (
    <Card className="max-w-4xl mx-auto mt-8">
      <CardHeader>
        <CardTitle className="text-xl">{t('api.tests.title')}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4 mb-6">
          {apiTests.map((test, index) => (
            <Button
              key={index}
              variant="outline"
              onClick={() => runTest(test)}
              disabled={loading}
            >
              {test.name}
            </Button>
          ))}
        </div>

        <div className="mt-4">
          <div className="text-sm font-medium mb-2">{t('api.tests.result')}</div>
          <pre className="p-4 bg-gray-50 rounded-md overflow-auto max-h-80 text-xs">
            {loading ? t('api.tests.loading') : result || t('api.tests.clickToTest')}
          </pre>
        </div>
      </CardContent>
    </Card>
  );
};

export default ApiTest; 