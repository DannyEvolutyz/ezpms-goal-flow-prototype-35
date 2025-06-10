
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pencil, X } from "lucide-react";
import { GoalBank } from "@/types";

interface GoalBankListProps {
  goalBank: GoalBank[];
  onEdit: (tpl: GoalBank) => void;
  onDelete: (tpl: GoalBank) => void;
}

const GoalBankList: React.FC<GoalBankListProps> = ({
  goalBank,
  onEdit,
  onDelete,
}) => {
  return (
    <div>
      <h3 className="text-lg font-semibold mb-2">Existing Goal Templates</h3>
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
        {goalBank.map(tpl => (
          <Card key={tpl.id}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                {tpl.title}
                <span className="text-xs font-light bg-gray-100 rounded px-2 py-0.5 ml-2">
                  {tpl.category}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-2">{tpl.description}</div>
              <div className="mb-2">
                <span className="font-medium">Target Audience:</span> {tpl.targetAudience}
              </div>
              <div>
                <span className="font-medium">Milestones:</span>
                <ul className="list-decimal ml-6">
                  {(tpl.milestones || []).map((m, i) => (
                    <li key={m.id || i}>{m.title}</li>
                  ))}
                </ul>
              </div>
              <div className="flex gap-2 mt-3">
                <Button variant="outline" size="sm" onClick={() => onEdit(tpl)}>
                  <Pencil className="w-4 h-4 mr-1" /> Edit
                </Button>
                <Button variant="destructive" size="sm" onClick={() => onDelete(tpl)}>
                  <X className="w-4 h-4 mr-1" /> Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default GoalBankList;
