import { useState, useCallback, createContext, useContext } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser]   = useState(() => {
    try { return JSON.parse(localStorage.getItem("fd_user")) || null; } catch { return null; }
  });

  const login = useCallback((u, token) => {
    setUser(u);
    localStorage.setItem("fd_user",  JSON.stringify(u));
    localStorage.setItem("fd_token", token);
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem("fd_user");
    localStorage.removeItem("fd_token");
  }, []);

  return <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
