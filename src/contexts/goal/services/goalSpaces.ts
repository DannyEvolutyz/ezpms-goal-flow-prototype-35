
import { GoalSpace } from '@/types';
import { Dispatch, SetStateAction } from 'react';

interface CreateGoalSpaceParams {
  name: string;
  description?: string;
  startDate: string;
  submissionDeadline: string;
  reviewDeadline: string;
  spaces: GoalSpace[];
  setSpaces: Dispatch<SetStateAction<GoalSpace[]>>;
  setNotifications: Dispatch<SetStateAction<any[]>>;
  createNotification: (params: any) => void;
  user: any;
}

export const createGoalSpace = ({
  name,
  description,
  startDate,
  submissionDeadline,
  reviewDeadline,
  spaces,
  setSpaces,
  setNotifications,
  createNotification,
  user
}: CreateGoalSpaceParams) => {
  if (!user || user.role !== 'admin') return null;
  
  const newSpace: GoalSpace = {
    id: `space-${Date.now()}`,
    name,
    description,
    startDate,
    submissionDeadline,
    reviewDeadline,
    createdAt: new Date().toISOString(),
    isActive: true
  };
  
  setSpaces(prev => [...prev, newSpace]);
  
  createNotification({
    userId: user.id,
    title: 'Goal Space Created',
    message: `You created a new goal space: ${newSpace.name}`,
    type: 'success',
    setNotifications,
  });
  
  return newSpace;
};

interface UpdateGoalSpaceParams {
  spaceId: string;
  updatedSpace: Partial<GoalSpace>;
  spaces: GoalSpace[];
  setSpaces: Dispatch<SetStateAction<GoalSpace[]>>;
  user: any;
}

export const updateGoalSpace = ({
  spaceId,
  updatedSpace,
  spaces,
  setSpaces,
  user
}: UpdateGoalSpaceParams) => {
  if (!user || user.role !== 'admin') return null;
  
  setSpaces(prev => 
    prev.map(space => 
      space.id === spaceId ? { ...space, ...updatedSpace } : space
    )
  );
};

interface DeleteGoalSpaceParams {
  spaceId: string;
  spaces: GoalSpace[];
  setSpaces: Dispatch<SetStateAction<GoalSpace[]>>;
  user: any;
}

export const deleteGoalSpace = ({
  spaceId,
  spaces,
  setSpaces,
  user
}: DeleteGoalSpaceParams) => {
  if (!user || user.role !== 'admin') return;
  
  setSpaces(prev => prev.filter(space => space.id !== spaceId));
};

interface GetActiveSpaceParams {
  spaces: GoalSpace[];
}

export const getActiveSpace = ({ spaces }: GetActiveSpaceParams) => {
  const now = new Date().toISOString();
  return spaces.find(space => 
    space.isActive && 
    new Date(space.startDate).toISOString() <= now && 
    new Date(space.reviewDeadline).toISOString() >= now
  );
};

interface CanCreateOrEditGoalsParams {
  spaces: GoalSpace[];
  spaceId?: string;
}

export const canCreateOrEditGoals = ({ spaces, spaceId }: CanCreateOrEditGoalsParams) => {
  if (!spaceId) return false;
  
  const space = spaces.find(s => s.id === spaceId);
  if (!space) return false;
  
  const now = new Date().toISOString();
  return space.isActive && 
    new Date(space.startDate).toISOString() <= now && 
    new Date(space.submissionDeadline).toISOString() >= now;
};

interface CanReviewGoalsParams {
  spaces: GoalSpace[];
  spaceId?: string;
}

export const canReviewGoals = ({ spaces, spaceId }: CanReviewGoalsParams) => {
  if (!spaceId) return false;
  
  const space = spaces.find(s => s.id === spaceId);
  if (!space) return false;
  
  const now = new Date().toISOString();
  return space.isActive && 
    new Date(space.startDate).toISOString() <= now && 
    new Date(space.reviewDeadline).toISOString() >= now;
};

interface GetAvailableSpacesParams {
  spaces: GoalSpace[];
}

export const getAvailableSpaces = ({ spaces }: GetAvailableSpacesParams) => {
  const now = new Date().toISOString();
  return spaces.filter(space => 
    space.isActive && 
    new Date(space.startDate).toISOString() <= now && 
    new Date(space.submissionDeadline).toISOString() >= now
  );
};

interface GetAllSpacesParams {
  spaces: GoalSpace[];
}

export const getAllSpaces = ({ spaces }: GetAllSpacesParams) => {
  return [...spaces].sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
};

interface GetSpacesForReviewParams {
  spaces: GoalSpace[];
}

export const getSpacesForReview = ({ spaces }: GetSpacesForReviewParams) => {
  const now = new Date().toISOString();
  return spaces.filter(space => 
    space.isActive && 
    new Date(space.startDate).toISOString() <= now && 
    new Date(space.reviewDeadline).toISOString() >= now
  );
};

interface IsSpaceReadOnlyParams {
  spaces: GoalSpace[];
  spaceId?: string;
}

export const isSpaceReadOnly = ({ spaces, spaceId }: IsSpaceReadOnlyParams) => {
  if (!spaceId) return true;
  
  const space = spaces.find(s => s.id === spaceId);
  if (!space) return true;
  
  const now = new Date().toISOString();
  return !space.isActive || 
    new Date(space.submissionDeadline).toISOString() < now;
};
