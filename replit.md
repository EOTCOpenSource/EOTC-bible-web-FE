# EOTC Bible - Ethiopian Orthodox Tewahedo Church Bible Web Platform

## Overview

The EOTC Bible is a Next.js-based web application that provides digital access to the Ethiopian Orthodox Tewahedo Church's 81-book biblical canon. The platform offers scripture reading in multiple languages (Ge'ez, Amharic, English, Tigrinya, and Oromo) with features for user authentication, reading progress tracking, bookmarks, highlights, and notes.

This is a frontend application that communicates with a separate backend API for user data, authentication, and biblical content management.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Framework
- **Next.js 15 (App Router)**: Modern React framework with server-side rendering and routing
- **TypeScript**: Type-safe development across the application
- **React 19**: Latest React features for component development

### Authentication Architecture
**Security-First Cookie-Based Auth**

The application implements a proxy-based authentication pattern for enhanced security:

1. **HTTPOnly Cookies**: JWT tokens are stored in HTTPOnly cookies (never in localStorage or client-side JavaScript)
2. **API Proxy Pattern**: Next.js API routes (`/api/auth/*` and `/api/proxy`) act as intermediaries between the frontend and backend
3. **Server-Side Token Handling**: All backend API calls requiring authentication go through Next.js API routes that attach the JWT from cookies

**Rationale**: This architecture prevents XSS attacks by keeping tokens inaccessible to client-side JavaScript, centralizes token management, and simplifies CORS handling.

### State Management Strategy
**Zustand with Persistent Storage**

The application uses Zustand for client-side state management with different strategies per domain:

1. **Authentication State** (`authStore`): User session, login/logout, OTP verification
2. **Bible Reading State** (`bibleStore`): Current verse reference, reading history, selected testament - persisted to localStorage
3. **UI State** (`uiStore`): Theme, font size, modal states, sidebar visibility - persisted to localStorage
4. **User Data Stores**: Bookmarks, highlights, notes, progress - synced with backend API
5. **Settings Store**: User preferences synced with backend

**Rationale**: Zustand provides a lightweight alternative to Redux with simpler APIs. Persistence allows reading progress and preferences to survive page refreshes. Separation of concerns keeps each store focused on a single domain.

### Internationalization (i18n)
**next-intl for Multi-Language Support**

- **Supported Locales**: English (en), Amharic (am), Ge'ez (gez), Tigrinya (tg), Oromo (or)
- **Cookie-Based Locale Storage**: User's language preference persists across sessions
- **Translation Files**: JSON-based message files in `src/messages/` for each locale
- **Localized Numbers**: Custom hook (`useLocalizedNumber`) for Ge'ez numeral conversion using `@onesamket/geez-number`

**Rationale**: next-intl integrates seamlessly with Next.js App Router, supports server components, and provides type-safe translations. Cookie-based storage ensures consistent language selection across the application.

### Styling Architecture
**Tailwind CSS with shadcn/ui Components**

- **Tailwind CSS v4**: Utility-first CSS framework for rapid UI development
- **Custom Theme Variables**: CSS variables for colors, spacing, and design tokens
- **shadcn/ui**: Pre-built, accessible UI components (buttons, inputs, dialogs, etc.)
- **Dark Mode Support**: Theme switching via `next-themes` with system preference detection
- **Custom Fonts**: Abyssinica SIL for Ethiopian script (Ge'ez, Amharic, Tigrinya)

**Rationale**: Tailwind enables consistent styling with minimal CSS files. shadcn/ui provides accessible, customizable components without package bloat. CSS variables allow dynamic theming.

### Form Handling
**React Hook Form with Zod Validation**

- **React Hook Form**: Performant form state management with minimal re-renders
- **Zod Schemas**: Runtime type validation for form inputs (login, registration)
- **@hookform/resolvers**: Integration layer between React Hook Form and Zod

**Rationale**: This combination provides type-safe form validation with excellent developer experience and runtime safety.

### HTTP Client Strategy
**Dual Axios Instances**

1. **Client-Side Axios** (`lib/axios.ts`): For browser-based API calls with automatic credential inclusion
2. **Server-Side Axios** (`lib/server-axios.ts`): For Next.js API routes with automatic JWT injection from cookies

**Alternative Approach**: `lib/server-fetch.ts` provides a fetch-based alternative for server-side API calls

**Rationale**: Separate instances prevent cookie/credential leakage and allow different interceptor logic for client vs. server contexts.

### Middleware & Route Protection
**Next.js Middleware for Auth Guards**

- **Protected Routes**: `/dashboard/*` requires authentication
- **Public Routes**: Landing pages, auth pages accessible without login
- **Redirect Logic**: Unauthenticated users redirected to `/login` with return URL preserved
- **Cookie Validation**: Checks for JWT cookie presence before allowing access

**Rationale**: Middleware runs before route rendering, preventing unauthorized access at the edge and improving security.

### Component Architecture
**Feature-Based Organization**

- **Landing Components** (`components/landing/`): Public-facing pages (Hero, Features, Footer)
- **Form Components** (`components/forms/`): Authentication forms with validation
- **Layout Components** (`components/layout/`): Sidebar, navigation, structural elements
- **UI Components** (`components/ui/`): Reusable shadcn/ui components
- **Reader Components** (`components/reader/`): Bible reading interface with verse actions

**Rationale**: Feature-based organization improves discoverability and makes it easier to locate related components.

### Data Layer
**Static Bible Data with Dynamic User Data**

- **Bible Text Data**: JSON files in `src/data/bible-data/` loaded statically
- **Book Metadata**: Static book list in `src/data/data.ts`
- **User-Generated Data**: Fetched from backend API (bookmarks, notes, highlights, progress)

**Rationale**: Biblical text is immutable and benefits from static loading, while user data requires dynamic fetching and synchronization with the backend.

### Custom Hooks
**Reusable Logic Abstraction**

- `useDebounce`: Delays state updates for search inputs
- `useLocalizedNumber`: Converts numbers to Ge'ez numerals based on locale
- `useLocalizedContent`: Retrieves localized content from translation maps
- `useIsMobile`: Responsive design helper for mobile detection
- `useToast`: Toast notification management

**Rationale**: Custom hooks encapsulate reusable logic, improve testability, and keep components focused on presentation.

## External Dependencies

### Backend API
**REST API for User Data & Authentication**

- **Base URL**: Configured via `BACKEND_BASE_URL` environment variable
- **Authentication**: JWT-based with Bearer token in Authorization header
- **Key Endpoints**:
  - `/api/v1/auth/*` - Login, register, OTP verification
  - `/api/v1/user/me` - User profile and settings
  - `/api/v1/user/bookmarks` - Bookmark management
  - `/api/v1/user/highlights` - Highlight management
  - `/api/v1/user/notes` - Note management
  - `/api/v1/user/progress` - Reading progress tracking

**Note**: The application uses a proxy pattern through Next.js API routes to interact with this backend.

### Third-Party Services

**UI & Styling Libraries**
- **Radix UI**: Accessible component primitives (dialogs, dropdowns, tooltips, selects)
- **Lucide React**: Icon library for consistent iconography
- **Tailwind Merge & clsx**: Class name utilities for conditional styling

**Form & Validation**
- **React Hook Form**: Form state management
- **Zod**: Schema validation library
- **@hookform/resolvers**: Zod integration for React Hook Form

**Utilities**
- **Axios**: HTTP client for API requests
- **next-themes**: Theme management (light/dark/system)
- **next-intl**: Internationalization framework
- **@onesamket/geez-number**: Ethiopian numeral conversion
- **Sonner**: Toast notification system
- **Zustand**: Lightweight state management

**Development Tools**
- **Prettier**: Code formatting with Tailwind plugin
- **ESLint**: Code linting with Next.js configuration
- **TypeScript**: Type checking

### Environment Configuration

**Required Environment Variables**:
- `BACKEND_BASE_URL` (or `BACKEND_URL`): Backend API base URL
- `JWT_COOKIE_NAME`: Name of the cookie storing the JWT (default: `auth_token`)
- `NODE_ENV`: Environment mode (development/production)
- `APP_NAME`: Application name (default: "80 weahadu bible")

**Validation**: The application validates required environment variables on startup via `lib/env.ts`

### Database Consideration
While the frontend doesn't directly interact with a database, the backend API likely uses one (possibly PostgreSQL) for:
- User accounts and authentication
- Bookmarks, highlights, and notes
- Reading progress and streaks
- User settings and preferences

The frontend is designed to work with any backend that implements the expected REST API contract.