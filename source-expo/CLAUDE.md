# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

**Start Development Server:**
```bash
npm start           # Start Expo development server
npm run android     # Start for Android
npm run ios         # Start for iOS  
npm run web         # Start for web
```

**Testing and Quality:**
```bash
npm test           # Run Jest tests in watch mode
npm run lint       # Run ESLint
```

**Build Commands:**
```bash
eas build --platform android --profile development
eas build --platform ios --profile development
eas build --platform all --profile production
```

## Project Architecture

**ListarPro** is a React Native/Expo directory listing application built with Redux/Redux-Saga state management.

### Core Structure

- **`app/`** - Main application code
  - **`screens/`** - Screen components (Home, Authentication, ProductDetail, etc.)
  - **`components/`** - Reusable components (widgets, listings, booking items)
  - **`redux/`** - State management (actions, reducers, sagas, store)
  - **`api/`** - API integration layer
  - **`models+types/`** - TypeScript type definitions
  - **`assets/`** - Images, fonts, localization files
  - **`utils/`** - Utility functions

- **`shared/`** - Custom UI component library (`@passionui/components`)
  - Complete component kit with theming support
  - Navigation components (BottomTab, Stack, etc.)
  - Form inputs, buttons, layouts, etc.

### Key Architectural Patterns

**State Management:**
- Redux Toolkit + Redux-Saga for async operations
- Redux-Persist for data persistence
- Centralized actions in `redux/actions/`
- Async operations handled in `redux/sagas/`

**Navigation:**
- React Navigation v6 with custom Navigator wrapper
- Bottom tab navigation as main structure
- Authentication flows integrated into navigation

**Theming:**
- Dynamic theming system in `@passionui/components`
- Supports light/dark modes
- Multiple font and color theme options
- Theme configuration in `app/configs/theme.ts`

**Internationalization:**
- i18next for multi-language support
- Language files in `app/assets/localization/`
- 20+ supported languages

**API Integration:**
- Centralized API configuration in `app/api/`
- REST API client with axios
- Default domain: `https://demo.listarapp.com`

### Development Notes

- Entry point: `App.js` → `app/index.tsx` → `app/container.tsx`
- Main app structure defined in `app/main.tsx` with bottom tabs
- Custom components library developed as local package in `shared/`
- Expo SDK 53 with managed workflow
- TypeScript throughout with strict type checking