import React, {createContext, useState, useContext, useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {GoogleSignin} from '@react-native-google-signin/google-signin';

interface User {
  id: string;
  name: string;
  email: string;
  studentId?: string;
  photo?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string) => Promise<boolean>;
  logout: () => Promise<void>;
  checkStudentEmail: (email: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Configure Google Sign In
GoogleSignin.configure({
  webClientId: 'YOUR_WEB_CLIENT_ID', // TODO: Replace with actual Google OAuth client ID
});

export const AuthProvider: React.FC<{children: React.ReactNode}> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const userData = await AsyncStorage.getItem('user');
      if (userData) {
        setUser(JSON.parse(userData));
      }
    } catch (error) {
      console.error('Error loading user:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const checkStudentEmail = async (email: string): Promise<boolean> => {
    // TODO: Implement API call to check if email exists in student list
    // This should call Academic Office API
    const validDomains = ['@fpt.edu.vn'];
    const isValidDomain = validDomains.some(domain =>
      email.endsWith(domain),
    );

    // For now, accept any @fpt.edu.vn email
    // In production, this should check against actual student database
    return isValidDomain;
  };

  const login = async (email: string): Promise<boolean> => {
    try {
      const isValid = await checkStudentEmail(email);
      if (!isValid) {
        return false;
      }

      // TODO: Fetch full user data from API
      const userData: User = {
        id: email,
        name: email.split('@')[0],
        email: email,
        studentId: email.split('@')[0], // Temporary
      };

      await AsyncStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      return true;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const logout = async () => {
    try {
      await GoogleSignin.signOut();
      await AsyncStorage.removeItem('user');
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        logout,
        checkStudentEmail,
      }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
