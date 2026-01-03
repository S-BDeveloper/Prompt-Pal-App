# 🎮 PromptPal

**Master the Art of AI Prompt Engineering**

An innovative multi-module mobile game that teaches players to craft perfect AI prompts across three domains: image generation, coding, and copywriting. Master the art of communicating with AI through gamified challenges and real-time feedback.

![PromptPal Banner](https://img.shields.io/badge/Status-Phase%201%20Complete-success?style=for-the-badge)
![Modules](https://img.shields.io/badge/Modules-3%20(Image%2C%20Code%2C%20Copy)-blue?style=for-the-badge)
![Expo](https://img.shields.io/badge/Expo-SDK%2054-black?style=flat-square&logo=expo)
![React Native](https://img.shields.io/badge/React%20Native-0.81.5-blue?style=flat-square)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue?style=flat-square)

## 🌟 Features

### ✅ Current Features (Phase 1 Complete)
- **🎨 Dark Theme UI**: Beautiful, consistent dark mode design with custom color palette
- **🏆 Multi-Module Level System**: Progressive difficulty across three AI domains
- **📱 Module-Adaptive UI**: Dynamic interfaces for Image, Code, and Copywriting challenges
- **💾 Persistent Progress**: Game state saved securely using Expo SecureStore
- **🔄 Mock AI Integration**: Realistic simulation for all three modules
- **❤️ Lives System**: Limited attempts per level with retry mechanics
- **🎯 Module Filtering**: Switch between Image, Code, and Copywriting challenges

### 🚀 Upcoming Features (Phase 2-5)
- **🤖 Real Gemini API**: Integration with Google's Gemini 2.5 Flash (text/vision) and Gemini 2.5 Flash Image (images)
- **🧠 "Nano Banana"**: Local Gemini Nano AI assistance on supported Android devices
- **💻 Code Execution Engine**: Sandbox environment for testing generated code
- **📝 Content Analysis AI**: Advanced copywriting evaluation and feedback
- **📊 Advanced Scoring**: AI-powered analysis across all three modules (0-100% accuracy)
- **🎪 Interactive UI**: Before/after comparisons, animated counters, loading terminals
- **📈 Progress Analytics**: Detailed statistics and improvement tracking per module

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
│   │   ├── index.tsx          # Level select with module filtering
│   │   └── game/[id].tsx      # Dynamic game screen (adaptive per module)
│   ├── components/
│   │   └── ui/                # Reusable UI components
│   │       ├── Button.tsx     # Custom button component
│   │       ├── Input.tsx      # Text input component
│   │       └── Modal.tsx      # Modal component
│   ├── features/
│   │   ├── game/              # Game state management
│   │   │   ├── store.ts       # Zustand store with persistence
│   │   │   ├── components/    # Game-specific components
│   │   │   │   ├── TargetImageView.tsx    # Zoomable image display
│   │   │   │   ├── PromptInputView.tsx    # Dynamic input interface
│   │   │   │   ├── ResultModal.tsx        # Universal results modal
│   │   │   │   ├── LoadingTerminal.tsx    # AI processing animation
│   │   │   │   ├── CodeRequirementsView.tsx # Programming challenges
│   │   │   │   └── CopyBriefView.tsx      # Marketing briefs
│   │   │   └── types.ts       # Game-related types
│   │   ├── levels/            # Level data and logic
│   │   │   ├── data.ts        # Level definitions and utilities
│   │   │   ├── types.ts       # Level and progress types
│   │   │   └── components/    # Level-specific components
│   │   │       └── LevelCard.tsx # Progress-aware level cards
│   │   └── onboarding/        # First-time user experience
│   │       ├── store.ts       # Onboarding state
│   │       └── OnboardingOverlay.tsx # Tutorial component
│   └── lib/
│       ├── gemini.ts          # Image generation service
│       ├── codeExecution.ts   # Code execution and testing
│       ├── copywriting.ts     # Content analysis service
│       ├── scoring.ts         # Multi-module scoring algorithms
│       ├── nano.ts            # Gemini Nano bridge (Android)
│       └── imagePreloader.ts  # Performance optimization
├── assets/                    # Static assets (icons, splash screens)
├── docs/                      # Documentation
│   ├── plan.md               # Comprehensive development plan
│   └── prd.md                # Product requirements
├── app.json                   # Expo configuration
├── tailwind.config.js         # Tailwind CSS configuration
└── package.json               # Dependencies and scripts
```

## 🎯 How to Play

### 🖼️ **Image Generation Module**
1. **Select a Level**: Choose from unlocked image challenges
2. **Analyze the Target**: Study the displayed image carefully (pinch to zoom)
3. **Craft Your Prompt**: Write a detailed description to recreate the image
4. **Generate & Compare**: AI creates your image and compares it to the target
5. **Improve & Retry**: Use AI feedback to refine your prompt engineering

### 💻 **Coding Module**
1. **Read Requirements**: Study the programming task and test cases
2. **Write AI Prompt**: Craft a prompt instructing AI to generate the code
3. **Execute & Test**: Generated code runs automatically against test cases
4. **Analyze Results**: Review execution results and code quality metrics
5. **Refine Prompts**: Improve your prompts based on test failures and feedback

### ✍️ **Copywriting Module**
1. **Review Brief**: Read the audience, product, and tone requirements
2. **Craft Copy Prompt**: Write a prompt for generating marketing copy
3. **Analyze Content**: AI evaluates tone, persuasion, and effectiveness
4. **Review Metrics**: Study detailed feedback on audience targeting and calls-to-action
5. **Iterate & Improve**: Refine prompts for better marketing copy generation

### Scoring System
- **Images**: 60%+ similarity score to pass (AI vision analysis)
- **Code**: 70%+ functionality score (test cases + code quality)
- **Copy**: 65%+ effectiveness score (tone + persuasion + audience fit)
- **Limited Lives**: 3 attempts per level before game over
- **Progression**: Passing unlocks next level, builds cross-module skills

## 🧪 Development Status

### ✅ Phase 1: Project Initialization & Architecture
- **Completed**: January 3, 2026
- **Duration**: 3 days
- **Deliverables**: Multi-module app foundation with adaptive UI, persistent state, module filtering

### 🚀 Phase 2: Core Service Layer (Ready to Start)
- **Timeline**: January 4-15, 2026 (8-12 hours)
- **Focus**: Real Gemini API integration across all three modules
- **Milestone**: Functional AI services for Image Generation, Code Execution, and Copywriting Analysis

### 📅 Development Roadmap

| Phase | Duration | Focus Area | Status | Time Estimate |
|-------|----------|------------|---------|---------------|
| 1 | Jan 1-3 | Multi-Module Architecture & UI | ✅ Complete | 3 days |
| 2 | Jan 4-7 | AI Services & Scoring Systems | 🚀 In Progress | 8-12 hours |
| 3 | Jan 8-11 | Level Design & Persistence | 📋 Planned | 6-10 hours |
| 4 | Jan 12-15 | Gameplay Implementation | 📋 Planned | 10-14 hours |
| 5 | Jan 16-19 | Polish, Testing & Deployment | 📋 Planned | 8-12 hours |

**Total Development Time**: 50-70 hours across all phases
**Target Launch**: January 25th, 2026 (Polishing completion)

## 🤝 Contributing

We welcome contributions from developers of all skill levels! Whether you're fixing a bug, adding a feature, or improving documentation, your help is appreciated. This guide is designed for beginners who are new to Git and open source collaboration.

### 🛠️ Git Setup for Beginners

#### Step 1: Fork the Repository
1. Go to the [PromptPal repository](https://github.com/mwijanarko1/Prompt-Pal-App) on GitHub
2. Click the **"Fork"** button in the top-right corner
3. This creates a copy of the repository under your GitHub account

#### Step 2: Clone Your Fork Locally
```bash
# Replace 'your-username' with your actual GitHub username
git clone https://github.com/your-username/Prompt-Pal-App.git
cd Prompt-Pal-App
```

#### Step 3: Set Up Git Configuration
```bash
# Set your name and email (replace with your info)
git config --global user.name "Your Full Name"
git config --global user.email "your.email@example.com"

# Verify your setup
git config --list --show-origin
```

#### Step 4: Connect to the Original Repository
```bash
# Add the original repository as 'upstream'
git remote add upstream https://github.com/mwijanarko1/Prompt-Pal-App.git

# Verify remotes
git remote -v
```

### 🌿 Working with Git Branches

#### Creating a New Branch
Always create a new branch for your changes - never work directly on `main`:

```bash
# Create and switch to a new branch
# Use descriptive names like: feature/add-dark-mode, fix/login-bug, docs/update-readme
git checkout -b feature/your-awesome-feature

# Or create and switch in two steps:
git branch feature/your-awesome-feature
git checkout feature/your-awesome-feature
```

#### Making Changes and Committing
```bash
# Check what files you've changed
git status

# Stage your changes
git add .

# Or stage specific files
git add README.md
git add PromptPal/src/components/Button.tsx

# Commit with a descriptive message
git commit -m "feat: add dark mode toggle button"

# For multiple related changes, make multiple commits:
git add file1.js
git commit -m "feat: implement button component"
git add file2.js
git commit -m "feat: add button styling"
```

#### Pushing Your Branch
```bash
# Push your branch to GitHub
git push origin feature/your-awesome-feature

# If this is your first push of this branch, Git might suggest:
git push --set-upstream origin feature/your-awesome-feature
```

### 🔄 Keeping Your Branch Updated

Before submitting a PR, make sure your branch is up to date:

```bash
# Switch to main branch
git checkout main

# Pull latest changes from upstream
git pull upstream main

# Switch back to your branch
git checkout feature/your-awesome-feature

# Merge latest changes into your branch
git merge main

# Or use rebase (cleaner history):
git rebase main
```

### 📝 Conventional Commits

We use [Conventional Commits](https://conventionalcommits.org/) for consistent commit messages:

| Type | Description | Example |
|------|-------------|---------|
| `feat:` | New feature | `feat: add user authentication` |
| `fix:` | Bug fix | `fix: resolve login timeout issue` |
| `docs:` | Documentation | `docs: update installation guide` |
| `style:` | Code style | `style: format code with prettier` |
| `refactor:` | Code restructure | `refactor: simplify user validation logic` |
| `test:` | Tests | `test: add unit tests for auth service` |
| `chore:` | Maintenance | `chore: update dependencies` |

**Examples:**
- ✅ `feat: add dark mode toggle`
- ✅ `fix: resolve crash on iOS devices`
- ✅ `docs: clarify installation steps for Windows`
- ❌ `updated stuff`
- ❌ `fixed bug`

### 🚀 Submitting a Pull Request

#### Step 1: Create the Pull Request
1. Go to your fork on GitHub
2. Click **"Compare & pull request"** button
3. **Base repository**: `mwijanarko1/Prompt-Pal-App`
4. **Base branch**: `main`
5. **Head repository**: `your-username/Prompt-Pal-App`
6. **Compare branch**: `feature/your-awesome-feature`

#### Step 2: Write a Great PR Description
```markdown
## What does this PR do?
Brief description of your changes

## Why is this change needed?
Explain the problem you're solving

## How was this tested?
- [ ] Tested on iOS Simulator
- [ ] Tested on Android Emulator
- [ ] Manual testing completed
- [ ] All existing tests pass

## Screenshots (if applicable)
Add screenshots of UI changes

## Additional Notes
Any other information reviewers should know
```

#### Step 3: Submit and Wait for Review
- Click **"Create pull request"**
- Wait for maintainers to review
- Address any requested changes
- Once approved, your PR will be merged!

### 🧹 Cleaning Up After Merge

After your PR is merged:
```bash
# Delete your local branch
git branch -d feature/your-awesome-feature

# Delete from GitHub (optional, done via GitHub UI)
# Or via command line:
git push origin --delete feature/your-awesome-feature
```

### 🆘 Need Help?

- **Git Basics**: Check out [GitHub's Git Handbook](https://guides.github.com/introduction/git-handbook/)
- **Interactive Git**: Try [Learn Git Branching](https://learngitbranching.js.org/)
- **Conventional Commits**: Read the [full specification](https://conventionalcommits.org/)
- **Questions**: Open a [GitHub Discussion](https://github.com/mwijanarko1/Prompt-Pal-App/discussions) or [Issue](https://github.com/mwijanarko1/Prompt-Pal-App/issues)

### Code Style Guidelines
- **TypeScript**: Strict mode enabled - all code must be type-safe
- **ESLint**: Configured for React Native best practices
- **Prettier**: Automatic code formatting (run `npm run format`)
- **Conventional Commits**: Required for all commits
- **Testing**: Add tests for new features when possible

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

