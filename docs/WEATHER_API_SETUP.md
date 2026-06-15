# Weather Dashboard Setup Guide

## Overview

The weather dashboard is a feature-rich weather application that fetches real-time weather data from OpenWeatherMap API.

## Features

- **Current Weather**: Display real-time weather for any location
- **5-Day Forecast**: View upcoming weather conditions
- **Search History**: Keep track of recently searched cities
- **Favorites**: Save your favorite cities for quick access
- **Weather Details**: Humidity, pressure, wind speed, visibility
- **Pull-to-Refresh**: Update weather data with a simple gesture

## Getting Started

### 1. API Key Setup

1. Visit [OpenWeatherMap](https://openweathermap.org/api)
2. Sign up for a free account
3. Go to API keys section and copy your API key
4. Add it to your `.env` file:

```bash
REACT_APP_WEATHER_API_KEY=your_api_key_here
```

### 2. Install Dependencies

If not already installed, add weather-related dependencies:

```bash
npm install
```

### 3. Update App Navigation

Add the weather screens to your navigation stack in `App.tsx`:

```typescript
import WeatherDashboardScreen from '@screens/WeatherDashboardScreen';
import FavoritesScreen from '@screens/FavoritesScreen';
import SearchHistoryScreen from '@screens/SearchHistoryScreen';

// Add to Stack.Navigator
<Stack.Screen
  name="WeatherDashboard"
  component={WeatherDashboardScreen}
  options={{ title: 'Weather' }}
/>
```

## File Structure

```
src/
├── services/
│   └── weatherApi.ts          # OpenWeatherMap API integration
├── screens/
│   ├── WeatherDashboardScreen.tsx    # Main weather dashboard
│   ├── FavoritesScreen.tsx           # Favorite cities
│   └── SearchHistoryScreen.tsx       # Search history
├── store/
│   └── useWeatherStore.ts      # Weather state management
└── components/
    └── WeatherIcon.tsx         # Weather icon component
```

## API Endpoints

### Current Weather
```
GET /weather?q={city_name}&appid={api_key}&units=metric
```

### 5-Day Forecast
```
GET /forecast?q={city_name}&appid={api_key}&units=metric
```

## State Management (Zustand)

The weather store manages:
- Current weather data
- Forecast data
- Loading and error states
- Search history (last 10 searches)
- Favorite cities

## Usage Examples

### Search Weather by City
```typescript
const { setCurrentWeather, setLoading } = useWeatherStore();
const weather = await getCurrentWeather('London');
setCurrentWeather(weather);
```

### Add to Favorites
```typescript
const { addFavorite } = useWeatherStore();
addFavorite('Paris');
```

### Get Search History
```typescript
const { searchHistory } = useWeatherStore();
console.log(searchHistory); // ['London', 'Paris', ...]
```

## Weather Icons

Weather icons are fetched from OpenWeatherMap CDN:
```
https://openweathermap.org/img/wn/{icon_code}@4x.png
```

## Error Handling

- Invalid API key: "Invalid API key"
- City not found: "Location not found"
- Network error: "Failed to fetch weather data"

## Troubleshooting

### No API Key Error
Ensure you've added `REACT_APP_WEATHER_API_KEY` to your `.env` file

### City Not Found
Check the exact spelling of the city name

### Images Not Loading
Ensure internet connection is stable

## Future Enhancements

- [ ] Weather alerts and notifications
- [ ] Weather maps
- [ ] Air quality index
- [ ] Multiple location tracking
- [ ] Weather trends and analytics
- [ ] Dark mode support
