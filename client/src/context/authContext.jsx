import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  useCallback,
} from 'react';

const AuthContext = createContext(null);
const API_URL = import.meta.env.VITE_API_URL;

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState('');
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  const isAuthenticated = !!user && !!accessToken;

  const apiRequest = useCallback(async (endpoint, options = {}) => {
    try {
      const response = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          ...(options.headers || {}),
        },
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(
          error.message || `Request failed with status ${response.status}`
        );
      }

      try {
        return await response.json();
      } catch {
        return {};
      }
    } catch (error) {
      console.error(`API Error [${endpoint}]:`, error);
      throw error;
    }
  }, []);

  const saveAuth = useCallback((data) => {
    if (!data || !data.user || !data.accessToken) {
      setUser(null);
      setAccessToken('');
      return;
    }
    setUser(data.user);
    setAccessToken(data.accessToken);
  }, []);

  const authHeaders = useMemo(
    () => (accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
    [accessToken]
  );

  const watchList = user?.watchList || [];
  const favoriteList = user?.favoriteList || [];

  const fetchMe = useCallback(() => {
    if (!fetchMe.currentPromise) {
      fetchMe.currentPromise = (async () => {
        try {
          const data = await apiRequest('/api/auth/refresh', { method: 'GET' });

          if (data?.user && data?.accessToken) {
            saveAuth(data);
            return data;
          }

          saveAuth(null);
          return null;
        } catch {
          saveAuth(null);
          return null;
        } finally {
          fetchMe.currentPromise = null;
        }
      })();
    }

    return fetchMe.currentPromise;
  }, [apiRequest, saveAuth]);
  fetchMe.currentPromise = null;

  useEffect(() => {
    let cancelled = false;

    (async () => {
      setLoading(true);
      const data = await fetchMe();
      if (!cancelled) {
        if (!data) {
          setUser(null);
          setAccessToken('');
        }
        setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [fetchMe]);

  const login = useCallback(
    async (email, password) => {
      const data = await apiRequest('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });

      saveAuth(data);
      setModalOpen(false);
      return data;
    },
    [apiRequest, saveAuth]
  );

  const register = useCallback(
    async (username, email, password) => {
      const data = await apiRequest('/api/auth/registration', {
        method: 'POST',
        body: JSON.stringify({ username, email, password }),
      });

      if (data?.user?.isActivated === false) {
        alert(
          'Registration successful! Please check your email to activate your account.'
        );
        saveAuth(data);
      } else {
        saveAuth(data);
      }

      setModalOpen(false);
      return data;
    },
    [apiRequest, saveAuth]
  );

  const logout = useCallback(async () => {
    try {
      await apiRequest('/api/auth/logout', {
        method: 'POST',
      });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      setAccessToken('');
    }
  }, [apiRequest]);

  const updateWatchlist = useCallback(
    async (movieId, type, action) => {
      const id = Number(movieId);
      if (!id) return null;

      const data = await apiRequest('/api/user/watchlist', {
        method: 'PUT',
        headers: authHeaders,
        body: JSON.stringify({ id, type, action }),
      });

      if (data.user) {
        setUser(data.user);
      } else if (Array.isArray(data.watchList)) {
        setUser((prev) =>
          prev ? { ...prev, watchList: data.watchList } : prev
        );
      }

      return data;
    },
    [apiRequest, authHeaders]
  );

  const updateFavorites = useCallback(
    async (movieId, type, action) => {
      const id = Number(movieId);
      if (!id) return null;

      const data = await apiRequest('/api/user/favorite', {
        method: 'PUT',
        headers: authHeaders,
        body: JSON.stringify({ id, type, action }),
      });

      if (data.user) {
        setUser(data.user);
      } else if (Array.isArray(data.favorites)) {
        setUser((prev) =>
          prev ? { ...prev, favoriteList: data.favorites } : prev
        );
      }

      return data;
    },
    [apiRequest, authHeaders]
  );

  const addToWatchlist = useCallback(
    (movieId, type) => updateWatchlist(movieId, type, 'add'),
    [updateWatchlist]
  );

  const removeFromWatchlist = useCallback(
    (movieId, type) => updateWatchlist(movieId, type, 'remove'),
    [updateWatchlist]
  );

  const addToFavorites = useCallback(
    (movieId, type) => updateFavorites(movieId, type, 'add'),
    [updateFavorites]
  );

  const removeFromFavorites = useCallback(
    (movieId, type) => updateFavorites(movieId, type, 'remove'),
    [updateFavorites]
  );

  const value = useMemo(
    () => ({
      user,
      setUser,
      accessToken,
      isAuthenticated,
      authHeaders,
      loading,
      modalOpen,
      setModalOpen,
      watchList,
      favoriteList,
      login,
      register,
      logout,
      fetchMe,
      updateWatchlist,
      updateFavorites,
      addToWatchlist,
      removeFromWatchlist,
      addToFavorites,
      removeFromFavorites,
      apiRequest,
    }),
    [
      user,
      accessToken,
      isAuthenticated,
      authHeaders,
      loading,
      modalOpen,
      watchList,
      favoriteList,
      login,
      register,
      logout,
      fetchMe,
      updateWatchlist,
      updateFavorites,
      addToWatchlist,
      removeFromWatchlist,
      addToFavorites,
      removeFromFavorites,
      apiRequest,
    ]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return ctx;
}
