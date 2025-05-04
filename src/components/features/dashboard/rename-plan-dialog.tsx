import React, { useState } from 'react';
import { useLanguage } from '../../../lib/language-context';
import { usePlanStore } from '../../../lib/store';
import { Button } from '../../../components/ui/button';

interface RenamePlanDialogProps {
  planId: string;
  currentName: string;
  isOpen: boolean;
  onClose: () => void;
}

const RenamePlanDialog: React.FC<RenamePlanDialogProps> = ({
  planId,
  currentName,
  isOpen,
  onClose
}) => {
  const { t } = useLanguage();
  const { renamePlan } = usePlanStore();
  const [newName, setNewName] = useState(currentName);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newName.trim()) {
      renamePlan(planId, newName.trim());
      onClose();
    }
  };

  const handleCancel = () => {
    setNewName(currentName);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 m-4">
        <h3 className="text-lg font-medium mb-4">{t('dashboard.renamePlan')}</h3>
        
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder={t('dashboard.planNamePlaceholder')}
            className="w-full px-3 py-2 border rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-sky-500"
            autoFocus
          />
          
          <div className="flex justify-end space-x-2">
            <Button 
              type="button" 
              variant="outline" 
              onClick={handleCancel}
            >
              {t('dashboard.cancel')}
            </Button>
            <Button 
              type="submit"
              disabled={!newName.trim() || newName === currentName}
            >
              {t('dashboard.save')}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RenamePlanDialog; 