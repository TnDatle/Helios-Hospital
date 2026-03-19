import { createContext, useContext, useEffect, useState } from "react";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/auth/me", {
        credentials: "include",
      });

      if (!res.ok) throw new Error("UNAUTHORIZED");

      const data = await res.json();
      console.log("AUTH ME DATA:", data.data.name);

      setUser(data.data);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  //  CHẠY LÚC APP LOAD
  useEffect(() => {
    refreshUser();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        loading,
        refreshUser, // 👈 EXPORT
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
