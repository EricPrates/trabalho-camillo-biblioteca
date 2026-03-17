'use client';
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { getToken, removeToken } from '@/Services/api';
import { IUsuario } from '@/types';

interface AuthContextType {
  isAuthenticated: boolean;
  user: IUsuario | null;
  login: (token: string, userData: IUsuario) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<IUsuario | null>(null);
  const router = useRouter();

  useEffect(() => {
    const token = getToken();
    if (!token) return;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const userData: IUsuario = JSON.parse(payload.user);
      setUser(userData);
      setIsAuthenticated(true);
    } catch {
      removeToken();
    }
  }, []);

  const login = (token: string, userData: IUsuario) => {
    setUser(userData);
    setIsAuthenticated(true);
  };

  const logout = () => {
    removeToken();
    setUser(null);
    setIsAuthenticated(false);
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth deve ser usado dentro de AuthProvider');
  return context;
};
