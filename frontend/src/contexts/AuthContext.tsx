
import { createContext, useContext, useState, useEffect,type ReactNode } from 'react';
import { type User, type AuthContextType } from '../types/index.ts';
import { authService } from '../services/authService.ts';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const token = localStorage.getItem('token');
      const userData = localStorage.getItem('user');
      
      if (token && userData) {
        const parsedUser = JSON.parse(userData);
        // Créer un nouvel objet pour éviter les références cross-origin
        setUser({
          id: parsedUser.id,
          email: parsedUser.email,
          name: parsedUser.name,
          role: parsedUser.role
        });
      }
    } catch {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    const response = await authService.login(email, password);
    const { token, user: userData } = response.data;
    
    // Créer un objet propre sans références externes
    const cleanUser = {
      id: userData.id,
      email: userData.email,
      name: userData.name,
      role: userData.role
    };
    
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(cleanUser));
    setUser(cleanUser);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
