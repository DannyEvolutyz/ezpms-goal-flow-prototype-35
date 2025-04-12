
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '@/types';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  getAllUsers: () => User[];
  updateUserManager: (userId: string, managerId: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock user data with the defined organizational structure
const MOCK_USERS: User[] = [
  // Admin
  {
    id: 'admin-1',
    name: 'Admin User',
    email: 'admin@ezdanny.com',
    role: 'admin',
    teamMembers: ['manager-1', 'manager-2']
  },
  
  // Managers
  {
    id: 'manager-1',
    name: 'Darahas',
    email: 'darahas@ezdanny.com',
    role: 'manager',
    managerId: 'admin-1',
    teamMembers: ['member-1', 'member-2', 'member-3']
  },
  {
    id: 'manager-2',
    name: 'Ashok',
    email: 'ashok@ezdanny.com',
    role: 'manager',
    managerId: 'admin-1',
    teamMembers: ['member-4', 'member-5', 'member-6']
  },
  
  // Team members reporting to Darahas
  {
    id: 'member-1',
    name: 'Hema',
    email: 'hema@ezdanny.com',
    role: 'member',
    managerId: 'manager-1'
  },
  {
    id: 'member-2',
    name: 'Babloo',
    email: 'babloo@ezdanny.com',
    role: 'member',
    managerId: 'manager-1'
  },
  {
    id: 'member-3',
    name: 'Chitti Naidu',
    email: 'chitti@ezdanny.com',
    role: 'member',
    managerId: 'manager-1'
  },
  
  // Team members reporting to Ashok
  {
    id: 'member-4',
    name: 'Tarun',
    email: 'tarun@ezdanny.com',
    role: 'member',
    managerId: 'manager-2'
  },
  {
    id: 'member-5',
    name: 'Rishi',
    email: 'rishi@ezdanny.com',
    role: 'member',
    managerId: 'manager-2'
  },
  {
    id: 'member-6',
    name: 'Babu Garu',
    email: 'babu@ezdanny.com',
    role: 'member',
    managerId: 'manager-2'
  }
];

// Mock password map for demonstration (never do this in a real app!)
const MOCK_PASSWORDS: Record<string, string> = {
  'admin@ezdanny.com': 'password123',
  'darahas@ezdanny.com': 'password123',
  'ashok@ezdanny.com': 'password123',
  'hema@ezdanny.com': 'password123',
  'babloo@ezdanny.com': 'password123',
  'chitti@ezdanny.com': 'password123',
  'tarun@ezdanny.com': 'password123',
  'rishi@ezdanny.com': 'password123',
  'babu@ezdanny.com': 'password123'
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [users, setUsers] = useState<User[]>(MOCK_USERS);

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
    const foundUser = users.find(u => u.email === email);
    
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

  // Get all users
  const getAllUsers = () => {
    return users;
  };

  // Update a user's manager
  const updateUserManager = (userId: string, managerId: string) => {
    setUsers(prevUsers => {
      const updatedUsers = prevUsers.map(u => {
        // Update the user with the new managerId
        if (u.id === userId) {
          return { ...u, managerId };
        }
        
        // Remove user from old manager's team
        if (u.teamMembers?.includes(userId)) {
          return {
            ...u,
            teamMembers: u.teamMembers.filter(id => id !== userId)
          };
        }
        
        // Add user to new manager's team
        if (u.id === managerId) {
          return {
            ...u,
            teamMembers: [...(u.teamMembers || []), userId]
          };
        }
        
        return u;
      });
      
      return updatedUsers;
    });
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      logout, 
      isAuthenticated, 
      getAllUsers,
      updateUserManager
    }}>
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
