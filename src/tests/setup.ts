
import '@testing-library/jest-dom';
import { vi, expect, beforeEach } from 'vitest';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: vi.fn((key: string) => {
      return store[key] || null;
    }),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value.toString();
    }),
    removeItem: vi.fn((key: string) => {
      delete store[key];
    }),
    clear: vi.fn(() => {
      store = {};
    }),
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

// Mock for date-fns format function
vi.mock('date-fns', async () => {
  const actual = await vi.importActual('date-fns');
  return {
    ...(actual as any),
    format: vi.fn().mockImplementation((date) => '2025-05-06'),
  };
});

// Reset mocks between tests
beforeEach(() => {
  vi.clearAllMocks();
  localStorageMock.clear();
});

// Global mocks for describe, it and expect are not needed anymore
// as we're using the globals: true option in vitest.config.ts
