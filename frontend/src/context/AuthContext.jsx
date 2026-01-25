import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userEmail, setUserEmail] = useState(null);

  /* -------- PERSIST AUTH STATE -------- */
  useEffect(() => {
    const savedAuth = localStorage.getItem("lgc_isAuthenticated");
    const savedEmail = localStorage.getItem("lgc_userEmail");

    if (savedAuth === "true" && savedEmail) {
      setIsAuthenticated(true);
      setUserEmail(savedEmail);
    }
  }, []);
  /* ----------------------------------- */

  /**
   * Login only after backend confirms success
   * Caller must pass fetch response status
   */
  const login = ({ email, success }) => {
    if (!success) return;

    setIsAuthenticated(true);
    setUserEmail(email);

    localStorage.setItem("lgc_isAuthenticated", "true");
    localStorage.setItem("lgc_userEmail", email);
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUserEmail(null);

    localStorage.removeItem("lgc_isAuthenticated");
    localStorage.removeItem("lgc_userEmail");
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        userEmail,
        login,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return context;
}
