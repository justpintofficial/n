import axios, { AxiosInstance } from 'axios';

const WEATHER_API_KEY = process.env.REACT_APP_WEATHER_API_KEY || '';
const WEATHER_BASE_URL = 'https://api.openweathermap.org/data/2.5';

export interface WeatherData {
  id: number;
  main: string;
  description: string;
  icon: string;
}

export interface MainWeatherInfo {
  temp: number;
  feels_like: number;
  temp_min: number;
  temp_max: number;
  pressure: number;
  humidity: number;
}

export interface CurrentWeather {
  coord: {
    lon: number;
    lat: number;
  };
  weather: WeatherData[];
  main: MainWeatherInfo;
  visibility: number;
  wind: {
    speed: number;
    deg: number;
    gust?: number;
  };
  clouds: {
    all: number;
  };
  dt: number;
  sys: {
    type: number;
    id: number;
    country: string;
    sunrise: number;
    sunset: number;
  };
  timezone: number;
  id: number;
  name: string;
  cod: number;
}

export interface ForecastItem {
  dt: number;
  main: MainWeatherInfo;
  weather: WeatherData[];
  clouds: {
    all: number;
  };
  wind: {
    speed: number;
    deg: number;
    gust?: number;
  };
  visibility: number;
  pop: number;
  rain?: {
    '3h': number;
  };
  sys: {
    pod: string;
  };
  dt_txt: string;
}

export interface ForecastResponse {
  cod: string;
  message: number;
  cnt: number;
  list: ForecastItem[];
  city: {
    id: number;
    name: string;
    coord: {
      lat: number;
      lon: number;
    };
    country: string;
    population: number;
    timezone: number;
    sunrise: number;
    sunset: number;
  };
}

const weatherApi: AxiosInstance = axios.create({
  baseURL: WEATHER_BASE_URL,
  timeout: 10000,
});

weatherApi.interceptors.request.use(
  (config) => {
    config.params = config.params || {};
    config.params.appid = WEATHER_API_KEY;
    config.params.units = 'metric';
    return config;
  },
  (error) => Promise.reject(error)
);

weatherApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.error('Invalid API key');
    } else if (error.response?.status === 404) {
      console.error('Location not found');
    }
    return Promise.reject(error);
  }
);

export const getCurrentWeather = async (city: string): Promise<CurrentWeather> => {
  const response = await weatherApi.get<CurrentWeather>('/weather', {
    params: { q: city },
  });
  return response.data;
};

export const getCurrentWeatherByCoords = async (
  lat: number,
  lon: number
): Promise<CurrentWeather> => {
  const response = await weatherApi.get<CurrentWeather>('/weather', {
    params: { lat, lon },
  });
  return response.data;
};

export const getForecast = async (city: string): Promise<ForecastResponse> => {
  const response = await weatherApi.get<ForecastResponse>('/forecast', {
    params: { q: city },
  });
  return response.data;
};

export const getForecastByCoords = async (
  lat: number,
  lon: number
): Promise<ForecastResponse> => {
  const response = await weatherApi.get<ForecastResponse>('/forecast', {
    params: { lat, lon },
  });
  return response.data;
};

export default weatherApi;
