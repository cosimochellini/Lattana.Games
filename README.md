# 🎮 Lattana Games
<img width="220" alt="Secret Hitler game screenshot" src="https://github.com/user-attachments/assets/6d7dab22-b124-4cd1-8225-7b19b0b8ce1d" />
<img width="220" alt="Trump game screenshot" src="https://github.com/user-attachments/assets/416314e3-85cd-45fd-b398-81a19ae5a5b9" />
<img width="220" alt="Statistics screen screenshot" src="https://github.com/user-attachments/assets/c2ba9979-c736-4d62-b85e-40e4e8a82fcf" />

## 📋 Overview

Lattana Games is a comprehensive platform for tracking, managing, and analyzing board game matches. The platform currently supports:

- Secret Hitler
- Trump (card game)

## ✨ Features

### Game Management
- **Match Tracking**: Record and save game sessions with detailed player information
- **Match History**: Browse through your past games with searchable history
- **Game Creation**: Easily create new game sessions with intuitive UI

### Statistics & Analysis
- **Comprehensive Stats**: Track win rates, play patterns, and performance metrics
- **Player Rankings**: See how you stack up against other players with detailed leaderboards
- **Role-based Stats**: Analyze performance across different in-game roles (e.g., Liberal vs Fascist)
- **Player Pairing Analysis**: Discover your best allies and toughest opponents

### User Management
- **Role-based Access Control**: Different permission levels (Admin, Editor, Nosy)
- **Feature Access**: Specific features available based on user roles
- **Player Profiles**: Detailed player information and statistics

### Technical Features
- **Mobile-First Design**: Optimized for mobile devices with responsive layout
- **Modern UI**: Clean, intuitive interface with Tailwind CSS
- **Headless CMS**: Content management through Sanity.io
- **Localization**: Multi-language support

## 🛠️ Technology Stack

- **Frontend**: Vue 3 + TypeScript
- **Styling**: Tailwind CSS
- **CMS**: Sanity.io (Headless CMS)
- **Charts**: Vue Chart.js
- **Drag & Drop**: Vuedraggable
- **Notifications**: Vue Toastification

## 🚀 Getting Started

### Prerequisites
- Node.js (>=14.17.0)
- Yarn

### Installation

```bash
# Install dependencies
yarn

# Start development server
yarn serve

# Build for production
yarn build

# Lint and fix files
yarn lint
```

## 🔑 Role-Based Access

The application supports different user roles with varying permissions:

- **Admin**: Full access to all features
- **Editor**: Can create and edit games
- **Nosy**: Read-only access to statistics and history

## 📱 Mobile Experience

Lattana Games is designed with a mobile-first approach, providing an optimized experience on smartphones while maintaining excellent usability on larger screens.

## 🌐 Customization

You can customize the application by modifying the configuration files in the `src/configuration` directory.

## 📄 License

MIT
