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

**Note**: No testing, linting, or formatting scripts configured. Test manually and follow existing code style.

## Architecture Overview

### Tech Stack
- **Framework**: Next.js 15.5.3 with App Router
- **UI**: React 19.1.0 + Tailwind CSS v4
- **Authentication**: JWT + Google/Facebook OAuth
- **Backend**: WordPress REST API (external)
- **Styling**: Pure Tailwind CSS v4 (no CSS-in-JS)
- **Additional**: nodemailer (feedback form), jsonwebtoken, react-icons

### Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Auth pages (login/register)
│   ├── (core)/            # Main app sections
│   │   ├── (application)/ # App features (search, profiles)
│   │   └── (corporative)/ # Corporate pages (about, feedback)
│   └── api/               # API proxy routes (server-side only)
├── components/            # React components
├── context/              # React Context (AuthContext, AddTherapistContext)
├── services/             # API service layer (client-side)
│   └── api/              # API client utilities
├── config/               # Configuration (API endpoints, server config)
└── utils/                # Utilities (transformers, helpers)
```

### Key Architectural Patterns

1. **API Proxy Pattern**: All external API calls go through Next.js API routes (`src/app/api/*/route.js`) which proxy to WordPress backend. This pattern:
   - Hides WordPress credentials (uses `getServerConfig()` server-side only)
   - Provides consistent error handling with proper HTTP status codes
   - Uses Basic Auth with system credentials for WordPress API calls
   - Returns WordPress pagination headers when applicable (x-wp-total, x-wp-totalpages)

2. **Three-Layer Architecture**:
   - **API Routes** (`src/app/api/*/route.js`): Server-side, use `getServerConfig()` for credentials, proxy to WordPress
   - **Service Layer** (`src/services/*.js`): Client-side, use `apiClient` to call internal API routes, handle business logic
   - **Components**: Call services, handle UI state and rendering

3. **Data Transformation**: WordPress API responses are transformed using utilities in `src/utils/*Transformer.js`:
   - `transformTherapistData()`: Transforms WordPress posts to app format, extracts ACF fields, handles embedded media
   - `commentTransformer.js`: Transforms WordPress comments to review format
   - Transformers handle null/missing data gracefully

4. **Authentication Flow**:
   - JWT tokens stored in localStorage as `authToken`
   - `AuthContext` provides global auth state and methods (login, register, logout, loginWithGoogle, loginWithFacebook)
   - `apiClient` automatically includes Bearer token in headers when `authType: 'user'` is specified
   - WordPress uses Simple JWT Login plugin for token validation
   - Google/Facebook OAuth flows handled by dedicated API routes

5. **Route Groups**: Uses Next.js route groups `(auth)`, `(application)`, `(corporative)` for organization without affecting URLs. All routes in `(core)` group inherit the main layout.

## Environment Variables

Required `.env.local` variables:
```bash
# WordPress Backend
BACKEND_URL=http://rms-backend.local         # WordPress backend URL
USER_AUTH=username                           # System user for API calls
PASSWORD_AUTH=password                       # System password for API calls
AUTH_CODE_REGISTER=your-auth-key            # Auth key for user registration

# OAuth
NEXT_PUBLIC_GOOGLE_CLIENT_ID=xxx.apps.googleusercontent.com
NEXT_PUBLIC_FACEBOOK_APP_ID=your-facebook-app-id

# Email (for feedback form)
GMAIL_USER=your-email@gmail.com
GMAIL_APP_PASSWORD=xxxx-xxxx-xxxx-xxxx      # 16-character app password (NOT regular password)
FEEDBACK_RECIPIENT_EMAIL=recipient@example.com
```

### Facebook App Configuration

To set up Facebook Login, create a Facebook App in Meta Developer Console:

1. **Create Facebook App**:
   - Go to [Meta for Developers](https://developers.facebook.com/)
   - Click "My Apps" → "Create App"
   - Select "Consumer" as app type
   - Fill in app name and contact email

2. **Configure Facebook Login**:
   - In the app dashboard, add "Facebook Login" product
   - Go to Settings → Basic and copy your App ID
   - Add `NEXT_PUBLIC_FACEBOOK_APP_ID` to your `.env.local` file

3. **Set Valid OAuth Redirect URIs**:
   - Go to Facebook Login → Settings
   - Add your domains to "Valid OAuth Redirect URIs":
     - Development: `http://localhost:3000/`
     - Production: `https://yourdomain.com/`

4. **Configure App Domains**:
   - In Settings → Basic
   - Add your domains (without protocol):
     - `localhost` (for development)
     - `yourdomain.com` (for production)

5. **Make App Live**:
   - Toggle "App Mode" from Development to Live (when ready for production)
   - Complete App Review if requesting advanced permissions

**Permissions Used**: `public_profile`, `email`

### Gmail SMTP Configuration (Feedback Form)

The feedback form uses Gmail SMTP to send emails. Configuration required:

1. **Enable 2-Factor Authentication on Gmail**:
   - Go to [Google Account Security](https://myaccount.google.com/security)
   - Enable "2-Step Verification"

2. **Generate App Password**:
   - Go to [App Passwords](https://myaccount.google.com/apppasswords)
   - Select "Mail" and your device
   - Copy the 16-character password generated

3. **Add to Environment Variables**:
   ```bash
   GMAIL_USER=your-email@gmail.com
   GMAIL_APP_PASSWORD=xxxx-xxxx-xxxx-xxxx  # 16-character app password
   FEEDBACK_RECIPIENT_EMAIL=recipient@example.com
   ```

**Important Notes**:
- Do NOT use your regular Gmail password - use App Password only
- App Passwords only work with 2FA enabled
- The feedback form includes honeypot anti-spam protection
- Emails are sent with Reply-To header for easy user responses

## API Development

### Adding New API Endpoints

Follow this three-step pattern:

1. **Define route in `src/config/api.js`** (client-accessible):
```javascript
API_ROUTES.FEATURE = {
  LIST: '/api/feature',
  DETAIL: (id) => `/api/feature/${id}`
}
```

2. **Create API route in `src/app/api/feature/route.js`** (server-side):
```javascript
import { NextResponse } from 'next/server';
import { getServerConfig } from '@/config/api';

export async function GET(request) {
  try {
    const config = getServerConfig(); // Only works server-side
    const { searchParams } = new URL(request.url);

    // Create Basic Auth
    const authString = `${config.SYSTEM_USER}:${config.SYSTEM_PASSWORD}`;
    const basicAuth = Buffer.from(authString).toString('base64');

    // Proxy to WordPress
    const response = await fetch(`${config.WP_API_BASE}/endpoint`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${basicAuth}`
      }
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
```

3. **Create service in `src/services/feature.js`** (client-side):
```javascript
import { apiClient } from './api/client';
import { API_ROUTES } from '@/config/api';

export const featureService = {
  async getList(params) {
    return await apiClient.get(API_ROUTES.FEATURE.LIST, {
      params,
      authType: 'user' // or 'none' if no auth needed
    });
  }
};
```

### API Client Auth Types
- `authType: 'none'`: No authentication (default)
- `authType: 'user'`: Includes user JWT token from localStorage in Authorization header

## Component Development

### Styling with Tailwind CSS v4
- **Theme colors**: Defined in `src/app/globals.css` using `@theme` directive
  - Amethyst (purple): `bg-amethyst-500`, `text-amethyst-600`, etc. (50-900 scale)
  - Fern (green): `bg-fern-500`, `text-fern-600`, etc. (50-900 scale)
- **Fonts**: `font-outfit` (headings), `font-poppins` (body) - defined globally
- **Responsive design**: Mobile-first approach
- **No CSS-in-JS**: Pure Tailwind classes only

### Component Patterns
- **Forms**: Controlled inputs with `useState`, client-side validation, bilingual error messages (Spanish/English)
- **Loading states**: Handled locally in components with conditional rendering
- **Images**: Use Next.js `Image` component, external domains whitelisted in `next.config.mjs`
- **Context usage**: `useAuth()` for auth state, `useAddTherapist()` for add therapist modal state

## WordPress Integration

### Backend Structure
- **Custom Post Type**: `therapists` (custom post type in WordPress)
- **ACF Fields**: All therapist data stored as ACF fields (Address, city, state_address, zip_code, Website, credentials, Rating, category, ai_review_summary, etc.)
- **Comments**: WordPress native comments used for therapist reviews
- **Media**: WordPress media library for therapist profile photos
- **Authentication**: Simple JWT Login plugin handles token generation and validation

### Data Flow Pattern
1. **WordPress stores**: Posts (therapists), Comments (reviews), ACF fields (metadata), Media (images)
2. **API routes fetch**: Data from WordPress REST API using Basic Auth (system credentials)
3. **Transformers convert**: WordPress format → App format (e.g., `transformTherapistData()`)
4. **Components render**: Transformed data

### Key ACF Fields
- `Rating`: Numeric rating (managed by WordPress, not calculated client-side)
- `category`: Therapist specialization
- `credentials`: Stored as string, also available in `class_list` array
- `ai_review_summary`: AI-generated summary of reviews
- `ai_review_summary_useful`: Comma-separated user IDs who marked summary as useful
- `created_by`: "Therapist" or "User" (who added the therapist)

## Important Considerations

### Development Workflow
- **No testing framework**: Test manually during development
- **No linting/formatting**: Follow existing code style (no ESLint/Prettier)
- **Client-side route protection**: Auth checks happen client-side via `useAuth()` hook
- **Local storage keys**: `authToken` (JWT), `therapistDraft` (form draft data)
- **Image whitelisting**: External images require `next.config.mjs` configuration

### State Management
- **Global state**: React Context only (`AuthContext`, `AddTherapistContext`)
- **Local state**: `useState` for component-specific data
- **No Redux**: Simple Context API sufficient for this app

### API Error Handling
- **Server routes**: Return proper HTTP status codes, log errors to console
- **Client services**: Check `response.ok`, throw errors with descriptive messages
- **UI components**: Wrap service calls in try-catch, display bilingual error messages
- **Special case**: 409 Conflict (duplicate review) returns data instead of throwing

### WordPress REST API Gotchas
- Embedded data (`_embed` param): Use for featured media and replies
- Pagination headers: `x-wp-total`, `x-wp-totalpages` passed through API proxy
- Comments approval: Only approved comments returned by default
- ACF data: Available in `acf` property of post objects
