import { createContext, ReactNode, useContext } from "react";
import { adminAuth } from "@/services/api";

interface AuthContextType {
  isLoggedIn: boolean;
  userId: string | null;
  isSuperAdmin: boolean;
  roleLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  isLoggedIn: false,
  userId: null,
  isSuperAdmin: false,
  roleLoading: false,
  login: async () => false,
  logout: () => {},
});

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const login = async (email: string, password: string) => {
    try {
      await adminAuth.login(email, password);
      return true;
    } catch {
      return false;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn: adminAuth.isLoggedIn(),
        userId: null,
        isSuperAdmin: false,
        roleLoading: false,
        login,
        logout: adminAuth.logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
