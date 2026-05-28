/**
 * Authentication API Utilities
 * 
 * Refactored to use the centralized OpenAPI client.
 */

import { apiClient } from "./api-client";
import { 
  authJwtLogin, 
  registerRegister, 
  usersCurrentUser, 
  authJwtLogout 
} from "@/api/openapi-client/sdk.gen";
import { 
  type UserRead as UserData,
} from "@/api/openapi-client/types.gen";
import { 
  ApiResponse, 
  ApiResponseError, 
} from "@/types";

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  fullName?: string | null;
  phone?: string | null;
  role: "user" | "admin";
  backendRole?: string | null;
  isActive?: boolean;
  isVerified?: boolean;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface SignupInput {
  fullName: string;
  email: string;
  password: string;
}

export type AuthErrorInput =
  | string
  | Error
  | ApiResponseError;

const TOKEN_KEY = "artistkashi_auth_token";
const USER_KEY = "artistkashi_auth_user";

export const normalizeAuthRole = (role?: string | null): AuthUser["role"] =>
  role === "admin" || role === "instructor" ? "admin" : "user";

export const getRoleLabel = (user: Pick<AuthUser, "role" | "backendRole">) =>
  user.role === "admin" ? "Instructor" : "User";

export const getSafeReturnTo = (returnTo?: string | null) => {
  if (!returnTo || !returnTo.startsWith("/")) {
    return null;
  }
  if (returnTo.startsWith("/login") || returnTo.startsWith("/signup")) {
    return null;
  }
  return returnTo;
};

/**
 * Parses error messages from the API
 */
export const getAuthErrorMessage = (error: AuthErrorInput) => {
  if (typeof error === "string") return error;
  if (error instanceof Error) return error.message;

  if (error.success === false) {
    if (error.errors) {
      const messages = Object.values(error.errors).flat().filter(m => m.length > 0);
      if (messages.length > 0) return messages[0];
    }
    return error.message;
  }

  return "Request failed";
};

const toAuthUser = (user: UserData): AuthUser => ({
  id: String(user.id),
  email: user.email,
  name: user.full_name || user.email.split("@")[0],
  fullName: user.full_name,
  role: normalizeAuthRole(user.role),
  backendRole: user.role,
  isActive: user.is_active,
  isVerified: user.is_verified,
});

export async function loginRequest(input: LoginInput) {
  const { data, error } = await authJwtLogin({
    body: {
      username: input.email,
      password: input.password,
    },
  });

  if (error) {
    throw new Error(getAuthErrorMessage(error as any));
  }

  return data;
}

export async function registerRequest(input: SignupInput) {
  const { data, error } = await registerRegister({
    body: {
      email: input.email,
      password: input.password,
      full_name: input.fullName,
    },
  });

  if (error) {
    throw new Error(getAuthErrorMessage(error as any));
  }

  return data;
}

export async function currentUserRequest(token: string): Promise<AuthUser> {
  const { data, error } = await usersCurrentUser({
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (error) {
    throw new Error(getAuthErrorMessage(error as any));
  }

  return toAuthUser(data as UserData);
}

export async function logoutRequest(token: string) {
  await authJwtLogout({
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export const authStorageKeys = {
  token: TOKEN_KEY,
  user: USER_KEY,
} as const;
