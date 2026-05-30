/**
 * Authentication API Utilities
 *
 * Refactored to use the centralized OpenAPI client.
 */

import {
  authJwtLogin,
  registerRegister,
  usersCurrentUser,
  authJwtLogout,
} from "@/api/openapi-client/sdk.gen";
import { type UserRead as UserData } from "@/api/openapi-client/types.gen";
import { ApiResponseError } from "@/types";

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

export type AuthErrorInput = string | Error | ApiResponseError;

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
 * Human-readable mapping for backend error codes
 */
const AUTH_ERROR_MESSAGES: Record<string, string> = {
  LOGIN_BAD_CREDENTIALS: "Incorrect email or password. Please try again.",
  REGISTER_USER_ALREADY_EXISTS: "An account with this email already exists.",
  LOGIN_USER_NOT_VERIFIED:
    "Please verify your email address before logging in.",
  RESET_PASSWORD_BAD_TOKEN: "Password reset link is invalid or has expired.",
  VERIFY_USER_BAD_TOKEN: "Verification link is invalid or has expired.",
  PASSWORD_TOO_SHORT: "Password must be at least 8 characters long.",
  PASSWORD_TOO_COMMON:
    "This password is too common. Please choose a stronger one.",
};

/**
 * Parses error messages from the API
 */
export const getAuthErrorMessage = (error: unknown): string => {
  if (typeof error === "string") return AUTH_ERROR_MESSAGES[error] || error;
  if (error instanceof Error) return error.message;

  // Handle OpenAPI client error structure
  if (error && typeof error === "object") {
    const err = error as Record<string, unknown>;

    // Check for our custom ApiResponseError structure
    if (err.success === false) {
      const message = err.message as string | undefined;
      if (message && AUTH_ERROR_MESSAGES[message]) {
        return AUTH_ERROR_MESSAGES[message];
      }

      const errors = err.errors as Record<string, string[]> | undefined;
      if (errors) {
        const messages = Object.values(errors)
          .flat()
          .filter((m): m is string => typeof m === "string" && m.length > 0);
        if (messages.length > 0) return messages[0];
      }
      return String(message || "Request failed");
    }

    // Check for FastAPI ErrorModel (detail field)
    const detail = err.detail;
    if (detail) {
      if (typeof detail === "string") {
        return AUTH_ERROR_MESSAGES[detail] || detail;
      }
      if (typeof detail === "object" && detail !== null) {
        const firstError = Object.values(detail)[0];
        if (typeof firstError === "string") return firstError;
      }
    }
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
    throw new Error(getAuthErrorMessage(error));
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
    throw new Error(getAuthErrorMessage(error));
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
    throw new Error(getAuthErrorMessage(error));
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
