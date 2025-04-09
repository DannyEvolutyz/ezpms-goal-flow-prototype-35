
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

// Initial mock goals data
const initialGoals: Goal[] = [];

interface GoalContextType {
  goals: Goal[];
  goalBank: GoalBank[];
  addGoal: (goal: Omit<Goal, 'id' | 'userId' | 'status' | 'feedback'>) => void;
  updateGoal: (goal: Goal) => void;
  submitGoal: (goalId: string) => void;
  getGoalsByStatus: (status: Goal['status']) => Goal[];
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

  // Get goals filtered by status
  const getGoalsByStatus = (status: Goal['status']) => {
    if (!user) return [];
    return goals.filter(goal => goal.userId === user.id && goal.status === status);
  };

  const value = {
    goals,
    goalBank,
    addGoal,
    updateGoal,
    submitGoal,
    getGoalsByStatus,
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
