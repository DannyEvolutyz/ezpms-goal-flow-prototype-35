
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '@/types';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock user data for demonstration
const MOCK_USERS: User[] = [
  {
    id: '1',
    name: 'John Employee',
    email: 'employee@example.com',
    role: 'employee',
    managerId: '3'
  },
  {
    id: '2',
    name: 'Jane Employee',
    email: 'jane@example.com',
    role: 'employee',
    managerId: '3'
  },
  {
    id: '3',
    name: 'Mark Manager',
    email: 'manager@example.com',
    role: 'manager'
  }
];

// Mock password map for demonstration (never do this in a real app!)
const MOCK_PASSWORDS: Record<string, string> = {
  'employee@example.com': 'employee123',
  'jane@example.com': 'employee123',
  'manager@example.com': 'manager123'
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  // Check if user is already logged in from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem('ezpms_user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        setIsAuthenticated(true);
      } catch (error) {
        console.error("Failed to parse stored user data:", error);
        localStorage.removeItem('ezpms_user');
      }
    }
  }, []);

  // Login function
  const login = async (email: string, password: string): Promise<boolean> => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // Find user by email
    const foundUser = MOCK_USERS.find(u => u.email === email);
    
    // Check if user exists and password matches
    if (foundUser && MOCK_PASSWORDS[email] === password) {
      setUser(foundUser);
      setIsAuthenticated(true);
      
      // Store user in localStorage (excluding password)
      localStorage.setItem('ezpms_user', JSON.stringify(foundUser));
      return true;
    }
    
    return false;
  };

  // Logout function
  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('ezpms_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
