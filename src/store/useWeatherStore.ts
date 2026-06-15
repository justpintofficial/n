import { create } from 'zustand';
import { CurrentWeather, ForecastResponse, ForecastItem } from '@services/weatherApi';

interface WeatherState {
  // Current weather
  currentWeather: CurrentWeather | null;
  setCurrentWeather: (weather: CurrentWeather | null) => void;

  // Forecast
  forecast: ForecastResponse | null;
  setForecast: (forecast: ForecastResponse | null) => void;

  // UI state
  loading: boolean;
  setLoading: (loading: boolean) => void;
  error: string | null;
  setError: (error: string | null) => void;

  // Search history
  searchHistory: string[];
  addToHistory: (city: string) => void;
  clearHistory: () => void;

  // Favorites
  favorites: string[];
  addFavorite: (city: string) => void;
  removeFavorite: (city: string) => void;
  isFavorite: (city: string) => boolean;
}

const useWeatherStore = create<WeatherState>((set, get) => ({
  currentWeather: null,
  setCurrentWeather: (weather) => set({ currentWeather: weather }),

  forecast: null,
  setForecast: (forecast) => set({ forecast }),

  loading: false,
  setLoading: (loading) => set({ loading }),

  error: null,
  setError: (error) => set({ error }),

  searchHistory: [],
  addToHistory: (city) =>
    set((state) => ({
      searchHistory: [city, ...state.searchHistory.filter((c) => c !== city)].slice(0, 10),
    })),
  clearHistory: () => set({ searchHistory: [] }),

  favorites: [],
  addFavorite: (city) =>
    set((state) => ({
      favorites: state.favorites.includes(city) ? state.favorites : [...state.favorites, city],
    })),
  removeFavorite: (city) =>
    set((state) => ({
      favorites: state.favorites.filter((c) => c !== city),
    })),
  isFavorite: (city) => get().favorites.includes(city),
}));

export default useWeatherStore;
