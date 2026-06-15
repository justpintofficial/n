import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
  Alert,
} from 'react-native';
import { getCurrentWeather } from '@services/weatherApi';
import useWeatherStore from '@store/useWeatherStore';
import Card from '@components/Card';
import WeatherIcon from '@components/WeatherIcon';

const FavoritesScreen: React.FC = () => {
  const { favorites, removeFavorite, setCurrentWeather } = useWeatherStore();
  const [loading, setLoading] = useState<string | null>(null);
  const [favoritesData, setFavoritesData] = useState<any[]>([]);

  React.useEffect(() => {
    loadFavoritesData();
  }, [favorites]);

  const loadFavoritesData = async () => {
    try {
      const data = await Promise.all(
        favorites.map(async (city) => {
          try {
            const weather = await getCurrentWeather(city);
            return weather;
          } catch (error) {
            return null;
          }
        })
      );
      setFavoritesData(data.filter(Boolean));
    } catch (error) {
      console.error('Error loading favorites:', error);
    }
  };

  const handleRemoveFavorite = (city: string) => {
    Alert.alert(
      'Remove Favorite',
      `Remove ${city} from favorites?`,
      [
        { text: 'Cancel', onPress: () => {}, style: 'cancel' },
        {
          text: 'Remove',
          onPress: () => removeFavorite(city),
          style: 'destructive',
        },
      ]
    );
  };

  if (favorites.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyIcon}>★</Text>
        <Text style={styles.emptyTitle}>No Favorites Yet</Text>
        <Text style={styles.emptyText}>
          Add your favorite cities to quickly access their weather
        </Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Favorite Cities</Text>
        {favoritesData.map((weather, index) => (
          <Card key={index} style={styles.favoriteCard}>
            <View style={styles.cardHeader}>
              <View style={styles.cardInfo}>
                <Text style={styles.cardCityName}>{weather.name}</Text>
                <Text style={styles.cardTemp}>
                  {Math.round(weather.main.temp)}°C
                </Text>
              </View>
              <View style={styles.cardRight}>
                <WeatherIcon code={weather.weather[0].icon} size={50} />
                <TouchableOpacity
                  onPress={() => handleRemoveFavorite(weather.name)}
                  style={styles.removeButton}
                >
                  <Text style={styles.removeIcon}>✕</Text>
                </TouchableOpacity>
              </View>
            </View>
            <Text style={styles.cardDescription}>{weather.weather[0].main}</Text>
            <Text style={styles.cardFeelsLike}>
              Feels like {Math.round(weather.main.feels_like)}°C
            </Text>
          </Card>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    paddingHorizontal: 32,
  },
  emptyIcon: {
    fontSize: 64,
    color: '#ddd',
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
  favoriteCard: {
    backgroundColor: '#fff',
    marginBottom: 12,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardInfo: {
    flex: 1,
  },
  cardCityName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  cardTemp: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#f4511e',
    marginTop: 4,
  },
  cardRight: {
    alignItems: 'center',
    position: 'relative',
  },
  removeButton: {
    position: 'absolute',
    top: -8,
    right: -8,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#ffebee',
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeIcon: {
    fontSize: 18,
    color: '#f44336',
    fontWeight: 'bold',
  },
  cardDescription: {
    fontSize: 14,
    color: '#666',
    marginTop: 8,
  },
  cardFeelsLike: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
});

export default FavoritesScreen;
