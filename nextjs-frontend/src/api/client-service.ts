/**
 * API Client Service
 *
 * This service acts as an adapter for the generated OpenAPI client,
 * ensuring all responses follow the standardized structure.
 */

import {
  ApiResponse,
  ApiResponseSuccess,
  ApiResponseError,
  UserData,
  LoginResponseData,
} from "@/types";
import * as sdk from "./openapi-client/sdk.gen";
import {
  AuthJwtLoginData,
  RegisterRegisterData,
} from "./openapi-client/types.gen";

// Re-export SDK types if needed
export * from "./openapi-client/types.gen";

/**
 * Standardized Response Wrapper for SDK calls
 */
async function wrapSdkCall<T>(call: Promise<unknown>): Promise<ApiResponse<T>> {
  try {
    const response = await call;

    // If response already has the standardized structure (from our middleware)
    if (response && typeof response === "object" && "success" in response) {
      const resp = response as Record<string, unknown>;
      if (resp.success === true) {
        return response as ApiResponseSuccess<T>;
      }
      return response as ApiResponseError;
    }

    // Fallback/Safety wrap
    return {
      success: true,
      message: "Operation successful",
      data: response as T,
      meta: { timestamp: new Date().toISOString() },
    };
  } catch (error: unknown) {
    let message = "An unexpected error occurred";
    let errors: Record<string, string[]> | undefined;
    let error_code = "CLIENT_ERROR";

    if (error && typeof error === "object") {
      const err = error as Record<string, unknown>;
      if (typeof err.message === "string") message = err.message;
      if (typeof err.errors === "object" && err.errors !== null) {
        errors = err.errors as Record<string, string[]>;
      }
      if (typeof err.error_code === "string") error_code = err.error_code;
    }

    return {
      success: false,
      message,
      errors,
      meta: {
        timestamp: new Date().toISOString(),
        error_code,
      },
    };
  }
}

export const usersCurrentUser = () =>
  wrapSdkCall<UserData>(sdk.usersCurrentUser());

export const authJwtLogout = () => wrapSdkCall<void>(sdk.authJwtLogout());

export const authJwtLogin = (payload: AuthJwtLoginData) =>
  wrapSdkCall<LoginResponseData>(sdk.authJwtLogin(payload));

export const registerRegister = (payload: RegisterRegisterData) =>
  wrapSdkCall<UserData>(sdk.registerRegister(payload));

// Add other services as needed...
