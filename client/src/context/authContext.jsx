import { createContext, useContext, useEffect, useMemo, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const API_URL = import.meta.env.VITE_API_URL;

  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState("");
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  const isAuthenticated = !!user && !!accessToken;

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${API_URL}/api/auth/refresh`, {
          method: "GET",
          credentials: "include",
        });
        if (!res.ok) throw new Error("Refresh failed");
        const data = await res.json();
        if (!cancelled) {
          setUser(data.user);
          setAccessToken(data.accessToken);
        }
      } catch {
        if (!cancelled) {
          setUser(null);
          setAccessToken("");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    run();
    return () => {
      cancelled = true;
    };
  }, [API_URL]);

  const login = async (email, password) => {
    const res = await fetch(`${API_URL}/api/auth/login`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) {
      const e = await res.json().catch(() => ({}));
      throw new Error(e.message || "Login failed");
    }
    const data = await res.json();
    setUser(data.user);
    setAccessToken(data.accessToken);
    return data;
  };

  const register = async (username, email, password) => {
    const res = await fetch(`${API_URL}/api/auth/registration`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, email, password }),
    });
    if (!res.ok) {
      const e = await res.json().catch(() => ({}));
      throw new Error(e.message || "Registration failed");
    }
    const data = await res.json();
    setUser(data.user);
    setAccessToken(data.accessToken);
    return data;
  };

  const logout = async () => {
    try {
      await fetch(`${API_URL}/api/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
    } catch {}
    setUser(null);
    setAccessToken("");
  };

  const authHeaders = useMemo(() => {
    return accessToken ? { Authorization: `Bearer ${accessToken}` } : {};
  }, [accessToken]);

  const fetchMe = async () => {
    const res = await fetch(`${API_URL}/api/user/me`, {
      method: "GET",
      credentials: "include",
      headers: { ...authHeaders },
    });
    if (!res.ok) throw new Error("Failed to load user");
    return await res.json();
  };

  const value = {
    user,
    setUser,
    isAuthenticated,
    accessToken,
    authHeaders,
    loading,
    modalOpen,
    setModalOpen,
    login,
    register,
    logout,
    fetchMe,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
