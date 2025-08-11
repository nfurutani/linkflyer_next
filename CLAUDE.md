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

3. **🍎 Safari Audio再生の実装は絶対にスキップしない - CRITICAL**
   - Safari browser特有のSoundCloud Widget APIの初回再生バウンス問題
   - `initializeAndPlay`関数による初期化処理は必須実装項目
   - この実装なしではSafariで音楽プレイヤーが正常動作しない
   - React版からNext.js版への移行時に必ず含めること

4. **React版にない設定を追加する際は必ず事前承認を得る - MANDATORY**
   - linkflyer_reactリポジトリを参照し、既存の実装を確認する
   - React版にない新しいCSS設定、JavaScript機能、HTML構造を追加する場合は必ずユーザーの承認を得る
   - 特に以下の変更は要注意：
     - グローバルCSS（html, body要素への設定）
     - overflow、height、positionなどのレイアウト影響設定
     - iOS Safari特有の挙動に関わる設定
   - 承認なしに追加した場合は即座に元に戻すこと

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
├── src/
│   └── app/
│       ├── layout.tsx                      # Root layout with providers
│       ├── page.tsx                        # Home redirect page
│       ├── [username]/
│       │   ├── page.tsx                    # Dynamic user profile (Server Component)
│       │   └── ProfileClient.tsx           # Profile UI (Client Component)
│       ├── auth/
│       │   └── page.tsx                    # Authentication page (未実装)
│       ├── admin/
│       │   ├── layout.tsx                  # Admin layout with protection (未実装)
│       │   ├── page.tsx                    # Admin dashboard (未実装)
│       │   ├── edit/page.tsx               # Profile editing (未実装)
│       │   ├── social/page.tsx             # Social links management (未実装)
│       │   ├── audio/page.tsx              # Audio management (未実装)
│       │   └── flyers/page.tsx             # Flyers management (未実装)
│       ├── flyers/
│       │   └── [id]/page.tsx               # Flyer detail page (未実装)
│       ├── api/
│       │   ├── auth/[...supabase]/route.ts # Supabase auth handler (未実装)
│       │   └── soundcloud/route.ts         # SoundCloud API proxy (未実装)
│       ├── globals.css                     # Global styles
│       └── components/
│           ├── SoundCloudPlayerV3SingleTwo.tsx  # Individual track player
│           ├── GlobalMiniPlayer.tsx        # Persistent mini player
│           ├── GlobalModal.tsx             # Full-screen modal
│           ├── DebugInfo.tsx               # Debug information component
│           └── providers/
│               └── TwoPlayerProvider.tsx   # Global player state
├── lib/
│   ├── supabase/
│   │   ├── client.ts                       # Client-side Supabase
│   │   └── queries.ts                      # Database query functions
│   └── utils/
│       └── dataTransform.ts                # Data transformation utilities
├── types/
│   └── database.ts                         # Database type definitions
├── public/
│   ├── icons/                              # Social media SVG icons
│   └── iori_asano-profile.jpg              # Profile image
├── middleware.ts                           # Next.js middleware (未実装)
├── next.config.js                          # Next.js configuration
├── tailwind.config.ts                      # Tailwind configuration
├── tsconfig.json                           # TypeScript configuration
└── .env.local                              # Environment variables
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

### Phase 0: Audio実装 + 動作確認 ✅
- [x] Next.js 14 project with App Router setup
- [x] Configure TypeScript and Tailwind CSS  
- [x] TwoPlayerProvider implementation (500+ lines)
- [x] SoundCloudPlayerV3SingleTwo (600+ lines)
- [x] GlobalMiniPlayer implementation
- [x] GlobalModal implementation  
- [x] DebugInfo development tools
- [x] Safari初回再生バウンス問題の解決
- [x] Progress Barシーク機能完全実装
- [x] Cross-page navigation testing
- [x] Touch操作完全対応
- [x] Glass Morphismデザイン統一

### Phase 1: Supabase連携とプロファイルページ実装 ✅
- [x] Supabase client configuration
- [x] Database type definitions (Profile, Audio, Flyer)
- [x] Query functions (getProfileByUsername, getAudioTracksByUserId, getFlyersByUserId)
- [x] Data transformation utilities (SoundCloudTrack format)
- [x] Dynamic [username] routing implementation
- [x] ProfileClient component (Server/Client Components separation)
- [x] Audio tracks display with Supabase data
- [x] Flyers display with縦長レイアウト and オーバーレイ情報
- [x] 再生中インディケータ (音波アニメーション)
- [x] Home page redirect (/ → /naof219)

### Phase 2: 追加機能実装 (未着手)
- [ ] Admin dashboard pages
- [ ] Authentication page with Supabase Auth
- [ ] Flyer detail pages
- [ ] User profile editing functionality
- [ ] Audio/Flyer upload functionality

### Phase 3: API & Server Functions (未着手)
- [ ] SoundCloud oEmbed API proxy route
- [ ] Image upload API endpoints
- [ ] Authentication API routes
- [ ] Database query optimizations
- [ ] Edge function for auth checks

### Phase 4: Features & Optimization (未着手)
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

## 🍎 Safari Audio Playback - CRITICAL IMPLEMENTATION

### 必須実装: Safari初回再生バウンス問題の対応
SafariブラウザはSoundCloud Widget APIの初回再生時に特殊な動作を示します。Widget が完全に初期化される前に`play()`を呼ぶと、一瞬再生してすぐ停止する「bounce」現象が発生します。

### 必須実装要素（絶対にスキップ禁止）

#### 1. 状態管理の追加
```typescript
const [isInitialized, setIsInitialized] = useState(false)
const initClickedRef = useRef(false)
```

#### 2. Safari専用初期化関数
```typescript
const initializeAndPlay = useCallback(() => {
  if (!playerRef.current?.widget || !isReady || initClickedRef.current) return
  
  console.log('Initializing and playing...')
  initClickedRef.current = true
  
  // Safari対応: seekTo(0)を呼んでから再生
  playerRef.current.widget.seekTo(0)
  
  setTimeout(() => {
    playerRef.current.widget.play()
    
    // さらに少し待ってから状態をチェック
    setTimeout(() => {
      playerRef.current.widget.isPaused((paused: boolean) => {
        if (paused) {
          // まだ一時停止中なら、もう一度試す
          playerRef.current.widget.play()
        }
      })
    }, 300)
  }, 100)
}, [isReady])
```

#### 3. togglePlay関数の初回処理
```typescript
// 初回クリック時の特別処理
if (!isInitialized && !initClickedRef.current) {
  initializeAndPlay()
  return
}
```

#### 4. 状態リセット処理
- 新しいプレイヤー作成時: `setIsInitialized(false)`, `initClickedRef.current = false`
- プレイヤー削除時: 同様にリセット
- PLAY イベント時: `setIsInitialized(true)`

### 実装チェックリスト
- [x] `initClickedRef` の追加
- [x] `isInitialized` ステートの追加
- [x] `initializeAndPlay` 関数の実装
- [x] `togglePlay` での初回処理分岐
- [x] 新規プレイヤー作成時のリセット
- [x] プレイヤー削除時のリセット
- [x] PLAY イベントでの初期化完了マーク

⚠️ **警告**: この実装なしではSafariユーザーが音楽を正常に再生できません。React版からNext.js版への移行時に必ず含めること。

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

## 🎯 Phase 0 完了: Audio実装 + 動作確認
**実装完了日**: 2025-08-07  
**ステータス**: ✅ 完了済み
**最終更新日**: 2025-08-10

### 主要実装成果
1. **Safari Audio互換性**: 初回再生バウンス問題の完全解決
2. **Two Player Architecture**: React版からの完全移植
3. **Global/Local状態管理**: 重複更新問題の解決
4. **Progressive Enhancement**: SSR/CSR境界の適切な処理
5. **Glass Morphism UI**: 現代的で統一されたデザイン
6. **完全なモバイル対応**: タッチ操作の完全実装
7. **パフォーマンス最適化**: 無駄なAPI呼び出し削除
8. **デバッグシステム**: 包括的な状態監視機能

### 技術的な主要解決項目
- **Safari初回再生バウンス**: `initializeAndPlay`による確実な初期化
- **Progress Bar不具合**: グローバル/ローカル状態の完全分離
- **PLAY_PROGRESS重複**: 条件分岐による適切な更新制御
- **モバイル操作**: Touch eventsの完全対応
- **React Hooks Rules**: 全ルール準拠による安定性向上
- **Z-index管理**: 階層化UI要素の適切な配置

### React版からの改善点
- **TypeScript型安全性**: より厳密な型チェック
- **Next.js最適化**: Server/Client Componentsの適切な分離
- **UI統一性**: Glass morphismによる一貫したデザイン
- **開発体験**: 包括的なデバッグ機能
- **パフォーマンス**: Position polling最適化
- **アクセシビリティ**: より良いキーボード/タッチ対応

## 📝 2025-08-10 追加修正内容

### 1. Global Mini Player表示問題の修正
- **問題**: タブ切り替え時の初期表示不具合、スクロール時の沈み込み
- **原因**: CSS設定の不完全な移植
- **解決策**: 
  - React版の`soundcloud-miniplayer-v3`クラスを`.global-mini-player-fixed`として完全移植
  - `position: fixed !important`など、全ての重要な設定を適用
  - GPU accelerationとレンダリング最適化を追加

### 2. iOS Safari URLバー問題の解決
- **問題**: スクロール時にURLバーが自動非表示にならない
- **原因**: React版にない`height: 100%`と`overflow-x: hidden`を追加していた
- **解決策**: React版と同じシンプルな設定に戻す（bodyの`margin: 0`のみ）

### 3. Debug Info位置調整
- **問題**: Debug InfoがModalの操作を妨げていた
- **解決策**: 50px上に移動（top: 70px → 20px）

### 4. 開発ルールの追加
- **新ルール**: React版にない設定を追加する際は必ず事前承認を得る（CRITICAL RULES #4）

## 🖼️ Flyer Modal System - Multi-Modal管理

### Flyer Modal実装 (2025-08-10)
プロファイルページのフライヤー表示機能として、独立したFlyer Modalシステムを実装しました。

#### 主要機能
1. **独立したModal管理**
   - Audio系Modal（Global/Local Modal）とは完全分離
   - 専用コンポーネント: `FlyerModal.tsx`
   - ProfileClient内で状態管理

2. **Modal競合制御**
   - Global Modal表示時 → Flyer Modal自動で閉じる
   - 複数modalの同時表示を防止
   - Two Player Architectureの既存制御と統一

3. **UIデザイン**
   - Audio Local Modalと統一されたClose buttonデザイン
   - 白い角丸コンテナ、背景ぼかし効果
   - レスポンシブ対応、ESCキー/背景クリック対応

4. **フライヤー情報表示**
   - 大きなフライヤー画像表示
   - タイトル、説明文
   - イベント日付（英語形式、漢字なし）
   - 会場名、住所（絵文字なし、シンプル表示）

#### 技術実装
```typescript
// ProfileClient.tsx内での制御
const { globalModalVisible } = useTwoPlayer()

// Global Modalが開いたときにFlyer Modalを閉じる
useEffect(() => {
  if (globalModalVisible && isFlyerModalOpen) {
    console.log('Closing flyer modal because global modal opened')
    setIsFlyerModalOpen(false)
    setSelectedFlyer(null)
  }
}, [globalModalVisible, isFlyerModalOpen])
```

#### Modal階層管理
- **最優先**: Global Modal (z-index: 最高)
- **次優先**: Local Modal (Audio用)
- **その他**: Flyer Modal (Global Modalにより制御される)

この実装により、ユーザー体験を損なうことなく、複数のmodalが適切に管理されています。

## Notes
- **Phase 0・1完了**: 音楽プレイヤーシステム + Supabaseデータ連携 + プロファイルページ実装完了
- React版と100%同等の音楽再生機能とユーザー体験を実現
- Safari含む全ブラウザでの音楽プレイヤー動作確認済み
- **完全実装済み機能**:
  - SoundCloud Widget APIによる音楽再生（Two Player Architecture）
  - Supabaseからのプロファイル・オーディオ・フライヤーデータ取得
  - 動的ルーティング（/[username]）によるプロファイルページ
  - 縦長フライヤー表示とオーバーレイ情報
  - 再生中トラックの音波アニメーションインディケータ
  - Flyer Modalシステム（Audio Modalと独立管理、競合制御）
- **Phase 2以降は未着手**: 管理画面、認証、詳細ページなどの追加機能