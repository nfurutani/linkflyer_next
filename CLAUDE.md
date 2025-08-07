# LinkFlyer Next - AI-Powered Event Profile Creator

## 🚨 CRITICAL RULES - NEVER VIOLATE 🚨
1. **事実と異なる報告は絶対にしない - NEVER**
   - 実行していない作業を「完了した」と報告しない
   - ファイルを削除していないのに「削除した」と言わない
   - 常に正確な状況を報告する

2. **各Phase完了後は必ずREADME.md更新 - ALWAYS**
   - Phase完了時は即座にREADME.mdの進捗状況を更新する
   - 完了項目を✅に変更し、次のPhaseを現在実行中に変更する
   - ユーザーに言われる前に自動的に更新すること

## Overview
LinkFlyer NextはReact版からNext.js 14 App Routerへの移行プロジェクトです。SSR/SSGの利点を活かしつつ、SoundCloud Widget APIを使用したグローバル音楽再生機能を実装し、パフォーマンスとSEOを向上させます。

## Tech Stack
- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS with mobile-first responsive design
- **Database**: Supabase PostgreSQL with Row Level Security
- **Authentication**: Supabase Auth with Next.js middleware
- **AI/ML**: Google Gemini API for image analysis (予定)
- **Geocoding**: Google Maps Places API (予定)
- **Storage**: Supabase Storage with automatic cleanup
- **Audio Playback**: SoundCloud Widget API with Two Player Architecture + Global Player System
- **PWA**: Service Worker, Web App Manifest (予定)
- **Deployment**: Vercel

## Project Structure
```
linkflyer_next/
├── app/
│   ├── layout.tsx                      # Root layout with providers
│   ├── page.tsx                        # Home page
│   ├── auth/
│   │   └── page.tsx                    # Authentication page
│   ├── admin/
│   │   ├── layout.tsx                  # Admin layout with protection
│   │   ├── page.tsx                    # Admin dashboard
│   │   ├── edit/page.tsx               # Profile editing
│   │   ├── social/page.tsx             # Social links management
│   │   ├── audio/page.tsx              # Audio management
│   │   └── flyers/page.tsx             # Flyers management
│   ├── [username]/
│   │   └── page.tsx                    # Public user profile
│   ├── flyers/
│   │   └── [id]/page.tsx               # Flyer detail page
│   ├── api/
│   │   ├── auth/[...supabase]/route.ts # Supabase auth handler
│   │   └── soundcloud/route.ts         # SoundCloud API proxy
│   └── global.css                      # Global styles
├── components/
│   ├── providers/
│   │   ├── TwoPlayerProvider.tsx       # Global player state
│   │   └── SupabaseProvider.tsx        # Supabase client provider
│   ├── audio/
│   │   ├── SoundCloudPlayerV3.tsx      # Individual track player
│   │   ├── GlobalMiniPlayer.tsx        # Persistent mini player
│   │   ├── GlobalModal.tsx             # Full-screen modal
│   │   └── TrackImage.tsx              # Track artwork component
│   ├── ui/
│   │   ├── Button.tsx                  # Reusable button
│   │   ├── Input.tsx                   # Form input
│   │   └── Modal.tsx                   # Modal wrapper
│   └── layout/
│       ├── Header.tsx                  # App header
│       └── Footer.tsx                  # App footer
├── lib/
│   ├── supabase/
│   │   ├── client.ts                   # Client-side Supabase
│   │   ├── server.ts                   # Server-side Supabase
│   │   └── middleware.ts               # Auth middleware
│   ├── utils/
│   │   └── soundcloud.ts               # SoundCloud utilities
│   └── types/
│       └── database.ts                 # Database types
├── public/
│   ├── icons/                          # Social media SVGs
│   └── manifest.json                   # PWA manifest
├── middleware.ts                       # Next.js middleware
├── next.config.js                      # Next.js configuration
├── tailwind.config.ts                  # Tailwind configuration
├── tsconfig.json                       # TypeScript configuration
└── .env.local                          # Environment variables
```

## Key Differences from React Version
1. **App Router**: Using Next.js 14 App Router instead of React Router
2. **Server Components**: Default RSC for better performance
3. **Client Components**: Strategic use with "use client" directive
4. **API Routes**: Built-in API handling for proxy endpoints
5. **Middleware**: Authentication protection at edge
6. **Image Optimization**: Next/Image for automatic optimization
7. **SEO**: Built-in metadata API for better SEO
8. **Streaming**: Progressive rendering with Suspense
9. **Environment Variables**: No prefix needed for server-side vars

## Migration Strategy

### Phase 1: Foundation Setup ✅
- [x] Create Next.js 14 project with App Router
- [x] Configure TypeScript and Tailwind CSS
- [x] Set up Supabase client/server instances
- [x] Create basic folder structure
- [x] Set up environment variables

### Phase 2: Core Components Migration
- [ ] Migrate TwoPlayerContext to Next.js provider
- [ ] Convert SoundCloudPlayer components to Client Components
- [ ] Implement GlobalMiniPlayer with persistence
- [ ] Create GlobalModal for full-screen playback
- [ ] Set up audio state management

### Phase 3: Page Migration
- [ ] Home page with SSG
- [ ] Authentication page with Supabase Auth
- [ ] User profile page with dynamic routing
- [ ] Admin dashboard with middleware protection
- [ ] Admin sub-pages (edit, social, audio, flyers)
- [ ] Flyer detail page

### Phase 4: API & Server Functions
- [ ] SoundCloud oEmbed API proxy route
- [ ] Image upload API endpoints
- [ ] Database query optimizations
- [ ] Edge function for auth checks

### Phase 5: Features & Optimization
- [ ] PWA configuration
- [ ] Service Worker setup
- [ ] Image optimization with Next/Image
- [ ] SEO metadata implementation
- [ ] Performance monitoring

## Development Commands
```bash
# Development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Type checking
npm run type-check

# Linting
npm run lint

# Format code
npm run format
```

## Environment Setup
Create `.env.local` file:
```
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Google APIs
NEXT_PUBLIC_GOOGLE_API_KEY=your-google-api-key

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Database Schema (Supabase)
Same as React version:
- **profiles**: User profile information
- **audio**: Audio tracks (renamed from 'links')
- **flyers**: Event flyers
- **storage buckets**: profile-images, flyer-images

### Row Level Security (RLS) Configuration
同じRLS設定を使用（React版のCLAUDE.mdを参照）

## Global Audio Player System in Next.js

### Architecture Adaptations
1. **Client-Only Components**: Audio players must be Client Components
2. **Provider Pattern**: TwoPlayerProvider wraps client components
3. **Hydration Safety**: Handle SSR/CSR differences carefully
4. **State Persistence**: Use localStorage for cross-page state

### Implementation Strategy
```typescript
// app/layout.tsx
import { TwoPlayerProvider } from '@/components/providers/TwoPlayerProvider'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <body>
        <TwoPlayerProvider>
          {children}
          {/* Global player components */}
          <GlobalMiniPlayer />
          <GlobalModal />
        </TwoPlayerProvider>
      </body>
    </html>
  )
}
```

### Client Component Pattern
```typescript
// components/audio/SoundCloudPlayer.tsx
'use client'

import { useEffect, useState } from 'react'
import { useTwoPlayer } from '@/hooks/useTwoPlayer'

export default function SoundCloudPlayer({ url, title }: Props) {
  // Client-side only logic
}
```

## Server Components Best Practices

### Data Fetching
```typescript
// app/[username]/page.tsx
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'

export default async function UserProfile({ 
  params 
}: { 
  params: { username: string } 
}) {
  const supabase = createServerComponentClient()
  
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('username', params.username)
    .single()
    
  return <UserProfileClient profile={profile} />
}
```

### Streaming with Suspense
```typescript
// app/[username]/page.tsx
import { Suspense } from 'react'
import AudioGrid from '@/components/AudioGrid'
import AudioGridSkeleton from '@/components/AudioGridSkeleton'

export default function UserProfile() {
  return (
    <Suspense fallback={<AudioGridSkeleton />}>
      <AudioGrid />
    </Suspense>
  )
}
```

## Middleware for Authentication
```typescript
// middleware.ts
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })
  
  const { data: { session } } = await supabase.auth.getSession()
  
  // Protect admin routes
  if (req.nextUrl.pathname.startsWith('/admin')) {
    if (!session) {
      return NextResponse.redirect(new URL('/auth', req.url))
    }
  }
  
  return res
}

export const config = {
  matcher: ['/admin/:path*']
}
```

## API Routes Pattern
```typescript
// app/api/soundcloud/route.ts
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const url = searchParams.get('url')
  
  // Proxy to SoundCloud oEmbed API
  const response = await fetch(
    `https://soundcloud.com/oembed?url=${url}&format=json`
  )
  
  const data = await response.json()
  return NextResponse.json(data)
}
```

## Performance Optimizations

### Image Optimization
```typescript
import Image from 'next/image'

<Image
  src={track.image_url}
  alt={track.title}
  width={300}
  height={300}
  loading="lazy"
  placeholder="blur"
  blurDataURL={track.blur_data_url}
/>
```

### Dynamic Imports
```typescript
import dynamic from 'next/dynamic'

const SoundCloudPlayer = dynamic(
  () => import('@/components/audio/SoundCloudPlayer'),
  { 
    loading: () => <PlayerSkeleton />,
    ssr: false 
  }
)
```

### Prefetching
```typescript
import Link from 'next/link'

<Link href={`/${username}`} prefetch>
  View Profile
</Link>
```

## SEO & Metadata
```typescript
// app/[username]/page.tsx
export async function generateMetadata({ 
  params 
}: { 
  params: { username: string } 
}) {
  const profile = await getProfile(params.username)
  
  return {
    title: `${profile.display_name} | LinkFlyer`,
    description: profile.bio,
    openGraph: {
      images: [profile.profile_image],
    },
  }
}
```

## Development Rules
**IMPORTANT**: 問題分析・解決策の合意→実装の順序を必ず守ること
1. **問題の特定**: 現在の問題・課題を明確に特定する
2. **解決策の提案**: 複数の解決案を提示し、最適な方法を検討する  
3. **実装方針の合意**: ユーザーと実装方針について合意してから実装開始
4. **実装実行**: 合意された方針に従って実装を行う

**禁止事項**: 方針合意前の実装開始は厳禁。必ずユーザーの合意を得てから実装すること。

## **🚨 CRITICAL: 完了報告の誠実性 🚨**
**NEVER LIE ABOUT IMPLEMENTATION STATUS**

### 絶対的ルール：
- **実装が不完全な場合は正直に報告します**
- **機能が簡略化されている場合は明確に説明します**
- **元の仕様と異なる場合は差分を詳細に報告します**
- **"完了"は100%完全実装の場合のみ使用します**

### 報告例：
❌ **間違い**: "全てのAudioコンポーネント実装完了"
✅ **正しい**: "Audioコンポーネントの基本機能は実装済みですが、以下が未完成です：
- 音波アニメーション（未実装）
- ドラッグ操作（未実装）
- SoundCloudPlayerV3.css（937行中200行のみ移植）
- ショップリンク統合（部分的実装）"

### 完了の定義：
- 元のReact版と**100%同じ機能**
- **100%同じ見た目**
- **100%同じユーザー体験**

この基準に満たない場合は「実装中」「部分的完成」「基本機能完成」等の正確な表現を使用する。

## Mobile-First Design Principles
- Touch targets minimum 44px
- No hover-only interactions
- Optimized for mobile gestures
- Fast loading on mobile networks
- Responsive breakpoints: 375px, 480px, 768px, 1024px
- Glass morphism effects for modern UI
- Gradient overlays for text readability
- Sound wave animations for visual feedback

## Key Technical Decisions

### Why Next.js App Router?
- **Server Components**: Better performance with zero client JS
- **Streaming**: Progressive page loading
- **SEO**: Built-in optimization for search engines
- **Edge Runtime**: Faster response times globally

### Why Keep SoundCloud Widget API?
- **Proven Solution**: Already working in React version
- **Direct Integration**: Native SoundCloud features
- **Cross-Page Persistence**: Maintains playback state

### Why Supabase?
- **Existing Data**: Reuse current database
- **RLS**: Row-level security already configured
- **Real-time**: Future real-time features
- **Storage**: Integrated file storage

## Testing Strategy
- Unit tests for utilities and hooks
- Integration tests for API routes
- E2E tests for critical user flows
- Visual regression tests for UI components

## Deployment Strategy
1. **Development**: Local development with hot reload
2. **Preview**: Vercel preview deployments for PRs
3. **Staging**: Protected staging environment
4. **Production**: Vercel production with monitoring

## Performance Metrics
- **LCP**: < 2.5s (Largest Contentful Paint)
- **FID**: < 100ms (First Input Delay)
- **CLS**: < 0.1 (Cumulative Layout Shift)
- **TTI**: < 3.8s (Time to Interactive)

## Security Considerations
- Environment variables validation
- CORS configuration for API routes
- CSP headers for XSS protection
- Rate limiting on API endpoints
- Input sanitization
- SQL injection prevention via Supabase

## Monitoring & Analytics
- Vercel Analytics for performance
- Sentry for error tracking
- Custom events for user interactions
- Database query performance monitoring

## Future Enhancements
- [ ] AI-powered flyer analysis with Gemini
- [ ] Automated event extraction from images
- [ ] Social media integration
- [ ] Analytics dashboard
- [ ] Multi-language support
- [ ] Dark mode
- [ ] Offline support with Service Worker

## Notes
- Migration focuses on maintaining feature parity first
- Performance improvements through SSR/SSG
- Better SEO for public profiles
- Improved developer experience with App Router
- All existing features from React version will be preserved