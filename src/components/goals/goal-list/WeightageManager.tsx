
import React, { useState } from 'react';
import { Goal } from '@/types';
import { useGoals } from '@/contexts/GoalContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from "@/hooks/use-toast";

interface WeightageManagerProps {
  goals: Goal[];
  spaceId: string;
  isReadOnly: boolean;
}

const WeightageManager: React.FC<WeightageManagerProps> = ({ goals, spaceId, isReadOnly }) => {
  const { updateGoal } = useGoals();
  const [weightages, setWeightages] = useState<Record<string, number>>(
    goals.reduce((acc, goal) => ({ ...acc, [goal.id]: goal.weightage }), {})
  );

  const totalWeightage = Object.values(weightages).reduce((sum, weight) => sum + (weight || 0), 0);
  const isValidTotal = totalWeightage === 100;

  const handleWeightageChange = (goalId: string, value: string) => {
    const numValue = parseInt(value) || 0;
    setWeightages(prev => ({ ...prev, [goalId]: numValue }));
  };

  const handleSaveWeightages = () => {
    if (!isValidTotal) {
      toast({
        title: "Invalid Weightage",
        description: "Total weightage must equal 100%",
        variant: "destructive"
      });
      return;
    }

    goals.forEach(goal => {
      const newWeightage = weightages[goal.id] || 0;
      if (goal.weightage !== newWeightage) {
        updateGoal({
          ...goal,
          weightage: newWeightage
        });
      }
    });

    toast({
      title: "Weightages Updated",
      description: "Goal weightages have been saved successfully.",
    });
  };

  if (goals.length === 0 || isReadOnly) {
    return null;
  }

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="text-lg">Manage Goal Weightages</CardTitle>
        <p className="text-sm text-muted-foreground">
          Assign weightages to your goals. Total must equal 100%.
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {goals.map(goal => (
            <div key={goal.id} className="flex items-center justify-between gap-4">
              <div className="flex-1">
                <Label className="text-sm font-medium">{goal.title}</Label>
              </div>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  min="0"
                  max="100"
                  value={weightages[goal.id] || 0}
                  onChange={(e) => handleWeightageChange(goal.id, e.target.value)}
                  className="w-20"
                />
                <span className="text-sm text-muted-foreground">%</span>
              </div>
            </div>
          ))}
          
          <div className="border-t pt-4">
            <div className="flex items-center justify-between">
              <span className="font-medium">Total:</span>
              <span className={`font-bold ${isValidTotal ? 'text-green-600' : 'text-red-600'}`}>
                {totalWeightage}%
              </span>
            </div>
            
            <Button 
              onClick={handleSaveWeightages}
              disabled={!isValidTotal}
              className="w-full mt-4"
            >
              Save Weightages
            </Button>
            
            {!isValidTotal && (
              <p className="text-sm text-red-600 text-center mt-2">
                Total weightage must equal 100%
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WeightageManager;
