// Minimal clientService shim to satisfy imports while keeping architecture OpenAPI-driven.
// Replace this with generated openapi client adapters when ready.

export type AuthJwtLoginError = any;
export type RegisterRegisterError = any;

export async function usersCurrentUser(_options?: any) {
  return { data: null, error: null };
}

export async function authJwtLogout(_options?: any) {
  return { data: null, error: null };
}

export async function authJwtLogin(_payload: any, _options?: any) {
  return { data: null, error: null };
}

export async function registerRegister(_payload: any, _options?: any) {
  return { data: null, error: null };
}
