
import { Goal } from '@/types';

interface GetGoalsByStatusParams {
  goals: Goal[];
  status: string;
  user: any;
}

export const getGoalsByStatus = ({
  goals,
  status,
  user
}: GetGoalsByStatusParams) => {
  if (!user) return [];
  
  return goals.filter(goal => 
    goal.userId === user.id && goal.status === status
  );
};

interface GetGoalsBySpaceParams {
  goals: Goal[];
  spaceId: string;
  user: any;
}

export const getGoalsBySpace = ({
  goals,
  spaceId,
  user
}: GetGoalsBySpaceParams) => {
  if (!user) return [];
  
  return goals.filter(goal => 
    goal.userId === user.id && goal.spaceId === spaceId
  );
};

interface GetTeamGoalsParams {
  goals: Goal[];
  user: any;
  getAllUsers: () => any[];
}

export const getTeamGoals = ({
  goals,
  user,
  getAllUsers
}: GetTeamGoalsParams) => {
  if (!user || (user.role !== 'manager' && user.role !== 'admin')) return [];
  
  const allUsers = getAllUsers();
  
  if (user.role === 'admin') {
    return goals;
  }
  
  const teamMemberIds = allUsers
    .filter(u => u.managerId === user.id)
    .map(u => u.id);
  
  return goals.filter(goal => teamMemberIds.includes(goal.userId));
};

export const getGoalsForReview = () => {
  return [];
};
