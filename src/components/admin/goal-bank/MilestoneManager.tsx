
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, X } from "lucide-react";
import { Milestone } from "@/types";

type MilestoneForm = Omit<Milestone, "id">;

interface MilestoneManagerProps {
  milestones: MilestoneForm[];
  onAddMilestone: () => void;
  onUpdateMilestone: (idx: number, val: Partial<MilestoneForm>) => void;
  onRemoveMilestone: (idx: number) => void;
}

const MilestoneManager: React.FC<MilestoneManagerProps> = ({
  milestones,
  onAddMilestone,
  onUpdateMilestone,
  onRemoveMilestone,
}) => {
  return (
    <div className="mb-2">
      <label className="block text-sm font-semibold">
        Milestones <Plus onClick={onAddMilestone} className="w-5 h-5 ml-2 cursor-pointer text-green-700" />
      </label>
      {milestones.length === 0 && (
        <div className="ml-3 text-gray-500 text-sm">Add at least one milestone</div>
      )}
      {milestones.map((milestone, idx) => (
        <div className="flex items-center gap-2 mb-2 ml-4" key={idx}>
          <Input
            value={milestone.title}
            onChange={e =>
              onUpdateMilestone(idx, { title: e.target.value })
            }
            placeholder={`Milestone #${idx + 1}`}
            className="flex-auto"
            required
          />
          <Button type="button" variant="ghost" size="icon" onClick={() => onRemoveMilestone(idx)}>
            <X className="w-4 h-4" />
          </Button>
        </div>
      ))}
    </div>
  );
};

export default MilestoneManager;
