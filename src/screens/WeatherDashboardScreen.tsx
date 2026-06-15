import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
  Image,
  RefreshControl,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { getCurrentWeather, getForecast } from '@services/weatherApi';
import useWeatherStore from '@store/useWeatherStore';
import Card from '@components/Card';
import Button from '@components/Button';
import WeatherIcon from '@components/WeatherIcon';

type Props = NativeStackScreenProps<any, 'WeatherDashboard'>;

const WeatherDashboardScreen: React.FC<Props> = ({ navigation }) => {
  const {
    currentWeather,
    setCurrentWeather,
    forecast,
    setForecast,
    loading,
    setLoading,
    error,
    setError,
    addToHistory,
    isFavorite,
  } = useWeatherStore();

  const [searchInput, setSearchInput] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadWeather('London');
  }, []);

  const loadWeather = async (city: string) => {
    setLoading(true);
    setError(null);
    try {
      const weather = await getCurrentWeather(city);
      const forecastData = await getForecast(city);
      
      setCurrentWeather(weather);
      setForecast(forecastData);
      addToHistory(city);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch weather data');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    if (searchInput.trim()) {
      loadWeather(searchInput.trim());
      setSearchInput('');
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    if (currentWeather?.name) {
      loadWeather(currentWeather.name).finally(() => setRefreshing(false));
    } else {
      setRefreshing(false);
    }
  };

  if (loading && !currentWeather) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#f4511e" />
        <Text style={styles.loadingText}>Fetching weather data...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
      }
    >
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search city..."
          value={searchInput}
          onChangeText={setSearchInput}
          onSubmitEditing={handleSearch}
          placeholderTextColor="#999"
        />
        <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
          <Text style={styles.searchButtonText}>Search</Text>
        </TouchableOpacity>
      </View>

      {/* Error Message */}
      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      {/* Current Weather */}
      {currentWeather && (
        <Card style={styles.currentWeatherCard}>
          <View style={styles.locationHeader}>
            <View>
              <Text style={styles.cityName}>{currentWeather.name}</Text>
              <Text style={styles.countryCode}>{currentWeather.sys.country}</Text>
            </View>
            <TouchableOpacity style={styles.favoriteButton}>
              <Text style={styles.favoriteIcon}>
                {isFavorite(currentWeather.name) ? '★' : '☆'}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.weatherMainSection}>
            <View style={styles.temperatureSection}>
              <Text style={styles.temperature}>{Math.round(currentWeather.main.temp)}°C</Text>
              <Text style={styles.weatherDescription}>
                {currentWeather.weather[0].main}
              </Text>
            </View>
            <WeatherIcon code={currentWeather.weather[0].icon} size={80} />
          </View>

          <Text style={styles.feelsLike}>
            Feels like {Math.round(currentWeather.main.feels_like)}°C
          </Text>

          {/* Weather Details Grid */}
          <View style={styles.detailsGrid}>
            <View style={styles.detailBox}>
              <Text style={styles.detailLabel}>Humidity</Text>
              <Text style={styles.detailValue}>{currentWeather.main.humidity}%</Text>
            </View>
            <View style={styles.detailBox}>
              <Text style={styles.detailLabel}>Pressure</Text>
              <Text style={styles.detailValue}>{currentWeather.main.pressure} hPa</Text>
            </View>
            <View style={styles.detailBox}>
              <Text style={styles.detailLabel}>Wind Speed</Text>
              <Text style={styles.detailValue}>{currentWeather.wind.speed} m/s</Text>
            </View>
            <View style={styles.detailBox}>
              <Text style={styles.detailLabel}>Visibility</Text>
              <Text style={styles.detailValue}>
                {(currentWeather.visibility / 1000).toFixed(1)} km
              </Text>
            </View>
          </View>
        </Card>
      )}

      {/* 5-Day Forecast */}
      {forecast && (
        <View style={styles.forecastSection}>
          <Text style={styles.forecastTitle}>5-Day Forecast</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {forecast.list.slice(0, 8).map((item, index) => (
              <Card key={index} style={styles.forecastCard}>
                <Text style={styles.forecastTime}>
                  {new Date(item.dt * 1000).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </Text>
                <WeatherIcon code={item.weather[0].icon} size={40} />
                <Text style={styles.forecastTemp}>{Math.round(item.main.temp)}°C</Text>
                <Text style={styles.forecastDescription}>{item.weather[0].main}</Text>
              </Card>
            ))}
          </ScrollView>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  searchContainer: {
    flexDirection: 'row',
    padding: 16,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    backgroundColor: '#fff',
  },
  searchButton: {
    backgroundColor: '#f4511e',
    paddingHorizontal: 20,
    borderRadius: 8,
    justifyContent: 'center',
  },
  searchButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  errorContainer: {
    backgroundColor: '#ffebee',
    borderLeftWidth: 4,
    borderLeftColor: '#f44336',
    padding: 12,
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 4,
  },
  errorText: {
    color: '#c62828',
    fontSize: 14,
  },
  currentWeatherCard: {
    marginHorizontal: 16,
    marginBottom: 16,
    backgroundColor: '#fff',
  },
  locationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  cityName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
  },
  countryCode: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  favoriteButton: {
    padding: 8,
  },
  favoriteIcon: {
    fontSize: 32,
    color: '#f4511e',
  },
  weatherMainSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  temperatureSection: {
    flex: 1,
  },
  temperature: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#333',
  },
  weatherDescription: {
    fontSize: 18,
    color: '#666',
    marginTop: 4,
  },
  feelsLike: {
    fontSize: 14,
    color: '#999',
    marginBottom: 16,
  },
  detailsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  detailBox: {
    flex: 1,
    minWidth: '48%',
    backgroundColor: '#f5f5f5',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: 12,
    color: '#999',
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  forecastSection: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  forecastTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  forecastCard: {
    width: 120,
    marginRight: 12,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  forecastTime: {
    fontSize: 12,
    color: '#666',
    marginBottom: 8,
  },
  forecastTemp: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginVertical: 8,
  },
  forecastDescription: {
    fontSize: 12,
    color: '#999',
  },
});

export default WeatherDashboardScreen;
