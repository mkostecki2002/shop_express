import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import { jwtDecode } from "jwt-decode"; // Należy doinstalować: npm install jwt-decode
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
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      try {
        const decoded = jwtDecode<User>(token);
        setUser(decoded);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (e) {
        localStorage.removeItem("accessToken");
      }
    }
  }, []);

  const login = async (creds: unknown) => {
    const { data } = await loginUser(creds);
    localStorage.setItem("accessToken", data.accessToken);
    localStorage.setItem("refreshToken", data.refreshToken);
    const decoded = jwtDecode<User>(data.accessToken);
    setUser(decoded);
  };

  const logout = () => {
    logoutUser().finally(() => {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
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

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext)!;
