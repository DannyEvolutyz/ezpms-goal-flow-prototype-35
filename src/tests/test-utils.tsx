import React from 'react';
import { render as rtlRender } from '@testing-library/react';
import '@testing-library/jest-dom';
import { GoalProvider } from '../contexts/goal/GoalProviderImpl';
import { AuthProvider } from '../contexts/AuthContext';
import { vi } from 'vitest';

// Mock AuthContext values
export const mockAuthContextValues = {
  user: {
    id: 'user-1',
    name: 'Test User',
    email: 'test@example.com',
    role: 'member',
  },
  login: vi.fn(),
  logout: vi.fn(),
  register: vi.fn(),
  isAuthenticated: true,
  isLoading: false,
  error: null,
  getAllUsers: vi.fn().mockReturnValue([
    {
      id: 'user-1',
      name: 'Test User',
      email: 'test@example.com',
      role: 'member',
      managerId: 'manager-1',
    },
    {
      id: 'manager-1',
      name: 'Test Manager',
      email: 'manager@example.com',
      role: 'manager',
    },
    {
      id: 'admin-1',
      name: 'Test Admin',
      email: 'admin@example.com',
      role: 'admin',
    },
  ]),
};

// Custom render function that includes providers
function render(ui, options = {}) {
  const Wrapper = ({ children }) => (
    <AuthProvider>
      <GoalProvider>{children}</GoalProvider>
    </AuthProvider>
  );
  
  return rtlRender(ui, { wrapper: Wrapper, ...options });
}

// Re-export everything from React Testing Library
export * from '@testing-library/react';
export { render };
