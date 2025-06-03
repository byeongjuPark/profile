'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';

interface AuthContextType {
  isLoggedIn: boolean;
  login: () => void;
  logout: () => void;
  showLoginModal: boolean;
  setShowLoginModal: (show: boolean) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// 실제 애플리케이션에서는 이 비밀번호를 환경 변수로 관리하는 것이 좋습니다.
// 또한 실제 서비스에서는 암호화된 비밀번호를 사용해야 합니다.
const ADMIN_PASSWORD = 'dmswl120';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  
  // Load auth state on mount
  useEffect(() => {
    const storedAuthState = localStorage.getItem('isLoggedIn');
    if (storedAuthState === 'true') {
      setIsLoggedIn(true);
    }
  }, []);
  
  // Save auth state on change
  useEffect(() => {
    localStorage.setItem('isLoggedIn', isLoggedIn.toString());
  }, [isLoggedIn]);
  
  const login = () => setIsLoggedIn(true);
  const logout = () => setIsLoggedIn(false);
  
  const value = {
    isLoggedIn,
    login,
    logout,
    showLoginModal,
    setShowLoginModal
  };
  
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 