import { UserRead } from "@/api/openapi-client";

export const getRoleLabel = (user: Pick<UserRead, "role">) =>
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
