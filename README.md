# JustPint Mobile App

A modern React Native mobile application for iOS and Android platforms.

## Features

- Cross-platform support (iOS & Android)
- Type-safe TypeScript development
- Modern navigation with React Navigation
- State management with Zustand
- RESTful API integration with Axios
- Responsive UI design

## Prerequisites

- Node.js 16+
- npm 8+ or yarn
- For iOS: macOS, Xcode 14+
- For Android: Android Studio, Android SDK
- React Native CLI

## Installation

```bash
# Clone the repository
git clone <repo-url>
cd justpint-mobile

# Install dependencies
npm install

# Install iOS pods (macOS only)
cd ios
pod install
cd ..
```

## Development

### iOS

```bash
npm run ios
```

### Android

```bash
npm run android
```

## Project Structure

```
src/
├── components/       # Reusable UI components
├── screens/         # Screen components
├── services/        # API and external services
├── store/           # Zustand state management
├── utils/           # Utility functions
├── types/           # TypeScript type definitions
App.tsx             # Main app component
index.js            # Entry point
```

## Building for Production

### iOS

```bash
npm run build:ios
```

### Android

```bash
npm run build:android
```

## Testing

```bash
npm test
```

## Linting

```bash
npm run lint
```

## Contributing

Please read our contributing guidelines before submitting pull requests.

## License

MIT
