# Nimbly Mobile App

Move lighter. Spend smarter.

React Native mobile application for Nimbly - A people-first app for smarter everyday spending, starting with groceries.

## Tech Stack

- **Framework:** React Native with Expo
- **Language:** TypeScript
- **Navigation:** React Navigation
- **State:** React Context API
- **Storage:** AsyncStorage

## Design System

The app follows the Nimbly visual system defined in `docs/visuals.md`:

### Colors

- **Sage (#5F7D73):** Primary color for Savvy moments and primary actions
- **Amber (#D9A441):** Accent color for deals and highlights (use sparingly)
- **Light/Dark Mode:** Full support with system preference detection

### Components

- `Button`: Primary, secondary, and ghost variants with loading states
- `Card`: Container component with elevation
- `Input`: Form input with theme-aware keyboard
- `Text`: Typography component with variants (h1, h2, h3, body, caption, muted)
- `ThemeToggle`: Light/dark mode switcher

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Expo Go app (for testing on device)

### Installation

```bash
cd mobile
npm install
```

### Development

```bash
npm start
```

This will start the Expo development server. You can:
- Press `a` to open on Android emulator
- Press `i` to open on iOS simulator (macOS only)
- Scan QR code with Expo Go app on your device

### Build

For production builds, see [Expo documentation](https://docs.expo.dev/build/introduction/).

## Project Structure

```
mobile/
├── src/
│   ├── components/
│   │   ├── ui/            # Base UI components
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Input.tsx
│   │   │   └── Text.tsx
│   │   └── ThemeToggle.tsx
│   ├── context/
│   │   └── ThemeContext.tsx  # Theme provider
│   └── theme/
│       ├── colors.ts      # Color palette
│       ├── spacing.ts     # Spacing system
│       └── typography.ts  # Typography system
├── App.tsx                # Root component
└── app.json              # Expo configuration
```

## Environment Variables

Create a `.env` file:

```
API_URL=http://localhost:8000
```

## Design Principles

- **Calm and trustworthy:** No visual flair, focus on clarity
- **Accessible:** Screen reader support, proper labels
- **Native feel:** Platform-specific patterns where appropriate
- **Performance:** Optimized rendering, lazy loading

## Next Steps

- Implement authentication flow (UI-3)
- Build receipt upload with camera (UI-5)
- Create receipt list and detail views (UI-7, UI-9)
- Add insights feed (UI-11)
- Set up navigation structure (UI-14)
