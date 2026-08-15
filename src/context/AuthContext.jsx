import React, { createContext, useContext, useEffect, useState } from "react";
import api from "../utils/api";

const C = createContext(null);
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("chitnova_token");
    if (!token) return setLoading(false);
    api.get("/me").then((r) => setUser(r.data.user)).catch(() => {
      localStorage.removeItem("chitnova_token");
      setUser(null);
    }).finally(() => setLoading(false));
  }, []);

  const login = async (data) => {
    const r = await api.post("/auth/login", data);
    localStorage.setItem("chitnova_token", r.data.token);
    setUser(r.data.user);
    return r.data;
  };

  const register = async (formData) => {
    const r = await api.post("/auth/register", formData);
    localStorage.setItem("chitnova_token", r.data.token);
    setUser(r.data.user);
    return r.data;
  };

  const logout = () => {
    localStorage.removeItem("chitnova_token");
    setUser(null);
  };

  return <C.Provider value={{ user, setUser, login, register, logout, loading }}>{children}</C.Provider>;
}
export const useAuth = () => useContext(C);
