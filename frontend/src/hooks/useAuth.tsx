
export function useAuth() {
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");

  const role = localStorage.getItem("userRole");  

  const user = token && userId ? { id: userId, role: role || "User" } : null;

  return { user };
}
