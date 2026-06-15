import React from 'react';
import { Image, StyleSheet, ViewStyle } from 'react-native';

interface WeatherIconProps {
  code: string;
  size?: number;
  style?: ViewStyle;
}

const WeatherIcon: React.FC<WeatherIconProps> = ({ code, size = 50, style }) => {
  const iconUrl = `https://openweathermap.org/img/wn/${code}@4x.png`;

  return (
    <Image
      source={{ uri: iconUrl }}
      style={[styles.icon, { width: size, height: size }, style]}
    />
  );
};

const styles = StyleSheet.create({
  icon: {
    resizeMode: 'contain',
  },
});

export default WeatherIcon;
