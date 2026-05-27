/**
 * Authentication API Utilities
 * 
 * Standardized to handle wrapped API responses:
 * { success: boolean, message: string, data: T, meta: { timestamp: string } }
 */

import { 
  ApiResponse, 
  ApiResponseError, 
  UserData, 
  LoginResponseData 
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

export const getApiBaseUrl = () =>
  (process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000").replace(/\/$/, "");

const buildUrl = (path: string) => `/api${path}`;

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
 * Parses error messages from the API response
 */
const parseErrorMessage = async (response: Response): Promise<string> => {
  const contentType = response.headers.get("content-type") ?? "";

  // Handle common HTTP status codes first
  if (response.status === 401) return "Your session has expired. Please log in again.";
  if (response.status === 403) return "You do not have permission to perform this action.";
  if (response.status === 404) return "The requested resource was not found.";
  if (response.status === 429) return "Too many requests. Please try again later.";
  if (response.status >= 500) return "Our gallery server is currently experiencing issues. Please try again soon.";

  if (contentType.includes("application/json")) {
    try {
      const payload = await response.json() as ApiResponse<unknown>;

      // Map technical error codes to user-friendly messages
      const errorMap: Record<string, string> = {
        "LOGIN_BAD_CREDENTIALS": "Incorrect email or password.",
        "REGISTER_USER_ALREADY_EXISTS": "This email is already registered.",
        "LOGIN_USER_NOT_VERIFIED": "Please verify your email address before logging in.",
        "RESET_PASSWORD_BAD_TOKEN": "The password reset link is invalid or has expired.",
        "EMAIL_NOT_FOUND": "No account found with this email address.",
        "USER_NOT_ACTIVE": "This account has been deactivated.",
      };

      if (payload.success === false) {
        if (payload.errors) {
          const messages = Object.values(payload.errors).flat().filter((m) => m.length > 0);
          if (messages.length > 0) return messages[0];
        }
        
        // Check if message is a technical code that needs mapping
        if (payload.message && errorMap[payload.message]) {
          return errorMap[payload.message];
        }
        
        return payload.message || "Something went wrong with your request.";
      }

      // Handle raw FastAPI error structure (detail)
      const raw = payload as any;
      if (raw.detail) {
        if (typeof raw.detail === "string") {
          if (errorMap[raw.detail]) return errorMap[raw.detail];
          return raw.detail;
        }
        if (Array.isArray(raw.detail) && raw.detail.length > 0) {
          return raw.detail[0].msg || "Please check your information and try again.";
        }
      }
    } catch (e) {
      // JSON parsing failed
    }
  }

  return "An unexpected error occurred. Please try again.";
};

/**
 * Generic request function that handles response wrapping
 */
async function requestJson<T>(
  path: string,
  init: RequestInit,
  authorized = false,
  token?: string,
): Promise<T> {
  const headers = new Headers(init.headers);

  if (authorized && token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(buildUrl(path), {
    ...init,
    headers,
  });

  if (!response.ok) {
    throw new Error(await parseErrorMessage(response));
  }

  const responseText = await response.text();
  if (!responseText) {
    return null as T;
  }

  const contentType = response.headers.get("content-type") ?? "";
  if (contentType.includes("application/json")) {
    const payload = JSON.parse(responseText) as ApiResponse<T>;
    
    // If it's in the standardized format, return the data part
    if (payload && typeof payload === 'object' && 'success' in payload) {
      if (payload.success === true) {
        return payload.data;
      }
      throw new Error(payload.message || "Request failed");
    }
    
    // Fallback for non-standardized JSON
    return payload as unknown as T;
  }

  return responseText as unknown as T;
}

const toAuthUser = (user: UserData & { role?: string, is_active?: boolean, is_verified?: boolean }): AuthUser => ({
  id: String(user.id),
  email: user.email,
  name: user.name || user.email.split("@")[0],
  role: normalizeAuthRole(user.role),
  backendRole: user.role,
  isActive: user.is_active,
  isVerified: user.is_verified,
});

export async function loginRequest(input: LoginInput): Promise<LoginResponseData> {
  const body = new URLSearchParams({
    username: input.email,
    password: input.password,
  });

  return requestJson<LoginResponseData>("/auth/jwt/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body,
  });
}

export async function registerRequest(input: SignupInput): Promise<UserData> {
  return requestJson<UserData>("/auth/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: input.email,
      password: input.password,
      full_name: input.fullName,
      role: "user",
    }),
  });
}

export async function currentUserRequest(token: string): Promise<AuthUser> {
  const userData = await requestJson<UserData & { role?: string, is_active?: boolean, is_verified?: boolean }>(
    "/users/me",
    {
      method: "GET",
    },
    true,
    token,
  );

  return toAuthUser(userData);
}

export async function logoutRequest(token: string) {
  await requestJson(
    "/auth/jwt/logout",
    {
      method: "POST",
    },
    true,
    token,
  );
}

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

export const authStorageKeys = {
  token: TOKEN_KEY,
  user: USER_KEY,
} as const;