# 🎮 PromptPal

**Master the Art of Prompt Engineering**

An innovative mobile game that teaches players to craft perfect AI image generation prompts by analyzing target images and competing for the highest similarity scores.

![PromptPal Banner](https://img.shields.io/badge/Status-Phase%201%20Complete-success?style=for-the-badge)
![Expo](https://img.shields.io/badge/Expo-SDK%2054-black?style=flat-square&logo=expo)
![React Native](https://img.shields.io/badge/React%20Native-0.81.5-blue?style=flat-square)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue?style=flat-square)

## 🌟 Features

### ✅ Current Features (Phase 1 Complete)
- **🎨 Dark Theme UI**: Beautiful, consistent dark mode design with custom color palette
- **🏆 Level System**: Progressive difficulty levels with unlock mechanics
- **🎯 Split-Screen Gameplay**: Target image display with prompt input interface
- **📱 Mobile-First**: Optimized for iOS and Android devices
- **💾 Persistent Progress**: Game state saved securely using Expo SecureStore
- **🔄 Mock AI Integration**: Placeholder for Gemini API with realistic simulation
- **❤️ Lives System**: Limited attempts per level with retry mechanics

### 🚀 Upcoming Features (Phase 2-5)
- **🤖 Real Gemini API**: Integration with Google's Gemini 1.5 Pro and Imagen 2
- **🧠 "Nano Banana"**: Local Gemini Nano AI assistance on supported Android devices
- **📊 Advanced Scoring**: AI-powered similarity analysis (0-100% accuracy)
- **🎪 Interactive UI**: Before/after sliders, animated score counters, loading terminals
- **📈 Progress Analytics**: Detailed statistics and improvement tracking
- **🌍 Cross-Platform**: Seamless experience across iOS, Android, and Web

## 🛠️ Technology Stack

### Core Framework
- **Expo SDK 54**: Latest Expo platform for cross-platform development
- **React Native 0.81.5**: Modern React Native with new architecture
- **TypeScript 5.9**: Type-safe development with latest TypeScript features

### UI & Styling
- **NativeWind**: Tailwind CSS for React Native
- **React Native Safe Area Context**: Proper notch and edge handling
- **Expo Router**: File-based routing and navigation

### State Management
- **Zustand**: Lightweight, scalable state management
- **Expo SecureStore**: Encrypted persistent storage

### AI Integration (Phase 2)
- **Google Gemini API**: Advanced multimodal AI for image generation and analysis
- **Gemini Nano**: On-device AI for instant prompt assistance
- **React Native Bridge**: Native modules for Android AICore integration

## 🚀 Quick Start

### Prerequisites
- **Node.js** 18+ and **npm** or **yarn**
- **Expo CLI**: `npm install -g @expo/cli`
- **iOS Simulator** (macOS) or **Android Emulator** or **Physical Device**

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd prompt-pal-app
   ```

2. **Navigate to the project**
   ```bash
   cd PromptPal
   ```

3. **Install dependencies**
   ```bash
   npm install
   ```

4. **Start the development server**
   ```bash
   npm start
   ```

5. **Run on device/emulator**
   - Press `i` for iOS Simulator
   - Press `a` for Android Emulator
   - Press `w` for Web browser
   - Or scan QR code with **Expo Go** app

## 📁 Project Structure

```
PromptPal/
├── src/
│   ├── app/                    # Expo Router pages
│   │   ├── _layout.tsx        # Root layout with navigation
│   │   ├── index.tsx          # Level select screen
│   │   └── game/[id].tsx      # Dynamic game screen
│   ├── components/
│   │   └── ui/                # Reusable UI components
│   │       ├── Button.tsx     # Custom button component
│   │       ├── Input.tsx      # Text input component
│   │       └── Modal.tsx      # Modal component
│   ├── features/
│   │   ├── game/              # Game state management
│   │   │   ├── store.ts       # Zustand store with persistence
│   │   │   └── types.ts       # Game-related types
│   │   └── levels/            # Level data and logic
│   │       └── data.ts        # Level definitions and utilities
│   └── lib/
│       └── gemini.ts          # Gemini API integration (Phase 2)
├── assets/                    # Static assets (icons, splash screens)
├── app.json                   # Expo configuration
├── tailwind.config.js         # Tailwind CSS configuration
└── package.json               # Dependencies and scripts
```

## 🎯 How to Play

1. **Select a Level**: Choose from unlocked levels in the main menu
2. **Analyze the Image**: Study the target image displayed at the top
3. **Craft Your Prompt**: Write a detailed description in the text input below
4. **Generate & Compare**: Tap "Generate" to create an AI image and see your score
5. **Improve & Retry**: Use the score feedback to refine your prompt engineering skills

### Scoring System
- **75%+**: Level passed! Unlock the next challenge
- **<75%**: Try again with an improved prompt
- **Limited Lives**: 3 attempts per level before game over

## 🧪 Development Status

### ✅ Phase 1: Project Initialization & Architecture
- **Completed**: January 3, 2026
- **Duration**: 3 days
- **Deliverables**: Fully functional app with mock AI, complete UI/UX, persistent state

### 🚀 Phase 2: Core Service Layer (In Progress)
- **Timeline**: January 4-10, 2026
- **Focus**: Real Gemini API integration, advanced scoring algorithms
- **Milestone**: Functional AI-powered image generation and analysis

### 📅 Development Roadmap

| Phase | Duration | Focus Area | Status |
|-------|----------|------------|---------|
| 1 | Jan 1-3 | Architecture & UI | ✅ Complete |
| 2 | Jan 4-10 | AI Integration | 🚀 Starting |
| 3 | Jan 11-15 | Content & Persistence | 📋 Planned |
| 4 | Jan 16-24 | Enhanced Gameplay | 📋 Planned |
| 5 | Jan 25-31 | Polish & Deployment | 📋 Planned |

## 🤝 Contributing

We welcome contributions! Please see our contributing guidelines:

### Development Setup
1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes and test thoroughly
4. Commit with conventional commits: `git commit -m "feat: add amazing feature"`
5. Push and create a Pull Request

### Code Style
- **TypeScript**: Strict mode enabled
- **ESLint**: Configured for React Native best practices
- **Prettier**: Automatic code formatting
- **Conventional Commits**: Required for all commits

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Google AI**: For Gemini and Imagen APIs powering the AI features
- **Expo Team**: For the incredible React Native development platform
- **React Native Community**: For the amazing ecosystem of libraries

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/username/promptpal/issues)
- **Discussions**: [GitHub Discussions](https://github.com/username/promptpal/discussions)
- **Email**: support@promptpal.game

---
