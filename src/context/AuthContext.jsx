import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const AuthContext = createContext(null);

const API_BASE = window.location.origin;

async function apiFetch(endpoint, options = {}) {
  const url = `${API_BASE}/api${endpoint}`;
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    credentials: 'same-origin',
    ...options,
  };

  if (config.body && typeof config.body === 'object') {
    config.body = JSON.stringify(config.body);
  }

// Note: This runs on page load to check auth - 401 is expected if not logged in
  const response = await fetch(url, config);
  const data = await response.json();

  // Don't throw for 401 on auth/me - it just means not logged in
  if (!response.ok && !(response.status === 401 && url.includes('auth/me'))) {
    throw new Error(data.error || `Error ${response.status}`);
  }

  return data;
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const checkAuth = useCallback(async () => {
    try {
      const response = await apiFetch('/auth/me');
      setUser(response.data);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const login = async (username, password) => {
    const response = await apiFetch('/auth/login', {
      method: 'POST',
      body: { username, password },
    });
    setUser(response.user);
    return response;
  };

  const logout = async () => {
    await apiFetch('/auth/logout', { method: 'POST' });
    setUser(null);
  };

  const register = async (username, email, password) => {
    const response = await apiFetch('/auth/register', {
      method: 'POST',
      body: { username, email, password },
    });
    return response;
  };

  const isAdmin = () => {
    return user?.role === 'admin';
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      login,
      logout,
      register,
      checkAuth,
      isAdmin,
      isAuthenticated: !!user,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
