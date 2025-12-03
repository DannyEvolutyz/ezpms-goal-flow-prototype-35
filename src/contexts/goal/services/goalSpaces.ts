
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
  
  // Validate dates
  const startDateObj = new Date(startDate);
  const submissionDeadlineObj = new Date(submissionDeadline);
  const reviewDeadlineObj = new Date(reviewDeadline);
  
  if (submissionDeadlineObj < startDateObj) {
    throw new Error("Submission deadline must be after or equal to start date");
  }
  
  if (reviewDeadlineObj < submissionDeadlineObj) {
    throw new Error("Review deadline must be after or equal to submission deadline");
  }
  
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
  
  // If updating dates, validate them
  if (updatedSpace.startDate && updatedSpace.submissionDeadline) {
    const startDateObj = new Date(updatedSpace.startDate);
    const submissionDeadlineObj = new Date(updatedSpace.submissionDeadline);
    
    if (submissionDeadlineObj < startDateObj) {
      throw new Error("Submission deadline must be after or equal to start date");
    }
  }
  
  if (updatedSpace.submissionDeadline && updatedSpace.reviewDeadline) {
    const submissionDeadlineObj = new Date(updatedSpace.submissionDeadline);
    const reviewDeadlineObj = new Date(updatedSpace.reviewDeadline);
    
    if (reviewDeadlineObj < submissionDeadlineObj) {
      throw new Error("Review deadline must be after or equal to submission deadline");
    }
  }
  
  setSpaces(prev => 
    prev.map(space => 
      space.id === spaceId ? { ...space, ...updatedSpace } : space
    )
  );
  
  return spaces.find(s => s.id === spaceId);
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
  if (!user || user.role !== 'admin') return null;
  
  setSpaces(prev => prev.filter(space => space.id !== spaceId));
  return true;
};

interface GetActiveSpaceParams {
  spaces: GoalSpace[];
}

export const getActiveSpace = ({ spaces }: GetActiveSpaceParams) => {
  const now = new Date();
  return spaces.find(space => 
    space.isActive && 
    new Date(space.startDate) <= now && 
    new Date(space.reviewDeadline) >= now
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
  
  const now = new Date();
  return space.isActive && 
    new Date(space.startDate) <= now && 
    new Date(space.submissionDeadline) >= now;
};

interface CanReviewGoalsParams {
  spaces: GoalSpace[];
  spaceId?: string;
}

export const canReviewGoals = ({ spaces, spaceId }: CanReviewGoalsParams) => {
  if (!spaceId) return false;
  
  const space = spaces.find(s => s.id === spaceId);
  if (!space) return false;
  
  const now = new Date();
  return space.isActive && 
    new Date(space.startDate) <= now && 
    new Date(space.reviewDeadline) >= now;
};

interface GetAvailableSpacesParams {
  spaces: GoalSpace[];
}

export const getAvailableSpaces = ({ spaces }: GetAvailableSpacesParams) => {
  const now = new Date();
  return spaces.filter(space => 
    space.isActive && 
    new Date(space.startDate) <= now && 
    new Date(space.submissionDeadline) >= now
  );
};

interface GetAllSpacesParams {
  spaces: GoalSpace[];
}

export const getAllSpaces = ({ spaces }: GetAllSpacesParams) => {
  return [...spaces].sort((a, b) => 
    // Sort by active status first, then by creation date
    (a.isActive === b.isActive) ? 
      new Date(b.startDate).getTime() - new Date(a.startDate).getTime() :
      a.isActive ? -1 : 1
  );
};

interface GetSpacesForReviewParams {
  spaces: GoalSpace[];
}

export const getSpacesForReview = ({ spaces }: GetSpacesForReviewParams) => {
  const now = new Date();
  return spaces.filter(space => 
    space.isActive && 
    new Date(space.submissionDeadline) <= now && // Submission period is over
    new Date(space.reviewDeadline) >= now // But review period is still active
  );
};

interface IsSpaceReadOnlyParams {
  spaces: GoalSpace[];
  spaceId?: string;
  isAdmin?: boolean;
}

export const isSpaceReadOnly = ({ spaces, spaceId, isAdmin }: IsSpaceReadOnlyParams) => {
  // Admins can always create/edit goals
  if (isAdmin) return false;
  
  if (!spaceId) return true;
  
  const space = spaces.find(s => s.id === spaceId);
  if (!space) return true;
  
  const now = new Date();
  // Read-only if inactive or submission deadline has passed
  return !space.isActive || new Date(space.submissionDeadline) < now;
};
