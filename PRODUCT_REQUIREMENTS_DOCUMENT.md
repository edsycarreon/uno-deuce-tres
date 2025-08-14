# Poop Tracker - Product Requirements Document

## Executive Summary

**Product Name:** Poop Tracker  
**Version:** v0.1.0  
**Last Updated:** August 14, 2025  
**Document Type:** Product Requirements Document (PRD)

Poop Tracker is a social bathroom activity tracking application that gamifies daily bathroom habits through competitive group leaderboards, streak tracking, and social engagement features. Built with Next.js 15, Firebase, and a distinctive "neobrutalism" design system, the app transforms a universal human activity into an engaging social experience.

---

## 1. Product Overview

### 1.1 Vision Statement

To create the world's most entertaining and socially engaging bathroom activity tracking platform that brings friends together through friendly competition and habit tracking.

### 1.2 Mission Statement

Democratize bathroom activity tracking by providing a fun, social, and privacy-conscious platform that encourages daily habits through gamification and community engagement.

### 1.3 Core Value Proposition

- **Social Competition**: Transform individual bathroom activities into engaging group competitions
- **Privacy Control**: Granular privacy settings (public/private logs) with user control
- **Streak Gamification**: Build and maintain daily logging streaks with friends
- **Real-time Engagement**: Live updates and notifications for group activities
- **Distinctive Design**: Unique neobrutalism UI that stands out from traditional health apps

---

## 2. Technical Architecture

### 2.1 Technology Stack

**Frontend Framework:**

- Next.js 15 with App Router
- React 19
- TypeScript 5
- Tailwind CSS 4
- Framer Motion (animations)

**Backend Services:**

- Firebase Authentication
- Firebase Firestore (real-time database)
- Firebase Admin SDK (server-side operations)
- Next.js API Routes

**State Management:**

- TanStack React Query v5 (server state)
- React Context (client state)
- Custom hooks pattern

**Validation & Forms:**

- Zod schemas
- React Hook Form
- Shadcn/ui components

### 2.2 Database Architecture

**Firestore Collections Structure:**

- `users/{userId}` - User profiles and settings
- `users/{userId}/poopLogs/{logId}` - Individual bathroom logs (subcollection)
- `users/{userId}/dailyStats/{dateKey}` - Pre-calculated daily statistics
- `groups/{groupId}` - Group metadata with memberIds array
- `groups/{groupId}/members/{userId}` - Detailed member information
- `dailyAggregations/{dateKey}` - Global and per-group statistics
- `inviteCodes/{code}` - Group invitation codes

**Data Architecture Pattern:**

- Denormalized structure optimized for read performance
- Real-time listeners for live updates
- Atomic transactions for data consistency
- Pre-calculated aggregations for dashboard performance

### 2.3 Authentication & Security

**Authentication Flow:**

- Firebase Authentication with email/password
- ID token-based API route authentication
- Auto-generated user profiles on signup
- Timezone auto-detection

**Security Implementation:**

- Firebase Security Rules enforce privacy model
- Server-side validation using Zod schemas
- Private logs only visible to owner
- Public logs visible to group members only
- No cross-group data leakage

---

## 3. Core Features

### 3.1 User Authentication & Onboarding

**Current Implementation:**

- Email/password registration via Firebase Auth
- Automatic user profile creation in Firestore
- Timezone detection and storage
- Display name and privacy preferences setup

**User Flow:**

1. User signs up with email/password/display name
2. System auto-detects timezone
3. Creates user document with default settings
4. Redirects to dashboard

**Technical Files:**

- `src/app/signup/page.tsx` - Registration page
- `src/app/signin/page.tsx` - Login page
- `src/hooks/useAuth.ts` - Authentication state management
- `src/hooks/useAuthApi.ts` - API authentication calls

### 3.2 Poop Logging System

**Core Functionality:**

- One-tap logging with floating action button
- Public/private visibility toggle
- Automatic timestamp and date key generation
- Real-time optimistic updates
- Recent activity display

**Technical Implementation:**

- `src/components/PoopLogger.tsx` - Main logging interface
- `src/hooks/usePoopLogs.ts` - Data fetching and mutations
- `src/lib/firebase/poopLogger.ts` - Server-side logging logic
- `src/lib/utils/poopLogKeys.ts` - Date key generation utilities

**Data Structure:**

```typescript
interface PoopLogDocument {
  id: string;
  userId: string;
  timestamp: Timestamp;
  isPublic: boolean;
  dayKey: string; // YYYY-MM-DD
  weekKey: string; // YYYY-WXX
  monthKey: string; // YYYY-MM
  groups: string[]; // Associated group IDs
}
```

### 3.3 Dashboard & Statistics

**Current Features:**

- Today's log count display
- Current streak tracking
- Recent activity timeline
- Quick stats cards
- Floating poop button for one-tap logging

**Components:**

- `src/app/(app)/dashboard/page.tsx` - Main dashboard
- `src/components/StatsCards.tsx` - Statistics display
- `src/components/RecentActivity.tsx` - Activity timeline
- `src/components/dashboard/CurrentStreakCard.tsx` - Streak display
- `src/components/dashboard/TodaysLogsCard.tsx` - Daily count

### 3.4 Group Management System

**Group Features:**

- Create new groups with customizable settings
- Join groups via 6-character invite codes
- Group member management
- Group-specific statistics
- Privacy controls (private/public groups)

**Group Settings:**

- Maximum member limits (2-100)
- Private/public visibility
- Self-join permissions
- Group descriptions and metadata

**Technical Files:**

- `src/app/(app)/groups/page.tsx` - Groups listing page
- `src/components/forms/CreateGroupForm.tsx` - Group creation
- `src/components/forms/JoinGroupForm.tsx` - Group joining
- `src/components/groups/GroupCard.tsx` - Group display component
- `src/hooks/useGroups.ts` - Group operations hook

### 3.5 Privacy & Settings

**Privacy Model:**

- Individual log visibility (public/private)
- Private logs: only visible to owner
- Public logs: visible to group members
- Group membership required for data access

**User Settings:**

- Default privacy preferences
- Notification preferences
- Display name customization
- Timezone settings

---

## 4. User Interface & Design System

### 4.1 Neobrutalism Design Language

**Core Design Principles:**

- Bold, high-contrast color scheme
- Thick black borders on all components
- Drop shadows for depth (--shadow-shadow)
- Rounded corners for friendliness
- Large, readable typography
- Playful animations and micro-interactions

**CSS Custom Properties:**

```css
--color-main        /* Primary brand color */
--color-border      /* Black borders */
--color-background  /* Page background */
--shadow-shadow     /* Standard drop shadow */
--color-ring        /* Focus ring color */
```

**Design Constraints:**

- Never use hardcoded colors
- Always reference CSS custom properties
- Maintain consistent spacing scale
- Use Lucide React icons only
- Follow established component patterns

### 4.2 Component Architecture

**Base Components:** (`src/components/ui/`)

- Built on Shadcn/ui foundation
- Customized for neobrutalism aesthetic
- Consistent props and API patterns
- Full TypeScript support

**Feature Components:**

- Domain-organized structure (`groups/`, `forms/`, `layout/`)
- Reusable business logic components
- Integration with custom hooks
- Error boundary integration

### 4.3 Mobile-First Responsive Design

**Breakpoint Strategy:**

- Mobile: < 640px (primary target)
- Tablet: 640px - 1024px
- Desktop: > 1024px

**Mobile Optimizations:**

- Bottom navigation for mobile
- Floating action button positioning
- Touch-friendly button sizes
- Optimized form layouts

---

## 5. Data Management & Performance

### 5.1 State Management Architecture

**Server State (TanStack React Query):**

- Automatic caching and background updates
- Optimistic updates for instant feedback
- Error handling and retry logic
- Real-time synchronization with Firestore

**Client State (React Context):**

- Authentication state
- Error handling context
- User preferences
- UI state management

### 5.2 Real-time Data Synchronization

**Firestore Real-time Listeners:**

- Live updates for group activities
- Instant notification of new logs
- Real-time leaderboard updates
- Automatic cache invalidation

**Performance Optimizations:**

- Pre-calculated daily/weekly/monthly aggregations
- Efficient pagination for log history
- Optimistic updates for immediate feedback
- Background synchronization

### 5.3 Offline Capabilities

**Current Limitations:**

- Requires internet connection for logging
- No offline queue for logs
- Real-time features unavailable offline

**Future Considerations:**

- Service worker implementation
- Offline log queue
- Conflict resolution strategies

---

## 6. API Architecture

### 6.1 API Route Structure

**Authentication Endpoints:**

- `POST /api/auth/signup` - User registration
- `POST /api/auth/signin` - User authentication
- `POST /api/auth/verify` - Token verification

**Core Functionality:**

- `POST /api/poop-logs` - Log new bathroom activity
- `GET /api/poop-logs` - Retrieve user's log history

**Security Model:**

- All routes require Firebase ID token
- Server-side token verification
- User context injection
- Request validation using Zod schemas

### 6.2 Firebase Integration

**Client SDK Usage:**

- Real-time authentication state
- Real-time data listeners
- File upload capabilities
- Push notification support

**Admin SDK Usage:**

- Server-side data operations
- Atomic transactions
- Batch operations
- Security rule enforcement

---

## 7. Error Handling & User Experience

### 7.1 Global Error Management

**Error Handling System:**

- Global error context (`src/contexts/ErrorContext.tsx`)
- Centralized error modal (`src/components/ui/error-modal.tsx`)
- Custom error handler hook (`src/hooks/useErrorHandler.ts`)
- Firebase-specific error parsing

**Error Types & Styling:**

- **Error**: Red styling with X icon
- **Warning**: Yellow styling with triangle icon
- **Info**: Blue styling with info icon

**Error Categories:**

- Authentication errors (with specific messaging)
- Network connectivity issues
- Validation errors (form feedback)
- Server errors (with retry options)

### 7.2 Loading States & Feedback

**Loading Patterns:**

- Skeleton screens for content loading
- Spinner components for async operations
- Optimistic updates for instant feedback
- Progress indicators for multi-step processes

**User Feedback:**

- Toast notifications (Sonner integration)
- Success confirmations
- Error messaging
- Status indicators

---

## 8. Testing & Quality Assurance

### 8.1 Current Testing Strategy

**Development Commands:**

```bash
npm run dev      # Development with Turbopack
npm run build    # Production build
npm run lint     # ESLint validation
```

**Quality Gates:**

- TypeScript compilation
- ESLint rule enforcement
- Build process validation
- Firebase rule testing

### 8.2 Manual Testing Scenarios

**Core User Flows:**

1. User registration and onboarding
2. Daily poop logging workflow
3. Group creation and management
4. Group joining via invite codes
5. Privacy settings configuration
6. Real-time updates verification

**Edge Cases:**

- Network connectivity loss
- Invalid invite codes
- Group capacity limits
- Concurrent logging attempts
- Cross-timezone functionality

---

## 9. Performance Requirements

### 9.1 Technical Performance

**Core Metrics:**

- Page load time: < 3 seconds
- Time to first contentful paint: < 1.5 seconds
- Logging action response: < 500ms (optimistic)
- Real-time update latency: < 2 seconds

**Optimization Strategies:**

- Next.js automatic code splitting
- TanStack Query caching
- Firestore query optimization
- Image optimization (Next.js built-in)

### 9.2 Scalability Considerations

**Database Scaling:**

- Sharding by user ID for large datasets
- Aggregation collection pre-computation
- Efficient indexing strategies
- Read replica considerations

**Frontend Scaling:**

- CDN distribution
- Lazy loading strategies
- Bundle size optimization
- Caching strategies

---

## 10. Security & Privacy

### 10.1 Data Privacy Framework

**Privacy Principles:**

- User control over data visibility
- Granular privacy settings
- No data sharing without consent
- GDPR compliance considerations

**Data Retention:**

- User logs: Indefinite (user controlled)
- Aggregations: Calculated, not stored raw
- Authentication data: Firebase managed
- Analytics: Anonymized only

### 10.2 Security Implementation

**Authentication Security:**

- Firebase Auth secure token management
- Server-side token verification
- Session management
- Password requirements

**Data Security:**

- Firestore security rules enforcement
- API route authentication
- Input validation and sanitization
- SQL injection prevention (NoSQL)

---

## 11. Analytics & Metrics

### 11.1 User Engagement Metrics

**Key Performance Indicators:**

- Daily Active Users (DAU)
- Weekly log completion rate
- Average logs per user per day
- Group participation rate
- Streak maintenance rate

**Engagement Tracking:**

- User session duration
- Feature adoption rates
- Group creation vs. joining ratio
- Privacy setting preferences

### 11.2 Technical Metrics

**Performance Monitoring:**

- Page load times
- API response times
- Error rates by endpoint
- Firebase usage and costs
- Real-time listener performance

---

## 12. Future Roadmap

### 12.1 Short-term Enhancements (Next 3 months)

**Feature Completions:**

- Global leaderboard implementation (`src/app/(app)/leaderboard/page.tsx` placeholder exists)
- Enhanced group leaderboard functionality
- Push notification system
- User profile customization

**Technical Improvements:**

- Offline capability implementation
- Performance optimization
- Enhanced error handling
- Testing framework setup

### 12.2 Medium-term Features (3-6 months)

**Advanced Features:**

- Bathroom location tracking
- Photo logging capabilities
- Achievement system
- Social sharing features
- Export/import functionality

**Platform Expansion:**

- Progressive Web App (PWA) features
- Mobile app considerations
- API for third-party integrations

### 12.3 Long-term Vision (6+ months)

**Platform Evolution:**

- AI-powered insights
- Health integration capabilities
- Advanced analytics dashboard
- Multi-language support
- Enterprise/family plans

---

## 13. Technical Dependencies & Environment

### 13.1 Required Environment Variables

```env
# Firebase Configuration
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_CLIENT_EMAIL=your_service_account_email
FIREBASE_PRIVATE_KEY=your_private_key

# Next.js Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

### 13.2 Development Setup

**Prerequisites:**

- Node.js 18+
- npm or yarn package manager
- Firebase project with Authentication and Firestore enabled
- Service account key for Firebase Admin SDK

**Installation:**

```bash
npm install
npm run dev      # Start development server
npm run build    # Build for production
npm run lint     # Run code quality checks
```

---

## 14. Compliance & Legal

### 14.1 Privacy Compliance

**Data Processing:**

- User consent for data collection
- Clear privacy policy
- Data portability features
- Right to deletion

**Regional Compliance:**

- GDPR (European Union)
- CCPA (California)
- PIPEDA (Canada)
- Other regional requirements

### 14.2 Terms of Service

**Platform Rules:**

- Appropriate use guidelines
- Content moderation policies
- Group management rules
- Account suspension policies

---

## 15. Conclusion

The Poop Tracker application represents a unique approach to habit tracking through social gamification. Built on a robust technical foundation with Next.js 15, Firebase, and a distinctive design system, the platform successfully transforms a universal human activity into an engaging social experience.

The current implementation provides a solid MVP with core features including user authentication, poop logging, group management, and real-time statistics. The architecture is well-designed for scalability and maintainability, with clear separation of concerns and established patterns throughout.

Key strengths include the privacy-conscious design, real-time functionality, and distinctive user interface. The neobrutalism design system creates a memorable brand identity while maintaining excellent usability.

Future development should focus on completing the leaderboard system, implementing offline capabilities, and expanding social features while maintaining the core privacy principles and technical quality standards established in the current codebase.

---

**Document Metadata:**

- **Created:** August 14, 2025
- **Based on:** Existing codebase analysis
- **Technical Review:** Required before implementation of new features
- **Next Review:** As features are implemented and architecture evolves

---
