import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  useCallback,
  useRef,
} from 'react';

const AuthContext = createContext(null);
const API_URL = import.meta.env.VITE_API_URL;

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  const tokenRef = useRef('');

  const setAccessToken = (token) => {
    tokenRef.current = token || '';
  };

  const isAuthenticated = !!user?.id;

  const apiRequest = useCallback(async (endpoint, options = {}) => {
    const url = `${API_URL}${endpoint}`;

    const headers = {
      ...(options.body ? { 'Content-Type': 'application/json' } : {}),
      ...(tokenRef.current
        ? { Authorization: `Bearer ${tokenRef.current}` }
        : {}),
      ...(options.headers || {}),
    };

    const res = await fetch(url, {
      ...options,
      credentials: 'include',
      headers,
    });

    if (!res.ok) {
      let body = null;
      try {
        body = await res.json();
      } catch {}
      throw new Error(body?.message || `${endpoint} failed: ${res.status}`);
    }

    try {
      return await res.json();
    } catch {
      return {};
    }
  }, []);

  const refreshPromiseRef = useRef(null);

  const refreshSession = useCallback(() => {
    if (refreshPromiseRef.current) {
      return refreshPromiseRef.current;
    }

    refreshPromiseRef.current = (async () => {
      try {
        const data = await apiRequest('/api/auth/refresh', { method: 'GET' });

        if (data?.user && data?.accessToken) {
          setUser(data.user);
          setAccessToken(data.accessToken);
        } else {
          setUser(null);
          setAccessToken('');
        }
      } catch (err) {
        setUser(null);
        setAccessToken('');
      } finally {
        setLoading(false);
        refreshPromiseRef.current = null;
      }
    })();

    return refreshPromiseRef.current;
  }, [apiRequest]);

  useEffect(() => {
    refreshSession();
  }, [refreshSession]);

  const saveAuth = useCallback((data) => {
    if (!data?.user) {
      setUser(null);
      setAccessToken('');
      return;
    }

    setUser(data.user);
    if (data.accessToken) setAccessToken(data.accessToken);
  }, []);

  const authHeaders = useMemo(
    () =>
      tokenRef.current ? { Authorization: `Bearer ${tokenRef.current}` } : {},
    [tokenRef.current]
  );

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

      if (data?.user?.isActivated && data?.accessToken) {
        saveAuth(data);
        setModalOpen(false);
      } else if (data?.user && data.user.isActivated === false) {
        alert('Account created. Activate via email.');
      }

      return data;
    },
    [apiRequest, saveAuth]
  );

  const logout = useCallback(async () => {
    try {
      await apiRequest('/api/auth/logout', { method: 'POST' });
    } catch {}
    setUser(null);
    setAccessToken('');
  }, [apiRequest]);

  const optimisticUpdateList = useCallback((listName, id, type, action) => {
    setUser((prev) => {
      if (!prev) return prev;
      const current = prev[listName] || [];

      let next = current;
      const idx = current.findIndex((i) => i.id === id && i.type === type);

      if (action === 'add' && idx === -1) next = [...current, { id, type }];
      if (action === 'remove' && idx !== -1)
        next = current.filter((_, i) => i !== idx);

      return { ...prev, [listName]: next };
    });
  }, []);

  const updateWatchlist = useCallback(
    async (movieId, type, action) => {
      const body = { id: Number(movieId), type, action };
      optimisticUpdateList('watchList', body.id, type, action);

      try {
        const data = await apiRequest('/api/user/watchlist', {
          method: 'PUT',
          body: JSON.stringify(body),
        });
        if (data.user) setUser(data.user);
        return data;
      } catch {
        return null;
      }
    },
    [apiRequest, optimisticUpdateList]
  );

  const updateFavorites = useCallback(
    async (movieId, type, action) => {
      const id = Number(movieId);
      optimisticUpdateList('favoriteList', id, type, action);

      try {
        const data = await apiRequest('/api/user/favorite', {
          method: 'PUT',
          body: JSON.stringify({ id, type, action }),
        });

        if (data?.user) {
          setUser(data.user);
        } else if (Array.isArray(data?.favorites)) {
          setUser((prev) =>
            prev ? { ...prev, favoriteList: data.favorites } : prev
          );
        }

        return data;
      } catch {
        return null;
      }
    },
    [apiRequest, optimisticUpdateList]
  );

  const value = useMemo(
    () => ({
      user,
      setUser,
      accessToken: tokenRef.current,
      isAuthenticated,
      authHeaders,
      loading,
      modalOpen,
      setModalOpen,
      watchList: user?.watchList || [],
      favoriteList: user?.favoriteList || [],
      login,
      register,
      logout,
      updateWatchlist,
      updateFavorites,
      addToWatchlist: (id, type) => updateWatchlist(id, type, 'add'),
      removeFromWatchlist: (id, type) => updateWatchlist(id, type, 'remove'),
      addToFavorites: (id, type) => updateFavorites(id, type, 'add'),
      removeFromFavorites: (id, type) => updateFavorites(id, type, 'remove'),
      apiRequest,
    }),
    [
      user,
      isAuthenticated,
      authHeaders,
      loading,
      modalOpen,
      login,
      register,
      logout,
      updateWatchlist,
      updateFavorites,
      apiRequest,
    ]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
