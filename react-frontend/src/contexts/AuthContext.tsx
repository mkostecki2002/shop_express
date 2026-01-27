import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";
import { jwtDecode } from "jwt-decode";
import { loginUser, logoutUser } from "../api/services";

interface User {
  sub: number;
  role: "ADMIN" | "CUSTOMER";
}

interface AuthContextType {
  user: User | null;
  login: (creds: unknown) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(() => {
    const token = sessionStorage.getItem("accessToken");
    if (token) {
      try {
        return jwtDecode<User>(token);
      } catch {
        sessionStorage.removeItem("accessToken");
        return null;
      }
    }
    return null;
  });

  const login = async (creds: unknown) => {
    const { data } = await loginUser(creds);
    sessionStorage.setItem("accessToken", data.accessToken);
    sessionStorage.setItem("refreshToken", data.refreshToken);
    const decoded = jwtDecode<User>(data.accessToken);
    setUser(decoded);
  };

  const logout = () => {
    logoutUser().finally(() => {
      sessionStorage.removeItem("accessToken");
      sessionStorage.removeItem("refreshToken");
      setUser(null);
    });
  };

  return (
    <AuthContext.Provider
      value={{ user, login, logout, isAuthenticated: !!user }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext)!;
