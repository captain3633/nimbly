import React, { createContext, useContext, useState, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import { api } from '@/lib/api';

interface AuthContextType {
  user: { email: string; userId: string } | null;
  token: string | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<{ email: string; userId: string } | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStoredAuth();
  }, []);

  const loadStoredAuth = async () => {
    try {
      const storedToken = await SecureStore.getItemAsync('auth_token');
      const storedEmail = await SecureStore.getItemAsync('user_email');
      const storedUserId = await SecureStore.getItemAsync('user_id');

      if (storedToken && storedEmail && storedUserId) {
        setToken(storedToken);
        setUser({ email: storedEmail, userId: storedUserId });
      }
    } catch (error) {
      console.error('Failed to load stored auth:', error);
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    const response = await api.auth.signIn(email, password);
    
    await SecureStore.setItemAsync('auth_token', response.session_token);
    await SecureStore.setItemAsync('user_email', response.email);
    await SecureStore.setItemAsync('user_id', response.user_id);

    setToken(response.session_token);
    setUser({ email: response.email, userId: response.user_id });
  };

  const signUp = async (email: string, password: string) => {
    const response = await api.auth.signUp(email, password);
    
    await SecureStore.setItemAsync('auth_token', response.session_token);
    await SecureStore.setItemAsync('user_email', response.email);
    await SecureStore.setItemAsync('user_id', response.user_id);

    setToken(response.session_token);
    setUser({ email: response.email, userId: response.user_id });
  };

  const signOut = async () => {
    await SecureStore.deleteItemAsync('auth_token');
    await SecureStore.deleteItemAsync('user_email');
    await SecureStore.deleteItemAsync('user_id');

    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, signIn, signUp, signOut }}>
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
