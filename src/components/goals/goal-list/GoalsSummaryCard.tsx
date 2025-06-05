
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface GoalsSummaryCardProps {
  totalWeightage: number;
}

const GoalsSummaryCard: React.FC<GoalsSummaryCardProps> = ({ totalWeightage }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Goals Summary</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Total Weightage:</span>
          <span className={`font-bold text-lg ${totalWeightage === 100 ? 'text-green-600' : 'text-red-600'}`}>
            {totalWeightage}%
          </span>
        </div>
        {totalWeightage !== 100 && (
          <p className="text-sm text-amber-600 mt-2">
            ⚠️ Total weightage should equal 100% before sending goals for approval
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default GoalsSummaryCard;
