"use client";

import { createContext, useContext, useEffect, useState } from "react";

import {
  authStorageKeys,
  currentUserRequest,
  loginRequest,
  logoutRequest,
  registerRequest,
  type AuthUser,
  type SignupInput,
} from "@/lib/auth-api";

interface AuthContextType {
  user: AuthUser | null;
  login: (email: string, password: string) => Promise<AuthUser>;
  signup: (input: SignupInput) => Promise<AuthUser>;
  logout: () => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const readStoredUser = (): AuthUser | null => {
  if (typeof window === "undefined") {
    return null;
  }

  const rawUser = window.localStorage.getItem(authStorageKeys.user);
  if (!rawUser) {
    return null;
  }

  try {
    return JSON.parse(rawUser) as AuthUser;
  } catch (error) {
    console.error("Failed to parse stored auth user", error);
    clearSession();
    return null;
  }
};

const persistSession = (user: AuthUser, token: string) => {
  window.localStorage.setItem(authStorageKeys.user, JSON.stringify(user));
  window.localStorage.setItem(authStorageKeys.token, token);
};

const clearSession = () => {
  window.localStorage.removeItem(authStorageKeys.user);
  window.localStorage.removeItem(authStorageKeys.token);
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    const bootstrap = async () => {
      const storedToken = window.localStorage.getItem(authStorageKeys.token);
      const storedUser = readStoredUser();

      if (!storedToken) {
        clearSession();
        if (active) {
          setUser(null);
          setToken(null);
          setIsLoading(false);
        }
        return;
      }

      if (storedUser) {
        setUser(storedUser);
      }

      try {
        const current = await currentUserRequest(storedToken);
        if (!active) return;

        setUser(current);
        setToken(storedToken);
        persistSession(current, storedToken);
      } catch (error) {
        // Silently fail auth restoration - just treat as guest
        clearSession();
        if (active) {
          setUser(null);
          setToken(null);
        }
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    };

    void bootstrap();

    return () => {
      active = false;
    };
  }, []);

  const login = async (email: string, password: string) => {
    const session = await loginRequest({ email, password });
    const current = await currentUserRequest(session.access_token);

    setUser(current);
    setToken(session.access_token);
    persistSession(current, session.access_token);

    return current;
  };

  const signup = async (input: SignupInput) => {
    await registerRequest(input);
    return login(input.email, input.password);
  };

  const logout = async () => {
    if (!token) {
      clearSession();
      setUser(null);
      return;
    }

    try {
      await logoutRequest(token);
    } finally {
      clearSession();
      setUser(null);
      setToken(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, isLoading }}>
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