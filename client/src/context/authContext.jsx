// client/src/context/AuthContext.jsx
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  useCallback,
} from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const API_URL = import.meta.env.VITE_API_URL;

  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState('');
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  const isAuthenticated = !!user && !!accessToken;

  const apiRequest = useCallback(
    async (endpoint, options = {}) => {
      try {
        const response = await fetch(`${API_URL}${endpoint}`, {
          ...options,
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
            ...options.headers,
          },
        });

        if (!response.ok) {
          const error = await response.json().catch(() => ({}));
          throw new Error(
            error.message || `Request failed with status ${response.status}`
          );
        }

        return await response.json();
      } catch (error) {
        console.error(`API Error [${endpoint}]:`, error);
        throw error;
      }
    },
    [API_URL]
  );

  useEffect(() => {
    let cancelled = false;

    const refreshAuth = async () => {
      try {
        setLoading(true);
        const data = await apiRequest('/api/auth/refresh', {
          method: 'GET',
        });

        if (!cancelled && data.user && data.accessToken) {
          setUser(data.user);
          setAccessToken(data.accessToken);
        }
      } catch (error) {
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

    refreshAuth();

    return () => {
      cancelled = true;
    };
  }, [apiRequest]);

  const login = useCallback(
    async (email, password) => {
      try {
        const data = await apiRequest('/api/auth/login', {
          method: 'POST',
          body: JSON.stringify({ email, password }),
        });

        setUser(data.user);
        setAccessToken(data.accessToken);
        return data;
      } catch (error) {
        throw error;
      }
    },
    [apiRequest]
  );

  const register = useCallback(
    async (username, email, password) => {
      try {
        const data = await apiRequest('/api/auth/registration', {
          method: 'POST',
          body: JSON.stringify({ username, email, password }),
        });

        setUser(data.user);
        setAccessToken(data.accessToken);
        return data;
      } catch (error) {
        throw error;
      }
    },
    [apiRequest]
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

  const authHeaders = useMemo(() => {
    return accessToken ? { Authorization: `Bearer ${accessToken}` } : {};
  }, [accessToken]);

  const updateFavorites = useCallback(
    async (movieId, action) => {
      try {
        const data = await apiRequest('/api/movielist/favorites', {
          method: 'PUT',
          headers: authHeaders,
          body: JSON.stringify({ movieId, action }),
        });

        if (data.user) {
          setUser(data.user);
        }

        return data;
      } catch (error) {
        throw error;
      }
    },
    [apiRequest, authHeaders]
  );

  const updateWatchlist = useCallback(
    async (movieId, action) => {
      try {
        const data = await apiRequest('/api/movielist/watchlist', {
          method: 'PUT',
          headers: authHeaders,
          body: JSON.stringify({ movieId, action }),
        });

        if (data.user) {
          setUser(data.user);
        }

        return data;
      } catch (error) {
        throw error;
      }
    },
    [apiRequest, authHeaders]
  );

  const value = useMemo(
    () => ({
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
      updateFavorites,
      updateWatchlist,
      apiRequest,
    }),
    [
      user,
      isAuthenticated,
      accessToken,
      authHeaders,
      loading,
      modalOpen,
      login,
      register,
      logout,
      updateFavorites,
      updateWatchlist,
      apiRequest,
    ]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
