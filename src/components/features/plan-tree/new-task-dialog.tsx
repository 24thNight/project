import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '../../ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '../../ui/card';
import { TaskPriority } from '../../../types/task';
import { useLanguage } from '../../../lib/language-context';

interface NewTaskDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (taskData: {
    title: string;
    description: string;
    priority: TaskPriority;
  }) => void;
  planId: string;
  stageId: string;
}

const NewTaskDialog: React.FC<NewTaskDialogProps> = ({
  isOpen,
  onClose,
  onSubmit,
  planId,
  stageId
}) => {
  const { t } = useLanguage();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<TaskPriority>('medium');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      // 验证标题不能为空
      return;
    }
    
    setIsSubmitting(true);
    
    onSubmit({
      title,
      description,
      priority
    });

    // 重置表单
    setTitle('');
    setDescription('');
    setPriority('medium');
    setIsSubmitting(false);
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
      onClick={handleBackdropClick}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.2 }}
        className="w-full max-w-md mx-auto"
      >
        <Card className="border shadow-lg">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">
              {t('task.newTask')}
            </CardTitle>
          </CardHeader>
          
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              {/* 任务标题 */}
              <div className="space-y-2">
                <label htmlFor="task-title" className="block text-sm font-medium text-gray-700">
                  {t('task.title')}*
                </label>
                <input
                  id="task-title"
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                  placeholder={t('task.titlePlaceholder')}
                  aria-label={t('task.title')}
                />
              </div>
              
              {/* 任务描述 */}
              <div className="space-y-2">
                <label htmlFor="task-description" className="block text-sm font-medium text-gray-700">
                  {t('task.description')}
                </label>
                <textarea
                  id="task-description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px]"
                  placeholder={t('task.descriptionPlaceholder')}
                  aria-label={t('task.description')}
                />
              </div>
              
              {/* 优先级选择 */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  {t('task.priority')}
                </label>
                <div className="flex space-x-2">
                  <button
                    type="button"
                    onClick={() => setPriority('low')}
                    className={`flex-1 py-2 px-3 rounded-md border ${
                      priority === 'low'
                        ? 'bg-gray-100 border-gray-400'
                        : 'border-gray-200 hover:bg-gray-50'
                    }`}
                    aria-label={t('task.low')}
                  >
                    {t('task.low')}
                  </button>
                  <button
                    type="button"
                    onClick={() => setPriority('medium')}
                    className={`flex-1 py-2 px-3 rounded-md border ${
                      priority === 'medium'
                        ? 'bg-yellow-100 border-yellow-400'
                        : 'border-gray-200 hover:bg-yellow-50'
                    }`}
                    aria-label={t('task.medium')}
                  >
                    {t('task.medium')}
                  </button>
                  <button
                    type="button"
                    onClick={() => setPriority('high')}
                    className={`flex-1 py-2 px-3 rounded-md border ${
                      priority === 'high'
                        ? 'bg-red-100 border-red-400'
                        : 'border-gray-200 hover:bg-red-50'
                    }`}
                    aria-label={t('task.high')}
                  >
                    {t('task.high')}
                  </button>
                </div>
              </div>
            </CardContent>
            
            <CardFooter className="flex justify-end space-x-2 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isSubmitting}
                aria-label={t('task.cancel')}
              >
                {t('task.cancel')}
              </Button>
              <Button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white"
                disabled={isSubmitting || !title.trim()}
                aria-label={t('task.createTask')}
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {t('task.processing')}
                  </>
                ) : (
                  t('task.createTask')
                )}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </motion.div>
    </div>
  );
};

export default NewTaskDialog; 