import {
  authJwtLogin as clientAuthJwtLogin,
  authJwtLogout as clientAuthJwtLogout,
  registerRegister as clientRegisterRegister,
  setAuthToken as clientSetAuthToken,
  usersCurrentUser as clientUsersCurrentUser,
} from "@/api/client-service";
import type { UserRead } from "@/api/openapi-client/types.gen";
import { STORAGE_KEYS } from "@/lib/storage";
import type { ApiResponse as AppApiResponse, ApiResponseSuccess } from "@/types";
import type { ApiResponseError } from "@/types";
import type { AxiosError } from "axios";

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
  | ApiResponseError
  | AxiosError
  | unknown;

export const authStorageKeys = STORAGE_KEYS;

const ADMIN_ROLES = new Set(["admin", "instructor"]);

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

type ApiErrorPayload = {
  message?: string;
  errors?: Record<string, string | string[]>;
  meta?: unknown;
  status?: number;
};

type UserReadLike = {
  id?: string | number;
  email: string;
  full_name?: string | null;
  phone?: string | null;
  role?: string | null;
  is_active?: boolean | null;
  is_verified?: boolean | null;
};

export const normalizeAuthRole = (role?: string | null): AuthUser["role"] =>
  role && ADMIN_ROLES.has(role) ? "admin" : "user";

export const getRoleLabel = (user: Pick<AuthUser, "role">) =>
  user.role === "admin" ? "Instructor" : "User";

export const getSafeReturnTo = (returnTo?: string | null): string | null => {
  if (!returnTo?.startsWith("/")) {
    return null;
  }

  if (returnTo.startsWith("/login") || returnTo.startsWith("/signup")) {
    return null;
  }

  try {
    const decoded = decodeURIComponent(returnTo);

    if (/^https?:\/\//i.test(decoded)) {
      return null;
    }
  } catch {
    return null;
  }

  return returnTo;
};

const extractPayload = (
  error: AxiosError<ApiErrorPayload>
): ApiErrorPayload | undefined =>
  error.response?.data ??
  (error as { error?: ApiErrorPayload }).error ??
  (error as { data?: ApiErrorPayload }).data;

export const getAuthErrorMessage = (error: AuthErrorInput): string => {
  if (!error) {
    return "Request failed";
  }

  if (typeof error === "string") {
    return AUTH_ERROR_MESSAGES[error] ?? error;
  }

  if (error instanceof Error) {
    const payload = extractPayload(error as AxiosError<ApiErrorPayload>);

    if (payload?.message) {
      return AUTH_ERROR_MESSAGES[payload.message] ?? payload.message;
    }

    if (payload?.errors) {
      const messages = Object.values(payload.errors)
        .flatMap((value) => (Array.isArray(value) ? value : [value]))
        .map(String);

      if (messages.length) {
        return messages[0];
      }
    }

    if (payload?.meta) {
      return typeof payload.meta === "string"
        ? payload.meta
        : JSON.stringify(payload.meta);
    }

    return error.message;
  }

  const obj = error as Record<string, unknown>;

  const message = obj?.message;

  if (typeof message === "string" && AUTH_ERROR_MESSAGES[message]) {
    return AUTH_ERROR_MESSAGES[message];
  }

  if (typeof message === "string") {
    return message;
  }

  return "Request failed";
};

const safelySetAuthToken = (token: string | null): void => {
  try {
    clientSetAuthToken(token);
  } catch {
    // ignore
  }
};

function assertSuccess<T>(
  response: AppApiResponse<T>
): asserts response is ApiResponseSuccess<T> {
  if (typeof response.status === "number") {
    if (response.status < 200 || response.status >= 300) {
      throw new Error(getAuthErrorMessage(response as ApiResponseError));
    }

    return;
  }

  if (!response.success) {
    throw new Error(getAuthErrorMessage(response as ApiResponseError));
  }
}

const toAuthUser = (user: UserRead | UserReadLike): AuthUser => {
  const u = user as UserReadLike;

  const fallbackName = u.email?.split("@")[0] ?? "User";

  return {
    id: String(u.id ?? ""),
    email: u.email,
    name: u.full_name ?? fallbackName,
    fullName: u.full_name ?? null,
    phone: u.phone ?? null,
    role: normalizeAuthRole(u.role),
    backendRole: u.role ?? null,
    isActive: typeof u.is_active === "boolean" ? u.is_active : undefined,
    isVerified: typeof u.is_verified === "boolean" ? u.is_verified : undefined,
  };
};

export async function loginRequest(input: LoginInput) {
  const response = await clientAuthJwtLogin({
    body: {
      username: input.email,
      password: input.password,
    },
    url: "/api/auth/jwt/login",
  });

  assertSuccess(response);

  return response.data;
}

export async function registerRequest(input: SignupInput) {
  const response = await clientRegisterRegister({
    body: {
      email: input.email,
      password: input.password,
      full_name: input.fullName,
    },
    url: "/api/auth/register",
  });

  assertSuccess(response);

  return response.data;
}

export async function currentUserRequest(token: string): Promise<AuthUser> {
  safelySetAuthToken(token);

  const response = await clientUsersCurrentUser();

  assertSuccess(response);

  return toAuthUser(response.data);
}

export async function logoutRequest(token?: string): Promise<void> {
  safelySetAuthToken(token ?? null);

  try {
    await clientAuthJwtLogout();
  } catch {
    // ignore logout failures
  } finally {
    safelySetAuthToken(null);
  }
}
export { toAuthUser };
