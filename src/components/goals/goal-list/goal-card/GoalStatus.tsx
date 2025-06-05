
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Lock } from 'lucide-react';
import {
  TooltipProvider,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface GoalStatusProps {
  status: string;
  isLocked: boolean;
}

const GoalStatus: React.FC<GoalStatusProps> = ({ status, isLocked }) => {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'draft':
        return <Badge className="bg-gray-100 text-gray-800">Draft</Badge>;
      case 'pending_approval':
        return <Badge className="bg-yellow-100 text-yellow-800">Pending Approval</Badge>;
      case 'approved':
        return <Badge className="bg-green-100 text-green-800">Approved</Badge>;
      case 'rejected':
        return <Badge className="bg-red-100 text-red-800">Rejected</Badge>;
      case 'submitted':
        return <Badge className="bg-blue-100 text-blue-800">Submitted for Review</Badge>;
      case 'under_review':
        return <Badge className="bg-purple-100 text-purple-800">Under Review</Badge>;
      case 'final_approved':
        return <Badge className="bg-emerald-100 text-emerald-800">Final Approved</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">Draft</Badge>;
    }
  };

  return (
    <div className="flex items-center gap-2">
      {getStatusBadge(status)}
      {isLocked && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <span>
                <Lock className="h-4 w-4 text-green-600" />
              </span>
            </TooltipTrigger>
            <TooltipContent>
              <p>This goal is {status === 'pending_approval' ? 'pending approval' : 'approved'} and cannot be edited</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
    </div>
  );
};

export default GoalStatus;
