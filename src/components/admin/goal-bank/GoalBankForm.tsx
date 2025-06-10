
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { GoalBank, Milestone } from "@/types";
import MilestoneManager from "./MilestoneManager";

type GoalBankForm = Omit<GoalBank, "id" | "milestones"> & {
  milestones: Omit<Milestone, "id">[]
};

interface GoalBankFormProps {
  form: GoalBankForm;
  editing: GoalBank | null;
  onFormChange: (field: keyof GoalBankForm, value: any) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  onAddMilestone: () => void;
  onUpdateMilestone: (idx: number, val: Partial<Omit<Milestone, 'id'>>) => void;
  onRemoveMilestone: (idx: number) => void;
}

const GoalBankFormComponent: React.FC<GoalBankFormProps> = ({
  form,
  editing,
  onFormChange,
  onSubmit,
  onCancel,
  onAddMilestone,
  onUpdateMilestone,
  onRemoveMilestone,
}) => {
  return (
    <form className="bg-gray-50 p-4 rounded-md mb-10 shadow" onSubmit={onSubmit}>
      <div className="mb-2">
        <label className="block text-sm font-semibold">Title</label>
        <Input 
          value={form.title} 
          onChange={e => onFormChange('title', e.target.value)} 
          required 
        />
      </div>
      <div className="mb-2">
        <label className="block text-sm font-semibold">Description</label>
        <Textarea 
          value={form.description} 
          onChange={e => onFormChange('description', e.target.value)} 
        />
      </div>
      <div className="mb-2">
        <label className="block text-sm font-semibold">Category</label>
        <Input 
          value={form.category} 
          onChange={e => onFormChange('category', e.target.value)} 
          required 
          placeholder="E.g., Software Engineering, QA" 
        />
      </div>
      <div className="mb-2">
        <label className="block text-sm font-semibold">Target Audience</label>
        <Input 
          value={form.targetAudience} 
          onChange={e => onFormChange('targetAudience', e.target.value)} 
          required 
          placeholder="E.g., All, Managers, Developers" 
        />
      </div>
      <MilestoneManager
        milestones={form.milestones}
        onAddMilestone={onAddMilestone}
        onUpdateMilestone={onUpdateMilestone}
        onRemoveMilestone={onRemoveMilestone}
      />
      <div className="flex gap-2 mt-4">
        <Button type="submit" variant="default">
          {editing ? "Update" : "Add"} Goal Template
        </Button>
        {editing && (
          <Button type="button" variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
};

export default GoalBankFormComponent;
