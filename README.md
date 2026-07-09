# Shopping App

A React Native shopping application built with TypeScript, featuring full CRUD product management, cart with local persistence, and checkout flow.

## Features

- **Home** — Featured products, category filtering
- **Shop** — Full product listing with search, filter, create, edit, and delete products
- **Cart** — Add/remove/update quantity, auto-persisted via AsyncStorage
- **Checkout** — Order summary with shipping details form
- **Settings** — Currency preferences, clear all local data

## Tech Stack

- React Native CLI
- TypeScript
- React Navigation (bottom tabs + native stack)
- AsyncStorage (cart persistence)
- Custom hooks for state management (React Context for cart)

## Project Structure

```
src/
  components/     Reusable UI (ProductCard, CartItem, etc.)
  navigation/     Bottom tab navigator + stack navigators
  screens/        Home, Shop, ProductDetail, ProductForm, Cart, Checkout, Settings
  store/          CartProvider (Context), productStore, settingsStore
  types/          TypeScript interfaces and navigation types
  utils/          AsyncStorage wrapper, helpers
  data/           Seed product data
```

## Getting Started

### Prerequisites

- Node.js 18+
- JDK 17 (for Android)
- Xcode (for iOS)
- Android Studio (for Android)

### Install

```sh
npm install
cd ios && pod install && cd ..
```

### Run

```sh
# iOS
npx react-native run-ios

# Android
JAVA_HOME=/opt/homebrew/opt/openjdk@17 npx react-native run-android
```

### Start Metro

```sh
npm start
```

## Screenshots

| Home | Shop | Cart | Checkout |
|------|------|------|----------|
| Categories & featured | Product list with search | Quantity controls | Order summary |

## Author

sho7798
