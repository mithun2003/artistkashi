"use client";

import { createContext, useContext, useEffect, useState } from "react";

import { unwrap } from "@/api/client-service";
import { setAuthToken } from "@/api/config";
import {
  login as loginSdk,
  logout as logoutSdk,
  me as meSdk,
  register as registerSdk,
  UserCreate,
  UserRead,
} from "@/api/openapi-client";
import {
  getItem,
  getJSON,
  removeItem,
  setItem,
  setJSON,
  STORAGE_KEYS,
} from "@/lib/storage";

interface AuthContextType {
  user: UserRead | null;
  login: (email: string, password: string) => Promise<UserRead>;
  signup: (input: UserCreate) => Promise<UserRead>;
  logout: () => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const readStoredUser = (): UserRead | null => {
  if (typeof window === "undefined") return null;
  return getJSON<UserRead>(STORAGE_KEYS.AUTH_USER);
};

const persistSession = (
  user: UserRead,
  token: string,
  refresh_token: string
) => {
  try {
    setJSON(STORAGE_KEYS.AUTH_USER, user);
    setItem(STORAGE_KEYS.AUTH_TOKEN, token);
    setItem(STORAGE_KEYS.AUTH_REFRESH_TOKEN, refresh_token);
  } catch {
    //ignore
  }
};

const clearSession = () => {
  removeItem(STORAGE_KEYS.AUTH_USER);
  removeItem(STORAGE_KEYS.AUTH_TOKEN);
  removeItem(STORAGE_KEYS.AUTH_REFRESH_TOKEN);
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserRead | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [token, setToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    const bootstrap = async () => {
      const storedToken = getItem(STORAGE_KEYS.AUTH_TOKEN);
      const storedRefreshToken = getItem(STORAGE_KEYS.AUTH_REFRESH_TOKEN);

      if (!storedToken || !storedRefreshToken) {
        clearSession();

        if (active) {
          setUser(null);
          setToken(null);
          setRefreshToken(null);
          setIsLoading(false);
        }

        return;
      }

      const storedUser = readStoredUser();
      if (storedUser) setUser(storedUser);

      try {
        setAuthToken(storedToken);

        const current = await unwrap(meSdk());
        if (!active) return;

        setUser(current);
        setToken(storedToken);
        setRefreshToken(storedRefreshToken);
        persistSession(current, storedToken, storedRefreshToken);
      } catch {
        clearSession();
        if (active) {
          setUser(null);
          setToken(null);
          setRefreshToken(null);
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
    const tokenData = await unwrap(
      loginSdk({ body: { username: email, password } })
    );

    if (!tokenData.access_token || !tokenData.refresh_token)
      throw new Error("Login failed");

    setAuthToken(tokenData.access_token);
    setRefreshToken(tokenData.refresh_token);

    const current = await unwrap(meSdk());
    if (!current) throw new Error("Failed to retrieve user profile");

    setUser(current);
    setToken(tokenData.access_token);
    persistSession(current, tokenData.access_token, tokenData.refresh_token);

    return current;
  };

  const signup = async (input: UserCreate) => {
    await unwrap(
      registerSdk({
        body: input,
      })
    );
    return login(input.email, input.password);
  };

  const logout = async () => {
    if (!token || !refreshToken) {
      clearSession();
      setUser(null);
      return;
    }

    try {
      await logoutSdk({
        body: {
          refresh_token: refreshToken,
        },
      });
    } finally {
      clearSession();
      setUser(null);
      setToken(null);
      setRefreshToken(null);
      setAuthToken(null);
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
