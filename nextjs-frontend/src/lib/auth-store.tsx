"use client";

import { createContext, useContext, useEffect, useState } from "react";

import {
  currentUserRequest,
  loginRequest,
  logoutRequest,
  registerRequest,
  type AuthUser,
  type SignupInput,
} from "@/api/auth-api";
import { setAuthToken } from "@/api/client-service";
import {
  STORAGE_KEYS,
  getItem,
  getJSON,
  removeItem,
  setItem,
  setJSON
} from "@/lib/storage";

interface AuthContextType {
  user: AuthUser | null;
  login: (email: string, password: string) => Promise<AuthUser>;
  signup: (input: SignupInput) => Promise<AuthUser>;
  logout: () => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const readStoredUser = (): AuthUser | null => {
  if (typeof window === "undefined") return null;
  return getJSON<AuthUser>(STORAGE_KEYS.AUTH_USER);
};

const persistSession = (user: AuthUser, token: string) => {
  try {
    setJSON(STORAGE_KEYS.AUTH_USER, user);
    setItem(STORAGE_KEYS.AUTH_TOKEN, token);
  } catch {
    //ignore

  }
};

const clearSession = () => {
  removeItem(STORAGE_KEYS.AUTH_USER);
  removeItem(STORAGE_KEYS.AUTH_TOKEN);
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    const bootstrap = async () => {
      const storedToken = getItem(STORAGE_KEYS.AUTH_TOKEN);

      if (!storedToken) {
        clearSession();
        if (active) {
          setUser(null);
          setToken(null);
          setIsLoading(false);
        }
        return;
      }

      const storedUser = readStoredUser();
      if (storedUser) setUser(storedUser);

      try {
        try {
          setAuthToken(storedToken);
        } catch {
          setAuthToken();
        }

        const current = await currentUserRequest(storedToken as string);
        if (!active) return;

        setUser(current);
        setToken(storedToken);
        persistSession(current, storedToken);
      } catch {
        clearSession();
        if (active) {
          setUser(null);
          setToken(null);
        }
      } finally {
        if (active) setIsLoading(false);
      }
    };

    void bootstrap();

    return () => {
      active = false;
    };
  }, []);

  const login = async (email: string, password: string) => {
    const session = await loginRequest({ email, password });

    try {
      setAuthToken(session.access_token);
    } catch {
      setAuthToken()
    }

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
