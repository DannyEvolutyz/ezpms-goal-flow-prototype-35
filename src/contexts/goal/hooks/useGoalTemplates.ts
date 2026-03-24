
import { GoalBank } from '@/types';
import { supabase } from '@/integrations/supabase/client';

export const useGoalTemplates = (
  goalBank: GoalBank[],
  setGoalBank: React.Dispatch<React.SetStateAction<GoalBank[]>>,
  refetchGoalBank: () => Promise<void>
) => {
  const addGoalTemplate = async (template: Omit<GoalBank, 'id'>) => {
    const { data, error } = await supabase
      .from('goal_bank')
      .insert({
        title: template.title,
        description: template.description,
        category: template.category,
        target_audience: template.targetAudience,
        created_by: template.createdBy || null,
        is_active: template.isActive
      })
      .select()
      .single();
    
    if (error) throw error;
    
    // Insert milestones
    if (template.milestones && template.milestones.length > 0) {
      await supabase.from('goal_bank_milestones').insert(
        template.milestones.map(m => ({
          goal_bank_id: data.id,
          title: m.title,
          description: m.description || null
        }))
      );
    }
    
    // Insert space associations
    if (template.spaceIds && template.spaceIds.length > 0) {
      await supabase.from('goal_bank_spaces').insert(
        template.spaceIds.map(spaceId => ({
          goal_bank_id: data.id,
          goal_space_id: spaceId
        }))
      );
    }
    
    await refetchGoalBank();
  };
  
  const updateGoalTemplate = async (updatedTemplate: GoalBank) => {
    const { error } = await supabase
      .from('goal_bank')
      .update({
        title: updatedTemplate.title,
        description: updatedTemplate.description,
        category: updatedTemplate.category,
        target_audience: updatedTemplate.targetAudience,
        is_active: updatedTemplate.isActive
      })
      .eq('id', updatedTemplate.id);
    
    if (error) throw error;
    
    // Update milestones: delete and re-insert
    await supabase.from('goal_bank_milestones').delete().eq('goal_bank_id', updatedTemplate.id);
    if (updatedTemplate.milestones && updatedTemplate.milestones.length > 0) {
      await supabase.from('goal_bank_milestones').insert(
        updatedTemplate.milestones.map(m => ({
          goal_bank_id: updatedTemplate.id,
          title: m.title,
          description: m.description || null
        }))
      );
    }
    
    // Update space associations
    await supabase.from('goal_bank_spaces').delete().eq('goal_bank_id', updatedTemplate.id);
    if (updatedTemplate.spaceIds && updatedTemplate.spaceIds.length > 0) {
      await supabase.from('goal_bank_spaces').insert(
        updatedTemplate.spaceIds.map(spaceId => ({
          goal_bank_id: updatedTemplate.id,
          goal_space_id: spaceId
        }))
      );
    }
    
    await refetchGoalBank();
  };
  
  const deleteGoalTemplate = async (templateId: string) => {
    await supabase.from('goal_bank_milestones').delete().eq('goal_bank_id', templateId);
    await supabase.from('goal_bank_spaces').delete().eq('goal_bank_id', templateId);
    
    const { error } = await supabase
      .from('goal_bank')
      .delete()
      .eq('id', templateId);
    
    if (error) throw error;
    
    await refetchGoalBank();
  };

  return {
    addGoalTemplate,
    updateGoalTemplate,
    deleteGoalTemplate
  };
};
