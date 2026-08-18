import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const GameContext = createContext(null);

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

  if (config.body && typeof config.body === 'object' && !(config.body instanceof FormData)) {
    config.body = JSON.stringify(config.body);
  }

  console.log(`API Request: ${url}`, config);

  try {
    const response = await fetch(url, config);
    const text = await response.text();
    console.log(`API Response (${response.status}):`, text.substring(0, 500));
    
    if (!text || text.trim() === '') {
      throw new Error('Empty response from server');
    }

    let data;
    try {
      data = JSON.parse(text);
    } catch (e) {
      throw new Error(`Invalid JSON: ${text.substring(0, 200)}`);
    }

    if (!response.ok) {
      throw new Error(data.error || `Error ${response.status}`);
    }

    return data;
  } catch (err) {
    console.error(`API Error [${url}]:`, err.message);
    throw err;
  }
}

const initialGames = [];

export function GameProvider({ children }) {
  const [games, setGames] = useState(initialGames);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({ page: 1, total_pages: 1, total: 0 });

  const fetchGames = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);
    try {
      const queryParams = new URLSearchParams({
        page: params.page || 1,
        per_page: params.per_page || 12,
        ...(params.search && { search: params.search }),
        ...(params.category && { category: params.category }),
        ...(params.tag && { tag: params.tag }),
        ...(params.sort && { sort: params.sort }),
        ...(params.order && { order: params.order }),
      });

      const response = await apiFetch(`/games?${queryParams}`);
      setGames(response.data);
      setPagination(response.pagination);
    } catch (err) {
      setError(err.message);
      setGames([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchGames();
  }, [fetchGames]);

  const addGame = async (gameData) => {
    const response = await apiFetch('/games', {
      method: 'POST',
      body: gameData,
    });
    await fetchGames();
    return response.data;
  };

  const updateGame = async (id, gameData) => {
    await apiFetch(`/games/${id}`, {
      method: 'PUT',
      body: gameData,
    });
    await fetchGames();
  };

  const deleteGame = async (id) => {
    await apiFetch(`/games/${id}`, { method: 'DELETE' });
    await fetchGames();
  };

  const toggleVisibility = async (id) => {
    await apiFetch(`/games/${id}`, {
      method: 'PUT',
      body: { is_visible: true },
    });
    await fetchGames();
  };

  const getVisibleGames = () => {
    return games.filter(game => game.is_visible !== false);
  };

  const getGameById = (id) => {
    return games.find(game => game.id === parseInt(id));
  };

  const getGameBySlug = async (slug) => {
    const response = await apiFetch(`/games/slug/${slug}`);
    return response.data;
  };

  const uploadFile = async (file, type = 'image') => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);

    const response = await apiFetch('/upload', {
      method: 'POST',
      body: formData,
      headers: {},
    });
    return response;
  };

  return (
    <GameContext.Provider value={{
      games,
      loading,
      error,
      pagination,
      fetchGames,
      addGame,
      updateGame,
      deleteGame,
      toggleVisibility,
      getVisibleGames,
      getGameById,
      getGameBySlug,
      uploadFile,
    }}>
      {children}
    </GameContext.Provider>
  );
}

export function useGames() {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGames must be used within a GameProvider');
  }
  return context;
}
