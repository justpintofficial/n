# JustPint Mobile App - Setup Guide

## Development Environment Setup

### Prerequisites

- Node.js 16+ and npm 8+
- Git
- For iOS: macOS with Xcode 14+
- For Android: Android Studio with Android SDK

### Steps

1. **Clone the repository**
   ```bash
   git clone <repo-url>
   cd justpint-mobile
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **For iOS only**
   ```bash
   cd ios
   pod install
   cd ..
   ```

4. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

5. **Run the app**
   ```bash
   npm run ios    # For iOS
   npm run android # For Android
   ```

## Project Structure

- `src/components/` - Reusable UI components
- `src/screens/` - Screen components
- `src/services/` - API and external service integrations
- `src/store/` - State management with Zustand
- `src/utils/` - Utility functions and constants
- `src/types/` - TypeScript type definitions
- `android/` - Android native code
- `ios/` - iOS native code

## Common Commands

```bash
npm run android       # Run on Android emulator/device
npm run ios          # Run on iOS simulator
npm test             # Run tests
npm run lint         # Run linter
npm run build:android # Build Android release APK
npm run build:ios    # Build iOS release build
```

## Troubleshooting

### Android issues
- Clear gradle cache: `cd android && ./gradlew clean && cd ..`
- Clear node_modules: `rm -rf node_modules && npm install`

### iOS issues
- Clear pods: `cd ios && rm -rf Pods Podfile.lock && pod install && cd ..`
- Clear build cache: `cd ios && xcodebuild clean && cd ..`
