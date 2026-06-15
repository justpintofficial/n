import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import useWeatherStore from '@store/useWeatherStore';
import { getCurrentWeather, getForecast } from '@services/weatherApi';
import Card from '@components/Card';

type Props = NativeStackScreenProps<any, 'SearchHistory'>;

const SearchHistoryScreen: React.FC<Props> = ({ navigation }) => {
  const { searchHistory, clearHistory, setCurrentWeather, setForecast, setLoading } =
    useWeatherStore();

  const handleCityPress = async (city: string) => {
    setLoading(true);
    try {
      const weather = await getCurrentWeather(city);
      const forecastData = await getForecast(city);
      setCurrentWeather(weather);
      setForecast(forecastData);
      navigation.navigate('WeatherDashboard');
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch weather data');
    } finally {
      setLoading(false);
    }
  };

  const handleClearHistory = () => {
    Alert.alert(
      'Clear History',
      'Are you sure you want to clear all search history?',
      [
        { text: 'Cancel', onPress: () => {}, style: 'cancel' },
        {
          text: 'Clear',
          onPress: () => clearHistory(),
          style: 'destructive',
        },
      ]
    );
  };

  if (searchHistory.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyIcon}>🔍</Text>
        <Text style={styles.emptyTitle}>No Search History</Text>
        <Text style={styles.emptyText}>
          Your search history will appear here
        </Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Search History</Text>
        <TouchableOpacity
          onPress={handleClearHistory}
          style={styles.clearButton}
        >
          <Text style={styles.clearButtonText}>Clear All</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        {searchHistory.map((city, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => handleCityPress(city)}
          >
            <Card style={styles.historyCard}>
              <View style={styles.cardContent}>
                <Text style={styles.cityName}>{city}</Text>
                <Text style={styles.arrow}>→</Text>
              </View>
            </Card>
          </TouchableOpacity>
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
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    paddingHorizontal: 32,
  },
  emptyIcon: {
    fontSize: 64,
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  clearButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#ffebee',
    borderRadius: 6,
  },
  clearButtonText: {
    color: '#f44336',
    fontWeight: '600',
    fontSize: 12,
  },
  content: {
    paddingHorizontal: 16,
  },
  historyCard: {
    backgroundColor: '#fff',
    marginBottom: 8,
  },
  cardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cityName: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  arrow: {
    fontSize: 18,
    color: '#f4511e',
  },
});

export default SearchHistoryScreen;
