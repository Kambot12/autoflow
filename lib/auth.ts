export const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5001";

export type SessionUser = {
  id: string;
  name: string;
  email: string;
  role: "user" | "admin";
  image?: string;
  avatar?: string;
  phone?: string;
};

export const persistSession = (user: SessionUser, token: string) => {
  if (typeof window === "undefined") {
    return;
  }

  const nextUser = {
    ...user,
    avatar:
      user.avatar ||
      user.image ||
      `https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(
        user.name || user.email
      )}`,
    createdAt: new Date().toISOString(),
  };

  const users = JSON.parse(localStorage.getItem("users") || "[]");
  const nextUsers = users.some((entry: SessionUser) => entry.id === nextUser.id)
    ? users.map((entry: SessionUser) =>
        entry.id === nextUser.id ? { ...entry, ...nextUser } : entry
      )
    : [...users, nextUser];

  localStorage.setItem("users", JSON.stringify(nextUsers));
  localStorage.setItem("user", JSON.stringify(nextUser));
  localStorage.setItem("sessionToken", token);
  if (user.role === "admin") {
    localStorage.setItem("adminToken", token);
  }
};

export const getDashboardRoute = (role?: string) =>
  role === "admin" ? "/dashboard/admin" : "/dashboard/user";
