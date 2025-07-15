# Poop Tracker App 💩

A social poop tracking application built with Next.js, allowing users to log their bathroom activities and compete with friends in groups through leaderboards.

## Features

- 🔐 **User Authentication** - Firebase Auth with email/password
- ⚡ **One-Tap Logging** - Quick poop logging with privacy controls
- 👥 **Social Groups** - Create groups and invite friends
- 🏆 **Leaderboards** - Daily, weekly, and monthly competitions
- 📊 **Statistics** - Track streaks, totals, and personal stats
- 🌍 **Timezone Support** - Automatic timezone detection
- 📱 **Mobile-First** - Responsive design with Neobrutalism styling

## Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **UI Components**: Shadcn/ui
- **Styling**: Tailwind CSS
- **Form Management**: React Hook Form
- **Validation**: Zod
- **Database**: Firestore (Firebase)
- **Authentication**: Firebase Auth
- **Deployment**: Vercel (recommended)

## Getting Started

### Prerequisites

- Node.js 18+
- npm, yarn, pnpm, or bun
- Firebase project

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd poop-tracker
```

2. Install dependencies:

```bash
npm install
```

3. Set up Firebase:

   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Create a new project or select existing one
   - Go to Project Settings > General
   - Scroll down to "Your apps" section
   - Click the web app icon (</>) to add a web app
   - Copy the config values

4. Create environment variables:

```bash
cp .env.local.example .env.local
```

Fill in your Firebase configuration:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

5. Set up Firestore Database:

   - Go to Firestore Database in Firebase Console
   - Create database in production mode
   - Set up security rules (see `firestore.rules`)

6. Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
├── components/            # Reusable UI components
│   ├── ui/               # Shadcn/ui components
│   ├── forms/            # Form components
│   └── layout/           # Layout components
├── lib/                  # Utility functions and configurations
│   ├── firebase/         # Firebase configuration and helpers
│   ├── validations/      # Zod schemas
│   └── utils/           # General utilities
├── hooks/                # Custom React hooks
├── types/                # TypeScript type definitions
└── constants/            # Application constants
```

## Authentication Flow

1. **Sign Up**: Users create accounts with email/password
2. **Auto Timezone**: Timezone is automatically detected
3. **Profile Creation**: User profile is created in Firestore
4. **Dashboard**: Redirected to dashboard after successful signup
5. **Sign In**: Existing users can sign in with email/password

## Database Schema

The app uses Firestore with the following collections:

- `users` - User profiles and settings
- `users/{userId}/poopLogs` - Individual user's poop logs
- `groups` - Group information and settings
- `groups/{groupId}/members` - Group member details
- `dailyAggregations` - Daily statistics for leaderboards

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Learn More

To learn more about the technologies used:

- [Next.js Documentation](https://nextjs.org/docs)
- [Firebase Documentation](https://firebase.google.com/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Shadcn/ui](https://ui.shadcn.com/)
