"use client";

import React, {createContext, useContext, useEffect, useState} from 'react';
import {useAuth} from '@clerk/clerk-react';

interface User {
  id: string;
  clerk_id: string;
  firstName: string | null;
  lastName: string | null;
  BirthDate: Date | null;
  Gender: boolean | null;
  City: string | null;
  Address: string | null;
  EmailAddress: string;
  Role: "Fan" | "Manager" | "Administrator" | "Guest";
  createdAt: Date | null;
  updatedAt: Date | null;
}

interface UserContextType {
  user: User | null;
  isLoading: boolean;
  error: Error | null;
  refreshUser: () => Promise<void>;
}

const UserContext = createContext<UserContextType>({
  user: null,
  refreshUser: async () => {},
  error: null,
  isLoading: false,
});

export function UserProvider({ children }: { children: React.ReactNode }) {
  const { userId } = useAuth();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchUser = async (clerk_id: string) => {
    try {
      const response = await fetch(`/api/users/${clerk_id}`);
      if (!response.ok) throw new Error('Failed to fetch user');
      const userData = await response.json();
      setUser(userData);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
    } finally {
      setIsLoading(false);
    }
  };

  const refreshUser = async () => {
    if (userId) {
      setIsLoading(true);
      await fetchUser(userId);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchUser(userId);
    } else {
      setUser({
        Address: null,
        BirthDate: null,
        City: null,
        EmailAddress: "",
        Gender: null,
        createdAt: null,
        firstName: null,
        lastName: null,
        updatedAt: null,
        id: "",
        clerk_id: "",
        Role: "Guest"
      });
      setIsLoading(false);
    }
  }, [userId]);

  return (
    <UserContext.Provider value={{ user, isLoading, error, refreshUser }}>
      {children}
    </UserContext.Provider>
  );
}

export const useUser = () => {
  return useContext(UserContext);
};