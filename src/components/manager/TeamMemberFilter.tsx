
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Users } from 'lucide-react';

interface TeamMember {
  id: string;
  name: string;
}

interface TeamMemberFilterProps {
  teamMembers: TeamMember[];
  selectedUserId: string;
  onUserChange: (userId: string) => void;
}

const TeamMemberFilter: React.FC<TeamMemberFilterProps> = ({
  teamMembers,
  selectedUserId,
  onUserChange
}) => {
  return (
    <div className="flex items-center gap-2">
      <label className="text-sm font-medium">Filter by team member:</label>
      <Select value={selectedUserId} onValueChange={onUserChange}>
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder="Select team member" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">View All</SelectItem>
          {teamMembers.map((member) => (
            <SelectItem key={member.id} value={member.id}>
              {member.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default TeamMemberFilter;
