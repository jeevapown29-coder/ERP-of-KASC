import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { User, Role } from '../types';

interface AuthContextType {
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
  updateUser: (updatedFields: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('kasc_logged_user');
    return saved ? JSON.parse(saved) : null;
  });

  const login = (newUser: User) => {
    localStorage.setItem('kasc_logged_user', JSON.stringify(newUser));
    setUser(newUser);
  };

  const logout = () => {
    localStorage.removeItem('kasc_logged_user');
    setUser(null);
  };

  const updateUser = (updatedFields: Partial<User>) => {
    if (user) {
      const updated = { ...user, ...updatedFields };
      localStorage.setItem('kasc_logged_user', JSON.stringify(updated));
      setUser(updated);
      
      // Also update in the mock user cache for persistence across logins
      const key = `kasc_profile_${user.id}`;
      localStorage.setItem(key, JSON.stringify(updated));
    }
  };

  // Sync avatar updates if stored in individual profile cache
  useEffect(() => {
    if (user) {
      const key = `kasc_profile_${user.id}`;
      const savedProfile = localStorage.getItem(key);
      if (savedProfile) {
        const parsed = JSON.parse(savedProfile);
        if (parsed.avatar && parsed.avatar !== user.avatar) {
          setUser(prev => prev ? { ...prev, avatar: parsed.avatar } : null);
        }
      }
    }
  }, [user?.id]);

  return (
    <AuthContext.Provider value={{ user, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
