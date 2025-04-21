
import { GoalBank } from '@/types';

export const useGoalTemplates = (
  goalBank: GoalBank[],
  setGoalBank: React.Dispatch<React.SetStateAction<GoalBank[]>>
) => {
  const addGoalTemplate = (template: Omit<GoalBank, 'id'>) => {
    const newTemplate: GoalBank = {
      ...template,
      id: `template-${Date.now()}`,
      milestones: template.milestones || []
    };
    setGoalBank(prev => [...prev, newTemplate]);
  };
  
  const updateGoalTemplate = (updatedTemplate: GoalBank) => {
    setGoalBank(prev => 
      prev.map(template => 
        template.id === updatedTemplate.id ? updatedTemplate : template
      )
    );
  };
  
  const deleteGoalTemplate = (templateId: string) => {
    setGoalBank(prev => prev.filter(template => template.id !== templateId));
  };

  return {
    addGoalTemplate,
    updateGoalTemplate,
    deleteGoalTemplate
  };
};
