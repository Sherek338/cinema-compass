import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext(null);
const API_URL = import.meta.env.VITE_API_URL;

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState("");
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  const isAuthenticated = !!user && !!accessToken;

  const authHeaders = accessToken
    ? { Authorization: `Bearer ${accessToken}` }
    : {};

  const watchList = user?.watchList || [];
  const favoriteList = user?.favoriteList || [];

  const saveAuth = (data) => {
    if (!data) {
      setUser(null);
      setAccessToken("");
      return;
    }
    setUser(data.user);
    setAccessToken(data.accessToken);
  };

  const fetchMe = async () => {
    try {
      const res = await fetch(`${API_URL}/api/auth/refresh`, {
        method: "GET",
        credentials: "include",
      });

      if (!res.ok) {
        setUser(null);
        setAccessToken("");
        return null;
      }

      const data = await res.json();
      saveAuth(data);
      return data;
    } catch {
      setUser(null);
      setAccessToken("");
      return null;
    }
  };

  useEffect(() => {
    (async () => {
      await fetchMe();
      setLoading(false);
    })();
  }, []);

  const login = async (email, password) => {
    const res = await fetch(`${API_URL}/api/auth/login`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => null);
      throw new Error(data?.message || "Login failed");
    }

    const data = await res.json();
    saveAuth(data);
    setModalOpen(false);
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
      const data = await res.json().catch(() => null);
      throw new Error(data?.message || "Registration failed");
    }

    const data = await res.json();
    saveAuth(data);
    setModalOpen(false);
    return data;
  };

  const logout = async () => {
    try {
      await fetch(`${API_URL}/api/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
    } catch {
    } finally {
      setUser(null);
      setAccessToken("");
    }
  };


  const updateWatchlist = async (movieId, action) => {
    const id = Number(movieId);
    if (!id) return;

    const res = await fetch(`${API_URL}/api/user/watchlist`, {
      method: "PUT",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        ...authHeaders,
      },
      body: JSON.stringify({ movieId: id, action }),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => null);
      throw new Error(data?.message || "Failed to update watchlist");
    }

    const data = await res.json();
    const newList = Array.isArray(data?.watchList) ? data.watchList : watchList;

    setUser((prev) =>
      prev ? { ...prev, watchList: newList } : prev
    );
  };

  const updateFavorites = async (movieId, action) => {
    const id = Number(movieId);
    if (!id) return;

    const res = await fetch(`${API_URL}/api/user/favorites`, {
      method: "PUT",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        ...authHeaders,
      },
      body: JSON.stringify({ movieId: id, action }),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => null);
      throw new Error(data?.message || "Failed to update favorites");
    }

    const data = await res.json();
    const newList = Array.isArray(data?.favoriteList)
      ? data.favoriteList
      : favoriteList;

    setUser((prev) =>
      prev ? { ...prev, favoriteList: newList } : prev
    );
  };

  const addToWatchlist = (movieId) => updateWatchlist(movieId, "add");
  const removeFromWatchlist = (movieId) => updateWatchlist(movieId, "remove");
  const addToFavorites = (movieId) => updateFavorites(movieId, "add");
  const removeFromFavorites = (movieId) => updateFavorites(movieId, "remove");

  const value = {
    user,
    accessToken,
    isAuthenticated,
    loading,
    modalOpen,
    setModalOpen,
    authHeaders,
    fetchMe,
    login,
    register,
    logout,
    watchList,
    favoriteList,
    addToWatchlist,
    removeFromWatchlist,
    addToFavorites,
    removeFromFavorites,
    updateWatchlist,
    updateFavorites,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
