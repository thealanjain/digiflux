# DigiFlux - Movie Discovery Application

A modern, full-featured movie discovery web application built with Next.js 16, featuring movie browsing, intelligent search with infinite scroll, personalized favorites, and Google OAuth authentication powered by the TMDB API.

![Next.js](https://img.shields.io/badge/Next.js-16.0-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript)
![React Query](https://img.shields.io/badge/TanStack_Query-5.0-red?style=flat-square&logo=react-query)
![Redux](https://img.shields.io/badge/Redux_Toolkit-2.0-purple?style=flat-square&logo=redux)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-38bdf8?style=flat-square&logo=tailwind-css)

---

## 📑 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Tech Choices & Reasoning](#-tech-choices--reasoning)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Environment Setup](#-environment-setup)
- [Available Scripts](#-available-scripts)
- [Caching Strategy](#-caching-strategy)
- [Known Issues](#-known-issues)
- [Future Work](#-future-work)
- [Contributing](#-contributing)
- [License](#-license)

---

## ✨ Features

### Core Features
- **🎬 Browse Movies**: Discover popular and top-rated movies in elegant carousels
- **🔍 Advanced Search**: Real-time search with infinite scroll pagination
- **❤️ Favorites System**: Save your favorite movies with persistent storage
- **🔐 Authentication**: Secure Google OAuth login via NextAuth.js
- **📱 Responsive Design**: Fully optimized for mobile, tablet, and desktop
- **⚡ Performance**: Dual-layer caching (Server + Client) for instant loads
- **🎨 Modern UI**: Beautiful components from ShadCN UI with Tailwind CSS

### User Experience
- **Sticky Header**: Always-accessible navigation and search
- **Loading States**: Smooth skeleton loaders during data fetching
- **Toast Notifications**: Real-time feedback for user actions
- **Modal Dialogs**: Intentional login prompts with controlled UX
- **Optimized Images**: Next.js Image component with lazy loading
- **Glass-morphism Effects**: Modern backdrop blur and transparency

### Technical Features
- **Server-Side Rendering**: Fast initial page loads with Next.js App Router
- **Client-Side Caching**: React Query for intelligent data management
- **State Persistence**: Redux Persist for favorites across sessions
- **Type Safety**: Full TypeScript implementation
- **Error Handling**: Graceful error states and user feedback

---

## 🛠 Tech Stack

### Frontend Framework
- **Next.js 16** - React framework with App Router
- **React 19** - UI library
- **TypeScript 5** - Type-safe JavaScript

### State Management
- **Redux Toolkit** - Global state management
- **Redux Persist** - Local storage persistence
- **TanStack Query (React Query) 5** - Server state management

### Authentication
- **NextAuth.js** - Authentication with Google OAuth

### Styling
- **Tailwind CSS 4** - Utility-first CSS framework
- **ShadCN UI** - Accessible component library
- **Lucide React** - Icon library

### Data Fetching & APIs
- **TMDB API** - The Movie Database API
- **Native Fetch API** - HTTP requests with Next.js caching

### Development Tools
- **ESLint** - Code linting
- **PostCSS** - CSS processing

---

## 🤔 Tech Choices & Reasoning

### Why TanStack Query instead of Axios?

#### ✅ **TanStack Query (React Query) Chosen:**

1. **Built-in Caching**: Automatic caching, deduplication, and background refetching
   ```typescript
   // Automatic cache with query keys
   useQuery({
     queryKey: ['movies', 'popular', page],
     queryFn: () => getPopularMovies(page),
     staleTime: 60 * 1000, // Smart caching
   });
   ```

2. **Server State Management**: Designed specifically for server data
   - Automatic refetching on window focus
   - Stale-while-revalidate pattern
   - Optimistic updates support

3. **React Integration**: Hooks-first API that feels native to React
   - `useQuery` for GET requests
   - `useMutation` for POST/PUT/DELETE
   - `useInfiniteQuery` for pagination (used in search)

4. **DevTools**: Excellent debugging experience
   - Query inspector
   - Cache visualization
   - Network request timeline

5. **Loading & Error States**: Built-in state management
   ```typescript
   const { data, isLoading, error } = useQuery(...);
   ```

#### ❌ **Why Not Axios:**

- **Just an HTTP Client**: Axios only makes HTTP requests
- **Manual Caching**: You'd need to implement caching logic yourself
- **State Management**: Requires additional state management (useState, useEffect)
- **Boilerplate**: More code for loading states, error handling, caching
- **No React Integration**: Not React-specific, works everywhere but lacks React optimization

#### 🔄 **Our Hybrid Approach:**

We use **Native Fetch + TanStack Query**:
```typescript
// lib/tmdb.ts - Server-side caching with fetch
async function fetchFromTMDB<T>(endpoint: string): Promise<T> {
  const response = await fetch(url, {
    next: { revalidate: 3600 }, // Next.js cache: 1 hour
  });
  return response.json();
}

// lib/hooks/useMovies.ts - Client-side caching with React Query
export function usePopularMovies(page: number = 1) {
  return useQuery({
    queryKey: ['movies', 'popular', page],
    queryFn: () => getPopularMovies(page), // Uses fetch above
    staleTime: 60 * 1000, // React Query cache: 1 minute
  });
}
```

**Benefits:**
- ✅ **Dual-layer caching**: Server (1 hour) + Client (1 minute)
- ✅ **No external dependencies**: Native fetch is built into Next.js
- ✅ **Best of both worlds**: Server caching + React state management

---

### Why Redux Toolkit for Favorites?

#### ✅ **Redux Toolkit Chosen:**

1. **Global State**: Favorites need to be accessible everywhere
2. **Persistence**: Redux Persist for localStorage integration
3. **Predictable**: Single source of truth for favorites
4. **DevTools**: Time-travel debugging
5. **Type Safety**: Full TypeScript support

#### 🔄 **Why Not React Query for Favorites:**

React Query is for **server state**, favorites are **client state**:
- Favorites are user-specific local data
- Don't need server synchronization
- Need to persist across sessions
- Redux Persist handles localStorage automatically

---

### Why ShadCN UI instead of Material-UI?

#### ✅ **ShadCN UI Chosen:**

1. **Copy-Paste Components**: You own the code, not a dependency
2. **Tailwind Integration**: Perfect match with our CSS framework
3. **Customizable**: Full control over styling
4. **Lightweight**: Only include components you use
5. **Modern Design**: Clean, accessible components

#### ❌ **Why Not Material-UI:**

- Heavy bundle size
- Harder to customize
- Not Tailwind-friendly
- More opinionated design

---

## 📁 Project Structure

```
digiflux/
├── app/                          # Next.js App Router
│   ├── api/
│   │   └── auth/[...nextauth]/  # NextAuth API routes
│   ├── movie/[id]/              # Movie detail page (dynamic route)
│   ├── search/                  # Search results page
│   ├── favorites/               # Favorites page (protected)
│   ├── layout.tsx               # Root layout with providers
│   ├── page.tsx                 # Home page
│   └── globals.css              # Global styles
│
├── components/                   # React components
│   ├── providers/               # Context providers
│   │   ├── QueryProvider.tsx   # React Query setup
│   │   ├── ReduxProvider.tsx   # Redux store provider
│   │   └── SessionProvider.tsx # NextAuth session
│   ├── ui/                      # ShadCN UI components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── dialog.tsx
│   │   ├── carousel.tsx
│   │   └── ...
│   ├── FavoriteButton.tsx       # Favorite toggle with auth
│   ├── Header.tsx               # Sticky navigation header
│   ├── MovieCard.tsx            # Vertical movie card (grid)
│   ├── MovieListCard.tsx        # Horizontal movie card (search)
│   ├── MovieCarousel.tsx        # Movie carousel component
│   ├── SearchBar.tsx            # Search input component
│   └── ...
│
├── lib/                         # Utilities and configuration
│   ├── store/                   # Redux store
│   │   ├── store.ts            # Store configuration
│   │   ├── favoritesSlice.ts   # Favorites reducer
│   │   └── hooks.ts            # Typed Redux hooks
│   ├── hooks/                   # Custom React hooks
│   │   └── useMovies.ts        # React Query hooks
│   ├── auth.ts                  # NextAuth configuration
│   ├── tmdb.ts                  # TMDB API functions
│   ├── types.ts                 # TypeScript types
│   └── utils.ts                 # Utility functions
│
├── public/                      # Static assets
├── types/                       # Global type declarations
│   └── next-auth.d.ts          # NextAuth type extensions
├── .env.local                   # Environment variables (not committed)
├── .env.example                 # Environment template
├── next.config.ts               # Next.js configuration
├── tailwind.config.ts           # Tailwind CSS configuration
├── tsconfig.json                # TypeScript configuration
└── package.json                 # Dependencies and scripts
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18+ installed
- **npm** or **yarn** package manager
- **TMDB API Key** (free from [TMDB](https://www.themoviedb.org/settings/api))
- **Google OAuth Credentials** (from [Google Cloud Console](https://console.cloud.google.com/))

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/digiflux.git
   cd digiflux
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   Then edit `.env.local` with your actual API keys (see [Environment Setup](#-environment-setup))

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

---

## 🔐 Environment Setup

### 1. Create `.env.local` file

Create a `.env.local` file in the root directory:

```env
# TMDB API
NEXT_PUBLIC_TMDB_API_KEY=your_tmdb_api_key_here
NEXT_PUBLIC_TMDB_BASE_URL=https://api.themoviedb.org/3
NEXT_PUBLIC_TMDB_IMAGE_BASE_URL=https://image.tmdb.org/t/p
NEXT_PUBLIC_TMDB_BEARER_TOKEN=your_tmdb_bearer_token_here

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret_here

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here
```

### 2. Get TMDB API Key

1. Sign up at [TMDB](https://www.themoviedb.org/signup)
2. Go to **Settings** → **API**
3. Request an API key (choose "Developer")
4. Copy your **API Key (v3 auth)** to `NEXT_PUBLIC_TMDB_API_KEY`
5. Copy your **API Read Access Token (v4 auth)** to `NEXT_PUBLIC_TMDB_BEARER_TOKEN`

### 3. Get Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable **Google+ API** or **Google People API**
4. Go to **Credentials** → **Create Credentials** → **OAuth client ID**
5. Configure OAuth consent screen:
   - App name: "DigiFlux"
   - User support email: Your email
   - Developer contact: Your email
6. Create **OAuth 2.0 Client ID**:
   - Application type: **Web application**
   - Authorized redirect URIs: `http://localhost:3000/api/auth/callback/google`
7. Copy **Client ID** to `GOOGLE_CLIENT_ID`
8. Copy **Client Secret** to `GOOGLE_CLIENT_SECRET`

### 4. Generate NextAuth Secret

Run this command:
```bash
openssl rand -base64 32
```
Copy the output to `NEXTAUTH_SECRET`

### 5. Example `.env.local` File

See [.env.example](.env.example) for a complete template.

---

## 📜 Available Scripts

```bash
# Development
npm run dev          # Start development server (http://localhost:3000)

# Production
npm run build        # Build for production
npm start            # Start production server

# Code Quality
npm run lint         # Run ESLint
npm run type-check   # TypeScript type checking (if configured)
```

---

## ⚡ Caching Strategy

DigiFlux implements a sophisticated **dual-layer caching system** for optimal performance:

### Layer 1: Next.js Server Cache (1 Hour)

All TMDB API requests are cached at the server level:

```typescript
// lib/tmdb.ts
const response = await fetch(url, {
  next: { revalidate: 3600 }, // 1 hour cache
});
```

**Benefits:**
- ✅ Reduces API calls to TMDB
- ✅ Faster server-side rendering
- ✅ Respects TMDB rate limits (40 req/10s)

### Layer 2: React Query Client Cache (1 Minute Stale)

Client-side caching with React Query:

```typescript
// components/providers/QueryProvider.tsx
staleTime: 60 * 1000,         // 1 minute fresh
refetchOnWindowFocus: false,  // Don't refetch on tab switch
```

**Benefits:**
- ✅ Instant page navigation
- ✅ Background refetching
- ✅ Automatic deduplication
- ✅ Shared cache across components

### Cache Flow Example

```
User Opens Home Page
     ↓
React Query checks cache → MISS
     ↓
Calls Next.js API → Checks server cache → MISS
     ↓
Fetches from TMDB → Caches in Next.js (1h) → Returns data
     ↓
React Query caches (1m stale) → Renders UI

---

User Navigates Away & Returns (< 1 minute)
     ↓
React Query checks cache → HIT ✅
     ↓
Instant render (no API call)

---

User Returns After 2 Minutes
     ↓
React Query cache is stale
     ↓
Shows stale data immediately (instant!)
     ↓
Refetches in background → Next.js cache HIT ✅
     ↓
Updates UI with fresh data (from server cache, not TMDB)
```

### Cache Invalidation

Caches are automatically invalidated:
- **Server**: After 1 hour (Next.js revalidation)
- **Client**: After 1 minute (marked stale, refetches in background)
- **Manual**: On page refresh (Ctrl+R)

---

## ⚠️ Known Issues

### 1. **Google OAuth Setup Required**
- **Issue**: Login functionality requires Google OAuth credentials
- **Impact**: Cannot save favorites without login
- **Workaround**: Browse movies without authentication
- **Fix**: Set up Google OAuth as described in [Environment Setup](#-environment-setup)

### 2. **TMDB API Rate Limits**
- **Issue**: TMDB free tier has 40 requests per 10 seconds
- **Impact**: Heavy usage might hit rate limits
- **Mitigation**: Dual caching system reduces API calls significantly
- **Solution**: Already implemented (server + client caching)

### 3. **Image Loading on Slow Connections**
- **Issue**: Movie posters may load slowly on 2G/3G
- **Impact**: Delayed visual feedback
- **Current**: Next.js Image component with lazy loading
- **Future**: Progressive image loading, blur placeholders

### 4. **No Offline Support**
- **Issue**: App requires internet connection
- **Impact**: No functionality when offline
- **Future**: Service Worker + PWA implementation

### 5. **Search History Not Saved**
- **Issue**: Search queries are not persisted
- **Impact**: Users need to re-type searches
- **Future**: Local storage for recent searches

---

## 🚧 Future Work

### Short-term Improvements

#### Features
- [ ] **Advanced Filters**: Genre, year, rating filters on search
- [ ] **Sort Options**: Sort by popularity, rating, release date
- [ ] **Movie Trailers**: Embed YouTube trailers in detail page
- [ ] **Similar Movies**: Recommendations on detail page
- [ ] **User Reviews**: Display TMDB user reviews
- [ ] **Watch Providers**: Show where to watch (Netflix, Amazon, etc.)

#### UX Enhancements
- [ ] **Dark/Light Mode Toggle**: Theme switcher
- [ ] **Keyboard Shortcuts**: Navigate with keyboard
- [ ] **Breadcrumbs**: Navigation breadcrumbs
- [ ] **404 Page**: Custom error page
- [ ] **Loading Transitions**: Page transitions
- [ ] **Search History**: Recent searches dropdown

#### Technical Improvements
- [ ] **PWA Support**: Offline capability
- [ ] **Service Worker**: Background sync
- [ ] **Image Optimization**: WebP format, blur placeholders
- [ ] **Code Splitting**: Route-based code splitting
- [ ] **Bundle Analysis**: Optimize bundle size
- [ ] **E2E Tests**: Playwright or Cypress tests

### Long-term Vision

#### Social Features
- [ ] **User Profiles**: Custom user profiles
- [ ] **Share Favorites**: Share favorite lists
- [ ] **Movie Lists**: Create custom movie lists
- [ ] **Comments**: User comments on movies
- [ ] **Ratings**: User ratings integration

#### Advanced Search
- [ ] **Voice Search**: Speech-to-text search
- [ ] **Image Search**: Search by movie poster
- [ ] **Natural Language**: "Show me action movies from 2020"
- [ ] **Autocomplete**: Search suggestions

#### Analytics
- [ ] **View History**: Track watched movies
- [ ] **Recommendations**: AI-powered recommendations
- [ ] **Watch Time Tracking**: Personal statistics
- [ ] **Genre Preferences**: Personalized preferences

#### Platform Expansion
- [ ] **Mobile Apps**: React Native apps
- [ ] **TV Shows**: Expand beyond movies
- [ ] **Multiple APIs**: Integrate IMDb, Rotten Tomatoes
- [ ] **Multi-language**: i18n support

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Development Guidelines

- Follow existing code style
- Write TypeScript for all new code
- Add comments for complex logic
- Test your changes thoroughly
- Update README if adding new features

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **TMDB** - The Movie Database for the API
- **ShadCN UI** - Beautiful component library
- **Vercel** - Next.js framework and hosting
- **TanStack** - React Query for data fetching
- **Redux Team** - State management tools

---

## 📞 Support

For support, email your-email@example.com or open an issue on GitHub.

---

## 🌟 Star History

If you find this project helpful, please give it a ⭐!

---

**Built with ❤️ using Next.js, TypeScript, and modern web technologies**
