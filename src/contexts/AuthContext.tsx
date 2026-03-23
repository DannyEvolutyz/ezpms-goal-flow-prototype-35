
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '@/types';
import { supabase } from '@/integrations/supabase/client';
import type { Session } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
  getAllUsers: () => User[];
  updateUserManager: (userId: string, managerId: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUserProfile = async (userId: string): Promise<User | null> => {
    try {
      // Fetch profile
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (profileError || !profile) return null;

      // Fetch role
      const { data: roleData } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId)
        .single();

      const role = (roleData?.role as UserRole) || 'member';

      // Fetch team members (users who have this user as manager)
      const { data: teamData } = await supabase
        .from('profiles')
        .select('id')
        .eq('manager_id', userId);

      const teamMembers = teamData?.map(t => t.id) || [];

      return {
        id: profile.id,
        name: profile.name,
        email: profile.email,
        role,
        photoUrl: profile.photo_url || undefined,
        managerId: profile.manager_id || undefined,
        teamMembers,
      };
    } catch (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }
  };

  const fetchAllUsers = async () => {
    try {
      const { data: profiles } = await supabase.from('profiles').select('*');
      const { data: roles } = await supabase.from('user_roles').select('*');

      if (!profiles) return;

      const users: User[] = profiles.map(profile => {
        const userRole = roles?.find(r => r.user_id === profile.id);
        const teamMembers = profiles
          .filter(p => p.manager_id === profile.id)
          .map(p => p.id);

        return {
          id: profile.id,
          name: profile.name,
          email: profile.email,
          role: (userRole?.role as UserRole) || 'member',
          photoUrl: profile.photo_url || undefined,
          managerId: profile.manager_id || undefined,
          teamMembers,
        };
      });

      setAllUsers(users);
    } catch (error) {
      console.error('Error fetching all users:', error);
    }
  };

  // Set up auth state listener BEFORE checking session
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          // Use setTimeout to avoid Supabase auth deadlock
          setTimeout(async () => {
            const profile = await fetchUserProfile(session.user.id);
            if (profile) {
              setUser(profile);
              setIsAuthenticated(true);
              await fetchAllUsers();
            }
            setIsLoading(false);
          }, 0);
        } else {
          setUser(null);
          setIsAuthenticated(false);
          setAllUsers([]);
          setIsLoading(false);
        }
      }
    );

    // Check existing session
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session?.user) {
        const profile = await fetchUserProfile(session.user.id);
        if (profile) {
          setUser(profile);
          setIsAuthenticated(true);
          await fetchAllUsers();
        }
      }
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        console.error('Login error:', error.message);
        return false;
      }
      return true;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setIsAuthenticated(false);
    setAllUsers([]);
  };

  const getAllUsers = () => allUsers;

  const updateUserManager = async (userId: string, managerId: string) => {
    const { error } = await supabase
      .from('profiles')
      .update({ manager_id: managerId })
      .eq('id', userId);

    if (!error) {
      await fetchAllUsers();
      // Refresh current user if affected
      if (user && (user.id === userId || user.id === managerId)) {
        const profile = await fetchUserProfile(user.id);
        if (profile) setUser(profile);
      }
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      login,
      logout,
      isAuthenticated,
      isLoading,
      getAllUsers,
      updateUserManager,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
