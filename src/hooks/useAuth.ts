import { useState, useCallback } from 'react';
import { MockRole, mockUsers, getUserByRole } from '@/data/mock';

// Re-export MockRole as UserType for compatibility
export type UserType = MockRole;

interface MockUser {
  id: string;
  email: string;
}

interface AuthState {
  user: MockUser | null;
  session: { user: MockUser } | null;
  role: UserType | null;
  loading: boolean;
}

// Global state for demo role switching
let currentMockUserId = 'user-buyer-001'; // Default to buyer

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>(() => {
    const mockUser = mockUsers.find(u => u.id === currentMockUserId);
    return {
      user: mockUser ? { id: mockUser.id, email: mockUser.email } : null,
      session: mockUser ? { user: { id: mockUser.id, email: mockUser.email } } : null,
      role: mockUser?.role || null,
      loading: false,
    };
  });

  const setMockUser = useCallback((userId: string) => {
    currentMockUserId = userId;
    const mockUser = mockUsers.find(u => u.id === userId);
    setAuthState({
      user: mockUser ? { id: mockUser.id, email: mockUser.email } : null,
      session: mockUser ? { user: { id: mockUser.id, email: mockUser.email } } : null,
      role: mockUser?.role || null,
      loading: false,
    });
  }, []);

  const setMockRole = useCallback((role: UserType) => {
    const mockUser = getUserByRole(role);
    if (mockUser) {
      currentMockUserId = mockUser.id;
      setAuthState({
        user: { id: mockUser.id, email: mockUser.email },
        session: { user: { id: mockUser.id, email: mockUser.email } },
        role: mockUser.role,
        loading: false,
      });
    }
  }, []);

  // Mock sign in - just sets the user
  const signIn = async (email: string, _password: string) => {
    const mockUser = mockUsers.find(u => u.email === email);
    if (mockUser) {
      setMockUser(mockUser.id);
      return { error: null };
    }
    return { error: { message: 'User not found in mock data' } };
  };

  // Mock sign up - just logs
  const signUp = async (email: string, _password: string, fullName: string, role: UserType) => {
    console.log('[Mock] Sign up:', { email, fullName, role });
    return { data: null, error: null };
  };

  // Mock sign out
  const signOut = async () => {
    setAuthState({
      user: null,
      session: null,
      role: null,
      loading: false,
    });
    return { error: null };
  };

  return {
    ...authState,
    signIn,
    signUp,
    signOut,
    setMockUser,
    setMockRole,
  };
}
