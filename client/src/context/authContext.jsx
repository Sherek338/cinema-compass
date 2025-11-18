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

  const apiRequest = useCallback(async (endpoint, options = {}) => {
    const url = `${API_URL}${endpoint}`;

    try {
      const res = await fetch(url, {
        ...options,
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          ...(options.headers || {}),
        },
      });

      if (!res.ok) {
        let errBody = null;
        try {
          errBody = await res.json();
        } catch {
        }
        const msg =
          errBody?.message ||
          `Request to ${endpoint} failed with status ${res.status}`;
        throw new Error(msg);
      }

      try {
        return await res.json();
      } catch {
        return {};
      }
    } catch (err) {
      console.error(`API error [${endpoint}]`, err);
      throw err;
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
    () =>
      accessToken
        ? {
          Authorization: `Bearer ${accessToken}`,
        }
        : {},
    [accessToken],
  );

  const isAuthenticated = !!user?.id;

  const watchList = user?.watchList || [];
  const favoriteList = user?.favoriteList || [];

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      setLoading(true);
      try {
        const data = await apiRequest('/api/auth/refresh', {
          method: 'GET',
        });

        if (!cancelled && data?.user && data?.accessToken) {
          saveAuth(data);
        } else if (!cancelled) {
          setUser(null);
          setAccessToken('');
        }
      } catch {
        if (!cancelled) {
          setUser(null);
          setAccessToken('');
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    run();

    return () => {
      cancelled = true;
    };
  }, [apiRequest, saveAuth]);

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
    [apiRequest, saveAuth],
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
        alert(
          'Account created. Please check your email and activate your account.',
        );
      }

      return data;
    },
    [apiRequest, saveAuth],
  );

  const logout = useCallback(async () => {
    try {
      await apiRequest('/api/auth/logout', { method: 'POST' });
    } catch (e) {
      console.error('Logout error', e);
    } finally {
      setUser(null);
      setAccessToken('');
    }
  }, [apiRequest]);

  const optimisticUpdateList = useCallback((listName, id, type, action) => {
    setUser((prev) => {
      if (!prev) return prev;

      const current = prev[listName] || [];
      const idx = current.findIndex(
        (item) => item.id === id && item.type === type,
      );

      let next = current;

      if (action === 'add') {
        if (idx === -1) {
          next = [...current, { id, type }];
        }
      } else if (action === 'remove') {
        if (idx !== -1) {
          next = current.filter((_, i) => i !== idx);
        }
      }

      return {
        ...prev,
        [listName]: next,
      };
    });
  }, []);

  const updateWatchlist = useCallback(
    async (movieId, type, action) => {
      const id = Number(movieId);
      if (!id || !type || !action) return null;

      optimisticUpdateList('watchList', id, type, action);

      try {
        const data = await apiRequest('/api/user/watchlist', {
          method: 'PUT',
          headers: authHeaders,
          body: JSON.stringify({ id, type, action }),
        });

        if (data?.user) {
          setUser(data.user);
        } else if (Array.isArray(data?.watchList)) {
          setUser((prev) =>
            prev ? { ...prev, watchList: data.watchList } : prev,
          );
        }

        return data;
      } catch (err) {
        console.error('updateWatchlist failed', err);
        return null;
      }
    },
    [apiRequest, authHeaders, optimisticUpdateList],
  );

  const updateFavorites = useCallback(
    async (movieId, type, action) => {
      const id = Number(movieId);
      if (!id || !type || !action) return null;

      optimisticUpdateList('favoriteList', id, type, action);

      try {
        const data = await apiRequest('/api/user/favorite', {
          method: 'PUT',
          headers: authHeaders,
          body: JSON.stringify({ id, type, action }),
        });

        if (data?.user) {
          setUser(data.user);
        } else if (Array.isArray(data?.favorites)) {
          setUser((prev) =>
            prev ? { ...prev, favoriteList: data.favorites } : prev,
          );
        }

        return data;
      } catch (err) {
        console.error('updateFavorites failed', err);
        // keep optimistic state
        return null;
      }
    },
    [apiRequest, authHeaders, optimisticUpdateList],
  );

  const addToWatchlist = useCallback(
    (movieId, type) => updateWatchlist(movieId, type, 'add'),
    [updateWatchlist],
  );

  const removeFromWatchlist = useCallback(
    (movieId, type) => updateWatchlist(movieId, type, 'remove'),
    [updateWatchlist],
  );

  const addToFavorites = useCallback(
    (movieId, type) => updateFavorites(movieId, type, 'add'),
    [updateFavorites],
  );

  const removeFromFavorites = useCallback(
    (movieId, type) => updateFavorites(movieId, type, 'remove'),
    [updateFavorites],
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
      updateWatchlist,
      updateFavorites,
      addToWatchlist,
      removeFromWatchlist,
      addToFavorites,
      removeFromFavorites,
      apiRequest,
    ],
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
