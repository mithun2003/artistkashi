/**
 * API Client Service
 * 
 * This service acts as an adapter for the generated OpenAPI client,
 * ensuring all responses follow the standardized structure.
 */

import { 
  ApiResponse, 
  UserData, 
  LoginResponseData 
} from "@/types";
import * as sdk from "./openapi-client/sdk.gen";
import { AuthJwtLoginData, RegisterRegisterData } from "./openapi-client/types.gen";

// Re-export SDK types if needed
export * from "./openapi-client/types.gen";

/**
 * Standardized Response Wrapper for SDK calls
 */
async function wrapSdkCall<T>(call: Promise<any>): Promise<ApiResponse<T>> {
  try {
    const response = await call;
    
    // If response already has the standardized structure (from our middleware)
    if (response && typeof response === 'object' && 'success' in response) {
      return response as ApiResponse<T>;
    }

    // Fallback/Safety wrap
    return {
      success: true,
      message: "Operation successful",
      data: response as T,
      meta: { timestamp: new Date().toISOString() }
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "An unexpected error occurred",
      errors: error.errors,
      meta: { 
        timestamp: new Date().toISOString(),
        error_code: error.error_code || "CLIENT_ERROR"
      }
    };
  }
}

export const usersCurrentUser = () => 
  wrapSdkCall<UserData>(sdk.usersCurrentUser());

export const authJwtLogout = () => 
  wrapSdkCall<void>(sdk.authJwtLogout());

export const authJwtLogin = (payload: AuthJwtLoginData) => 
  wrapSdkCall<LoginResponseData>(sdk.authJwtLogin(payload));

export const registerRegister = (payload: RegisterRegisterData) => 
  wrapSdkCall<UserData>(sdk.registerRegister(payload));

// Add other services as needed...
