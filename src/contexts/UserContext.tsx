import React, { createContext, useState, useContext, ReactNode, useMemo } from 'react';

interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
}

interface User {
  email: string;
  id: string;
  username: string;
  createdAt: Date;
  updatedAt: Date;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  const contextValue = useMemo(() => ({ user, setUser }), [user]);

  return (
    <UserContext.Provider value={contextValue}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
    const context = useContext(UserContext);
    if (context === undefined) {
      throw new Error('useUser must be used within a UserProvider');
    }
    return context;
};