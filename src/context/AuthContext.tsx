import React, { createContext, useContext } from "react";
import { useUser, useAuth as useClerkAuth } from '@clerk/clerk-react';

interface User {
  id: string;
  name: string;
  email: string;
  company: string;
  contractorId: string;
  isAdmin: boolean;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (
    userData: Omit<User, "id" | "isAdmin"> & { password: string }
  ) => Promise<boolean>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { user: clerkUser, isLoaded } = useUser();
  const { signOut } = useClerkAuth();

  // Transform Clerk user to our User interface
  const user: User | null = clerkUser ? {
    id: clerkUser.id,
    name: clerkUser.fullName || clerkUser.firstName || 'User',
    email: clerkUser.primaryEmailAddress?.emailAddress || '',
    company: clerkUser.publicMetadata?.company as string || 'Unknown Company',
    contractorId: clerkUser.publicMetadata?.contractorId as string || 'N/A',
    isAdmin: clerkUser.publicMetadata?.isAdmin as boolean || false,
    avatar: clerkUser.imageUrl
  } : null;

  const login = async (email: string, password: string): Promise<boolean> => {
    // Clerk handles authentication through its components
    // This is kept for interface compatibility
    return true;
  };

  const register = async (
    userData: Omit<User, "id" | "isAdmin"> & { password: string }
  ): Promise<boolean> => {
    // Clerk handles registration through its components
    // This is kept for interface compatibility
    return true;
  };

  const logout = () => {
    signOut();
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      register, 
      logout, 
      loading: !isLoaded 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}