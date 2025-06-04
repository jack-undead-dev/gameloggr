// src/context/GameContext.js
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useContext, useEffect, useReducer } from 'react';

const GameContext = createContext();

const initialState = {
  games: [],
  loading: false,
  filter: 'all',
  sortBy: 'priority',
};

const gameReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_GAMES':
      return { ...state, games: action.payload };
    case 'ADD_GAME':
      return { ...state, games: [...state.games, action.payload] };
    case 'UPDATE_GAME':
      return {
        ...state,
        games: state.games.map(game =>
          game.id === action.payload.id ? action.payload : game
        ),
      };
    case 'DELETE_GAME':
      return {
        ...state,
        games: state.games.filter(game => game.id !== action.payload),
      };
    case 'SET_FILTER':
      return { ...state, filter: action.payload };
    case 'SET_SORT':
      return { ...state, sortBy: action.payload };
    default:
      return state;
  }
};

export const GameProvider = ({ children }) => {
  const [state, dispatch] = useReducer(gameReducer, initialState);

  useEffect(() => {
    loadGames();
  }, []);

  const loadGames = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const storedGames = await AsyncStorage.getItem('games');
      if (storedGames) {
        dispatch({ type: 'SET_GAMES', payload: JSON.parse(storedGames) });
      }
    } catch (error) {
      console.error('Erro ao carregar jogos:', error);
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const saveGames = async (games) => {
    try {
      await AsyncStorage.setItem('games', JSON.stringify(games));
    } catch (error) {
      console.error('Erro ao salvar jogos:', error);
    }
  };

  const addGame = async (game) => {
    const newGame = {
      ...game,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const updatedGames = [...state.games, newGame];
    dispatch({ type: 'ADD_GAME', payload: newGame });
    await saveGames(updatedGames);
  };

  const updateGame = async (game) => {
    const updatedGame = {
      ...game,
      updatedAt: new Date().toISOString(),
    };
    const updatedGames = state.games.map(g =>
      g.id === game.id ? updatedGame : g
    );
    dispatch({ type: 'UPDATE_GAME', payload: updatedGame });
    await saveGames(updatedGames);
  };

  const deleteGame = async (gameId) => {
    const updatedGames = state.games.filter(game => game.id !== gameId);
    dispatch({ type: 'DELETE_GAME', payload: gameId });
    await saveGames(updatedGames);
  };

  const getFilteredGames = () => {
    let filtered = state.games;

    // Aplicar filtro
    if (state.filter !== 'all') {
      filtered = filtered.filter(game => game.status === state.filter);
    }

    // Aplicar ordenação
    switch (state.sortBy) {
      case 'priority':
        filtered.sort((a, b) => b.priority - a.priority);
        break;
      case 'name':
        filtered.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'dateAdded':
        filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      case 'estimatedTime':
        filtered.sort((a, b) => (a.estimatedHours || 0) - (b.estimatedHours || 0));
        break;
    }

    return filtered;
  };

  const getGamesByStatus = () => {
    const statusCounts = {
      backlog: 0,
      playing: 0,
      completed: 0,
      abandoned: 0,
    };

    state.games.forEach(game => {
      statusCounts[game.status] = (statusCounts[game.status] || 0) + 1;
    });

    return statusCounts;
  };

  const getRecommendedGame = () => {
    const backlogGames = state.games.filter(game => game.status === 'backlog');
    if (backlogGames.length === 0) return null;

    // Ordenar por prioridade e pegar o primeiro
    const sortedByPriority = backlogGames.sort((a, b) => b.priority - a.priority);
    return sortedByPriority[0];
  };

  const value = {
    ...state,
    addGame,
    updateGame,
    deleteGame,
    getFilteredGames,
    getGamesByStatus,
    getRecommendedGame,
    setFilter: (filter) => dispatch({ type: 'SET_FILTER', payload: filter }),
    setSortBy: (sortBy) => dispatch({ type: 'SET_SORT', payload: sortBy }),
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame deve ser usado dentro de GameProvider');
  }
  return context;
};
