# Savvy Mobile App

React Native mobile app for Savvy - your smart spending companion.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Expo CLI
- iOS Simulator (Mac) or Android Emulator

### Installation

```bash
cd mobile
npm install
```

### Running the App

```bash
# Start Expo dev server
npm start

# Run on iOS simulator
npm run ios

# Run on Android emulator
npm run android
```

## 📱 Features

### ✅ Implemented
- **Authentication**
  - Email/password sign up and sign in
  - Secure token storage with SecureStore
  - Protected routes

- **Receipt Management**
  - Camera integration for taking photos
  - Gallery picker for existing photos
  - Receipt list with pull-to-refresh
  - Receipt detail view with line items
  - Professional UI with status indicators

- **Insights Feed**
  - 4 insight types (purchase frequency, price trends, common purchases, store patterns)
  - Color-coded cards
  - Confidence badges
  - Empty states

- **Profile**
  - User information
  - Theme toggle (light/dark mode)
  - Sign out

- **UI/UX**
  - Light and dark mode support
  - Consistent color scheme (Sage green primary)
  - Loading, empty, and error states
  - Professional animations
  - Responsive design

## 🏗️ Project Structure

```
mobile/
├── app/                    # Expo Router pages
│   ├── (auth)/            # Authentication screens
│   │   ├── sign-in.tsx
│   │   └── sign-up.tsx
│   ├── (tabs)/            # Main app tabs
│   │   ├── index.tsx      # Receipts list
│   │   ├── upload.tsx     # Camera/gallery upload
│   │   ├── insights.tsx   # Insights feed
│   │   └── profile.tsx    # User profile
│   ├── receipts/          # Receipt detail
│   │   └── [id].tsx
│   └── _layout.tsx        # Root layout
├── context/               # React contexts
│   ├── AuthContext.tsx    # Authentication state
│   └── ThemeContext.tsx   # Theme state
├── lib/                   # Utilities
│   └── api.ts            # API client
└── assets/               # Images and icons
```

## 🎨 Design System

### Colors
- **Primary (Sage):** #5F7D73
- **Secondary (Amber):** #D9A441
- **Success:** #10B981
- **Error:** #EF4444

### Theme
- Light mode: Clean, bright interface
- Dark mode: Easy on the eyes
- Automatic theme persistence

## 🔧 Configuration

### Environment Variables

Create `.env` file:
```bash
EXPO_PUBLIC_API_URL=http://localhost:8000
```

For production:
```bash
EXPO_PUBLIC_API_URL=https://api.yourdomain.com
```

### API Connection

The app connects to the FastAPI backend. Make sure the backend is running:

```bash
# In the api directory
uvicorn main:app --reload --port 8000
```

## 📦 Dependencies

### Core
- **expo** - React Native framework
- **expo-router** - File-based routing
- **react-native** - Mobile framework

### Features
- **expo-camera** - Camera integration
- **expo-image-picker** - Gallery picker
- **expo-secure-store** - Secure token storage
- **@react-native-async-storage/async-storage** - Theme persistence

### Utilities
- **axios** - HTTP client
- **react-hook-form** - Form handling
- **zod** - Schema validation

## 🧪 Testing

### Manual Testing Checklist

**Authentication:**
- [ ] Sign up with email/password
- [ ] Sign in with existing account
- [ ] Sign out
- [ ] Token persists after app restart

**Receipts:**
- [ ] Take photo with camera
- [ ] Select from gallery
- [ ] Upload receipt
- [ ] View receipt list
- [ ] Pull to refresh
- [ ] View receipt details
- [ ] See line items

**Insights:**
- [ ] View insights (with 3+ receipts)
- [ ] See empty state (no receipts)
- [ ] Pull to refresh

**Profile:**
- [ ] View user info
- [ ] Toggle theme
- [ ] Sign out

**UI/UX:**
- [ ] Light mode works
- [ ] Dark mode works
- [ ] Theme persists
- [ ] Loading states show
- [ ] Error states show
- [ ] Empty states show

## 📱 Deployment

### iOS (TestFlight)

1. Install EAS CLI:
```bash
npm install -g eas-cli
```

2. Configure EAS:
```bash
eas build:configure
```

3. Build for iOS:
```bash
eas build --platform ios
```

4. Submit to TestFlight:
```bash
eas submit --platform ios
```

### Android (Play Store)

1. Build for Android:
```bash
eas build --platform android
```

2. Submit to Play Store:
```bash
eas submit --platform android
```

## 🐛 Troubleshooting

### Camera not working
- Check permissions in app settings
- Restart the app
- Rebuild the app

### API connection failed
- Check backend is running
- Verify API_URL in .env
- Check network connection
- For iOS simulator, use `http://localhost:8000`
- For Android emulator, use `http://10.0.2.2:8000`

### Theme not persisting
- Clear app data
- Reinstall the app

## 📚 Resources

- [Expo Documentation](https://docs.expo.dev/)
- [React Native Documentation](https://reactnative.dev/)
- [Expo Router Documentation](https://docs.expo.dev/router/introduction/)

## 🎯 Next Steps

### Phase 1 Completion
- [ ] Test on real iOS device
- [ ] Test on real Android device
- [ ] Fix any bugs
- [ ] Polish animations
- [ ] Submit to app stores

### Phase 2 Enhancements
- [ ] Offline support
- [ ] Push notifications
- [ ] Receipt search/filter
- [ ] Bulk upload
- [ ] Share receipts

## 📄 License

See main project LICENSE file.

---

**Built with 💖 for everyday people trying to get by.**
