# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Rate My Session (RMS)** - A therapist review platform built with Next.js 15.5.3 (App Router) and React 19.1.0. The application allows users to search for therapists, view profiles, leave reviews, and add new therapists to the platform.

## Development Commands

```bash
# Install dependencies
npm install

# Start development server (http://localhost:3000)
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## Architecture Overview

### Tech Stack
- **Framework**: Next.js 15.5.3 with App Router
- **UI**: React 19.1.0 + Tailwind CSS v4
- **Authentication**: JWT + Google OAuth
- **Backend**: WordPress REST API (external)
- **Styling**: Pure Tailwind CSS (no CSS-in-JS)

### Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Auth pages (login/register)
│   ├── (core)/            # Main app sections
│   │   ├── (application)/ # App features (search, profiles)
│   │   └── (corporative)/ # Corporate pages (about, feedback)
│   └── api/               # API proxy routes
├── components/            # React components
├── context/              # React Context (AuthContext, AddTherapistContext)
├── services/             # API service layer
├── config/               # Configuration (API endpoints)
└── utils/                # Utilities (transformers, helpers)
```

### Key Architectural Patterns

1. **API Proxy Pattern**: All external API calls go through Next.js API routes (`/api/*`) which proxy to WordPress backend. This hides credentials and provides consistent error handling.

2. **Service Layer**: Business logic is centralized in `src/services/`. Each service imports the API client and handles specific domain logic.

3. **Data Transformation**: WordPress API responses are transformed using utilities in `src/utils/*Transformer.js`.

4. **Authentication Flow**:
   - JWT tokens stored in localStorage
   - AuthContext provides global auth state
   - API client automatically includes Bearer token
   - Google OAuth integrated with WordPress backend

5. **Route Groups**: Uses Next.js route groups for organization without affecting URLs.

## Environment Variables

Required environment variables:
```bash
NEXT_PUBLIC_GOOGLE_CLIENT_ID  # Google OAuth client ID
BACKEND_URL                   # WordPress backend URL
USER_AUTH                     # System user for API calls
PASSWORD_AUTH                 # System password for API calls
```

## API Development

### Adding New API Endpoints

1. Add route definition to `src/config/api.js`:
```javascript
API_ROUTES.feature = {
  list: '/api/feature/list',
  detail: '/api/feature/detail'
}
```

2. Create API route in `src/app/api/feature/route.js`:
```javascript
import { getServerConfig } from '@/config/api';

export async function GET(request) {
  try {
    const config = getServerConfig();
    // Proxy to WordPress backend
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
```

3. Create service in `src/services/feature.js`:
```javascript
import { apiClient } from './api/client';
import { API_ROUTES } from '@/config/api';

export const featureService = {
  async getList() {
    return await apiClient.get(API_ROUTES.feature.list);
  }
};
```

## Component Development

### Styling Conventions
- Use Tailwind CSS classes exclusively
- Custom theme colors: Amethyst (purple) and Fern (green)
- Fonts: Outfit (headings), Poppins (body)
- Responsive design: mobile-first approach

### Common Patterns
- Form components use controlled inputs with useState
- Loading states handled locally in components
- Error messages support bilingual (Spanish/English)
- Image components use Next.js Image optimization

## Important Considerations

1. **No Testing Framework**: The project currently has no testing setup. Test manually during development.

2. **No Linting/Formatting**: No ESLint or Prettier configuration. Follow existing code style.

3. **Client-Side Route Protection**: Authentication checks happen client-side. Protected pages should verify auth status.

4. **WordPress Integration**: 
   - Uses ACF (Advanced Custom Fields) for therapist data
   - Simple JWT Login plugin for authentication
   - Custom post types for therapists and reviews

5. **Local Storage Usage**:
   - Auth tokens: `authToken`
   - Therapist drafts: `therapistDraft`
   - Clear on logout

6. **Image Handling**: External images from Google require whitelisting in `next.config.mjs`.

## Common Development Tasks

### Working with Forms
Forms typically follow this pattern:
- Controlled components with useState
- Client-side validation
- Service layer for API calls
- Error handling with bilingual messages
- Loading states during submission

### API Error Handling
- Server routes return appropriate HTTP status codes
- Client services check response.ok
- Errors are logged to console and re-thrown
- UI components handle errors with try-catch

### State Management
- Global state: React Context (Auth, AddTherapist)
- Local state: useState for component-specific data
- No Redux or other state management libraries