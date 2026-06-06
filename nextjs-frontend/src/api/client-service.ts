import type {
  ApiResponse,
  ApiResponseError,
  ApiResponseMeta,
  ApiResponseSuccess,
  LoginResponseData,
  UserData,
} from "@/types";
import { client as apiClient } from "./openapi-client/client.gen";
import * as sdk from "./openapi-client/sdk.gen";
import type {
  AuthJwtLoginData,
  RegisterRegisterData,
} from "./openapi-client/types.gen";

// Re-export SDK types if needed
export * from "./openapi-client/types.gen";

function nowMeta(): ApiResponseMeta {
  return { timestamp: new Date().toISOString() };
}

/**
 * Normalize the various shapes the generated SDK might return into the
 * application's ApiResponse<T> union. Handles:
 *  - already-wrapped responses from backend ({ success,message,data,meta })
 *  - SDK "envelope" shapes like { data, error }
 *  - plain axios-like responses containing .data
 *  - thrown SDK/axios errors with .error or .response.data
 */
export async function wrapSdkCall<T>(
  call: Promise<unknown>
): Promise<ApiResponse<T>> {
  try {
    const response = await call;
    const responseStatus =
      response &&
      typeof response === "object" &&
      typeof (response as Record<string, unknown>).status === "number"
        ? (response as Record<string, unknown>).status
        : undefined;

    // 1) If the SDK call already returned our wrapper
    if (response && typeof response === "object" && "success" in response) {
      return response as ApiResponse<T>;
    }

    // 2) Axios-like response: { data, status, headers }
    if (
      response &&
      typeof response === "object" &&
      "data" in (response as Record<string, unknown>)
    ) {
      const respObj = response as Record<string, unknown>;
      const payload = respObj.data as unknown;

      if (payload && typeof payload === "object") {
        const p = payload as Record<string, unknown>;

        // If backend already included `success` inside payload
        if ("success" in p) {
          return {
            ...(payload as ApiResponse<T>),
            status:
              typeof p.status === "number"
                ? p.status
                : responseStatus,
          } as ApiResponse<T>;
        }

        // If backend used {status, message, data, meta}
        if ("status" in p && "data" in p) {
          const status = Number(p.status) || 0;
          const ok = status >= 200 && status < 300;

          if (ok) {
            return {
              status,
              success: true,
              message: (p.message as string) ?? "Operation successful",
              data: p.data as T,
              meta: (p.meta as ApiResponseMeta) ?? nowMeta(),
            } as ApiResponseSuccess<T>;
          }

          return {
            status,
            success: false,
            message: (p.message as string) ?? "Request failed",
            errors: (p.errors as Record<string, string[]>) ?? undefined,
            meta: (p.meta as ApiResponseMeta) ?? {
              ...nowMeta(),
              error_code: "HTTP_ERROR",
            },
          } as ApiResponseError;
        }

        // If payload looks like a plain successful body (no wrapper)
        return {
          status: responseStatus,
          success: true,
          message: "Operation successful",
          data: payload as T,
          meta: nowMeta(),
        } as ApiResponseSuccess<T>;
      }
    }

    // 3) SDK envelope like { data, error }
    if (response && typeof response === "object") {
      const respObj = response as Record<string, unknown>;
      if ("error" in respObj && respObj.error) {
        const err = respObj.error as Record<string, unknown>;
        return {
          status: responseStatus,
          success: false,
          message: (err.message as string) ?? "Request failed",
          errors: (err.errors as Record<string, string[]>) ?? undefined,
          meta: nowMeta(),
        } as ApiResponseError;
      }
      if ("data" in respObj) {
        return {
          status: responseStatus,
          success: true,
          message: "Operation successful",
          data: respObj.data as T,
          meta: nowMeta(),
        } as ApiResponseSuccess<T>;
      }
    }

    // 4) Fallback: treat the raw result as the data payload
    return {
      status: responseStatus,
      success: true,
      message: "Operation successful",
      data: response as T,
      meta: nowMeta(),
    } as ApiResponseSuccess<T>;
  } catch (error) {
    // Normalize thrown errors from axios / SDK
    let message = "Request failed";
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
      status: typeof error === "object" && error && "response" in error && typeof (error as { response?: { status?: number } }).response?.status === "number"
        ? (error as { response?: { status?: number } }).response?.status
        : undefined,
      success: false,
      message,
      errors,
      meta: { ...nowMeta(), error_code },
    } as ApiResponseError;
  }
}

/** Convenience: unwrap a call and throw when unsuccessful */
export async function unwrap<T>(call: Promise<unknown>): Promise<T> {
  const res = await wrapSdkCall<T>(call);
  if (!res.success) throw new Error(res.message);
  return res.data as T;
}

/** Set the global Authorization header for the generated client */
export function setAuthToken(token?: string | null) {
  // `setConfig` merges with existing config in the generated client
  apiClient.setConfig({
    headers: { Authorization: token ? `Bearer ${token}` : null },
  });
}

/** SDK-wrapped helpers */
export const usersCurrentUser = () =>
  wrapSdkCall<UserData>(sdk.usersCurrentUser());
export const authJwtLogout = () => wrapSdkCall<void>(sdk.authJwtLogout());
export const authJwtLogin = (payload: AuthJwtLoginData) =>
  wrapSdkCall<LoginResponseData>(sdk.authJwtLogin(payload));
export const registerRegister = (payload: RegisterRegisterData) =>
  wrapSdkCall<UserData>(sdk.registerRegister(payload));

// Export helpers
export default {
  wrapSdkCall,
  unwrap,
  setAuthToken,
  usersCurrentUser,
  authJwtLogin,
  authJwtLogout,
  registerRegister,
};
