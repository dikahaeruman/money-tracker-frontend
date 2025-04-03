import React, { createContext, useState, useContext, ReactNode, useEffect, useCallback } from 'react';
import { User } from '@/types/User';

interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  loading: boolean;
  refreshUser: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch user function with error handling
  const fetchUser = useCallback(async () => {
    try {
      const response = await fetch('/api/users', { credentials: 'include' });
      const text = await response.text();  // Get raw response text

      console.log('Raw API Response:', text);

      if (response.ok) {
        // Parse JSON only if the response is OK
        const userData = JSON.parse(text);
        console.log('Parsed User Data:', userData);
        setUser(userData.data);  // Assuming response has a 'data' property
      } else {
        console.error('Failed to fetch user, status:', response.status);
        setUser(null);  // Clear user if not OK (e.g., unauthorized)
      }
    } catch (error) {
      console.error('Error fetching user:', error);
      setUser(null);  // Clear user if there's an error
    } finally {
      setLoading(false);  // Stop loading once request is complete
    }
  }, []);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const refreshUser = useCallback(async () => {
    setLoading(true);
    await fetchUser();
  }, [fetchUser]);

  const contextValue = React.useMemo(() => ({
    user,
    setUser,
    loading,
    refreshUser,
  }), [user, loading, refreshUser]);

  return (
    <UserContext.Provider value={contextValue}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};