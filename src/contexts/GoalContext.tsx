
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Goal, GoalBank } from '@/types';
import { useAuth } from './AuthContext';
import { toast } from 'sonner';

// Mock goal templates for the goal bank
const initialGoalBank: GoalBank[] = [
  {
    id: 'template1',
    title: 'Improve Technical Skills in React',
    description: 'Complete an advanced React course and build a sample project showcasing new skills',
    category: 'Technical Skills',
  },
  {
    id: 'template2',
    title: 'Enhance Leadership Abilities',
    description: 'Lead a team project and organize bi-weekly team building activities',
    category: 'Leadership',
  },
  {
    id: 'template3',
    title: 'Professional Development Certification',
    description: 'Obtain a professional certification relevant to current role',
    category: 'Professional Development',
  },
  {
    id: 'template4',
    title: 'Create an Innovative Solution',
    description: 'Develop a new approach or tool to address a business challenge',
    category: 'Innovation',
  },
  {
    id: 'template5',
    title: 'Mentor Junior Teammates',
    description: 'Provide mentorship to at least two junior team members through regular 1:1 sessions',
    category: 'Leadership',
  },
];

// Initial mock goals data - extended with some example goals for the manager dashboard
const initialGoals: Goal[] = [
  {
    id: 'goal-1',
    userId: 'emp-1',
    title: 'Learn Advanced TypeScript',
    description: 'Complete TypeScript certification and apply knowledge in current project',
    category: 'Technical Skills',
    priority: 'high',
    targetDate: '2025-06-30',
    status: 'submitted'
  },
  {
    id: 'goal-2',
    userId: 'emp-2',
    title: 'Improve Team Communication',
    description: 'Implement bi-weekly team sync meetings and create documentation standards',
    category: 'Leadership',
    priority: 'medium',
    targetDate: '2025-05-15',
    status: 'submitted'
  }
];

interface GoalContextType {
  goals: Goal[];
  goalBank: GoalBank[];
  addGoal: (goal: Omit<Goal, 'id' | 'userId' | 'status' | 'feedback'>) => void;
  updateGoal: (goal: Goal) => void;
  submitGoal: (goalId: string) => void;
  approveGoal: (goalId: string) => void;
  rejectGoal: (goalId: string, feedback: string) => void;
  returnGoalForRevision: (goalId: string, feedback: string) => void;
  getGoalsByStatus: (status: Goal['status']) => Goal[];
  getTeamGoals: () => Goal[];
}

const GoalContext = createContext<GoalContextType | undefined>(undefined);

export const GoalProvider = ({ children }: { children: ReactNode }) => {
  const [goals, setGoals] = useState<Goal[]>(initialGoals);
  const [goalBank] = useState<GoalBank[]>(initialGoalBank);
  const { user } = useAuth();

  // Add a new goal (in draft state)
  const addGoal = (goalData: Omit<Goal, 'id' | 'userId' | 'status' | 'feedback'>) => {
    if (!user) return;

    const newGoal: Goal = {
      id: `goal-${Date.now()}`,
      userId: user.id,
      status: 'draft',
      ...goalData,
    };

    setGoals(prevGoals => [...prevGoals, newGoal]);
    toast.success('Goal created successfully');
  };

  // Update an existing goal
  const updateGoal = (updatedGoal: Goal) => {
    setGoals(prevGoals => 
      prevGoals.map(goal => 
        goal.id === updatedGoal.id ? updatedGoal : goal
      )
    );
    toast.success('Goal updated successfully');
  };

  // Submit a goal for review (change status from draft to submitted)
  const submitGoal = (goalId: string) => {
    setGoals(prevGoals => 
      prevGoals.map(goal => 
        goal.id === goalId 
          ? { ...goal, status: 'submitted' } 
          : goal
      )
    );
    toast.success('Goal submitted for approval');
  };

  // Manager: Approve a goal
  const approveGoal = (goalId: string) => {
    setGoals(prevGoals => 
      prevGoals.map(goal => 
        goal.id === goalId 
          ? { ...goal, status: 'approved' } 
          : goal
      )
    );
    toast.success('Goal approved');
  };

  // Manager: Reject a goal with feedback
  const rejectGoal = (goalId: string, feedback: string) => {
    setGoals(prevGoals => 
      prevGoals.map(goal => 
        goal.id === goalId 
          ? { ...goal, status: 'rejected', feedback } 
          : goal
      )
    );
    toast.success('Goal rejected with feedback');
  };

  // Manager: Return a goal for revision with feedback
  const returnGoalForRevision = (goalId: string, feedback: string) => {
    setGoals(prevGoals => 
      prevGoals.map(goal => 
        goal.id === goalId 
          ? { ...goal, status: 'under_review', feedback } 
          : goal
      )
    );
    toast.success('Goal returned for revision');
  };

  // Get goals filtered by status
  const getGoalsByStatus = (status: Goal['status']) => {
    if (!user) return [];
    return goals.filter(goal => goal.userId === user.id && goal.status === status);
  };

  // Get team goals (for managers)
  const getTeamGoals = () => {
    if (!user || user.role !== 'manager') return [];
    // In a real app, this would filter goals by employeeIds who report to this manager
    // For now, we'll return all goals except those belonging to the current user
    return goals.filter(goal => goal.userId !== user.id);
  };

  const value = {
    goals,
    goalBank,
    addGoal,
    updateGoal,
    submitGoal,
    approveGoal,
    rejectGoal,
    returnGoalForRevision,
    getGoalsByStatus,
    getTeamGoals,
  };

  return <GoalContext.Provider value={value}>{children}</GoalContext.Provider>;
};

export const useGoals = () => {
  const context = useContext(GoalContext);
  if (context === undefined) {
    throw new Error('useGoals must be used within a GoalProvider');
  }
  return context;
};
