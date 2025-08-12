# LinkFlyer Next.js - Admin System Implementation (React版忠実移植)

## 🎯 Project Goal
linkflyer_reactのadmin機能をNext.js 14 App Routerで**100%忠実に再現**する  
**重要**: Profileページ（public profile）は一切変更しない

## 📋 React版分析結果 - 実際の仕様

### Admin Pages（5ページ）
1. **AdminDashboard** (`/admin`) - プロファイル概要 + ナビゲーション
2. **AdminEdit** (`/admin/edit`) - プロファイル編集
3. **AdminSocial** (`/admin/social`) - ソーシャルリンク管理  
4. **AdminAudio** (`/admin/audio`) - SoundCloudトラック管理
5. **AdminFlyers** (`/admin/flyers`) - フライヤー管理

### Authentication System
- **AuthPage** - Email/Password認証
- **ProtectedRoute Component** - admin routes保護
- **自動リダイレクト**: 未認証 → `/auth`, 認証済み → `/admin`

## 🏗️ 実際のファイル構造（React版ベース）

### Pages Structure
```
src/pages/admin/
├── AdminDashboard.tsx    # 166行 - ダッシュボード
├── AdminEdit.tsx         # 287行 - プロファイル編集
├── AdminSocial.tsx       # 777行 - ソーシャルリンク管理
├── AdminAudio.tsx        # 大規模 - オーディオ管理
└── AdminFlyers.tsx       # 139行 - フライヤー管理

AuthPage.tsx              # 99行 - 認証ページ
```

### Next.js版での対応構造
```
app/admin/
├── layout.tsx           # 認証保護 (ProtectedRoute相当)
├── page.tsx            # AdminDashboard移植
├── edit/page.tsx       # AdminEdit移植
├── social/page.tsx     # AdminSocial移植
├── audio/page.tsx      # AdminAudio移植
└── flyers/page.tsx     # AdminFlyers移植

app/auth/page.tsx       # AuthPage移植
middleware.ts           # ルート保護
```

## 📄 Page-by-Page 実装仕様（React版準拠）

### 1. AdminDashboard (`/admin`)

**実際のUI構造**:
- 固定ヘッダー (`z-30`, 120px padding-top)
- プロファイルプレビューカード (中央寄せ、画像・名前・bio)
- 4つのナビゲーションカード (3列グリッド、モバイル1列)
- Sign Outボタン (ヘッダー右上)

**実際の機能**:
- プロファイル自動作成 (初回訪問時、PGRST116エラーハンドリング)
- パブリックプロファイルリンク (`window.open`)
- 各管理ページへのナビゲーション

**実際のスタイリング**:
- `max-w-7xl`, `bg-gray-100`, Purple-600テーマ
- カードホバー効果、矢印アイコン付き

### 2. AdminEdit (`/admin/edit`)

**実際のUI構造**:
- 戻るボタン付きヘッダー
- プロファイル画像アップロード (プレビュー、変更、削除)
- 3つの入力フィールド: username, display_name, bio
- 文字数カウンター (bio用)

**実際の機能**:
- Supabase Storageへの画像アップロード
- 古い画像の自動削除
- 1MB画像サイズ制限
- ファイルタイプ検証
- フォームバリデーション

**実装詳細**:
- `profile-images` bucket使用
- `${user.id}-${Date.now()}.${fileExt}` ファイル命名
- 確認ダイアログ付き削除機能

### 3. AdminSocial (`/admin/social`)

**実際のプラットフォーム**:
11プラットフォーム (React版line 7-19で確認):
- Instagram, Threads, TikTok, X (username型)
- Facebook, YouTube, Discogs, Bandcamp, SoundCloud, Website (URL型)  
- Email (email型)

**実際のUI構造**:
- SVG動的読み込み (`/svg/${platform.id}.svg`)
- ドラッグ&ドロップ (Touch対応)
- レスポンシブモーダル (モバイル: bottomsheet)
- アクティブ/非アクティブ切り替え

**実際の機能**:
- 既存データから `SocialLink[]` 配列変換
- データベース保存時の逆変換
- プラットフォーム別入力検証
- ドラッグによる並び替え

**重要な実装詳細**:
```typescript
// React版のactivate/deactivate仕組み (line 193-198)
const handleToggleActive = async (index: number) => {
  const updated = [...socialLinks];
  updated[index] = { ...updated[index], active: !updated[index].active };
  setSocialLinks(updated);
  await saveLinksToDatabase(updated);
};
```

### 4. AdminAudio (`/admin/audio`)

**実際の機能**:
- SoundCloud URL入力・検証
- oEmbed APIによるメタデータ取得
- 重複URL検出 (正規化比較)
- ドラッグ&ドロップ並び替え
- アートワーク自動取得
- ショップリンク編集

**React版で確認した詳細**:
- `audio`テーブル使用 (不是 `links`)
- `normalizeUrl`関数 (クエリパラメータ除去)
- モバイル用テキスト短縮
- Touch対応ドラッグ
- 確認モーダル付きトラック追加

**API連携**:
- `isValidSoundCloudUrl` バリデーション
- `getSoundCloudTrackInfo` oEmbed取得
- CORS proxy経由 (AllOrigins等)

### 5. AdminFlyers (`/admin/flyers`)

**実際の機能**:
- フライヤー一覧表示
- ソフト削除 (`deleted_at` + `active: false`)
- Storage画像削除
- 確認ダイアログ

**実装状況**:
- アップロード機能は "Coming Soon" プレースホルダー
- 削除機能のみ実装済み
- グリッド表示、レスポンシブ対応

### 6. AuthPage (`/auth`)

**実際のUI・機能**:
- Email/Password認証フォーム
- Sign In / Sign Up切り替え
- エラーメッセージ表示
- 認証成功時の `/admin` リダイレクト
- Purple-600テーマ

## 🔧 Technical Implementation Details

### Database Schema (既存使用)
```sql
-- profilesテーブル
profiles: user_id, username, display_name, bio, profile_image, 
          instagram_username, x_username, youtube_url, threads_username, 
          soundcloud_url, tiktok_username, bandcamp_url, discogs_url, 
          facebook_url, website_url, email_address

-- audioテーブル  
audio: id, user_id, url, title, artist, image_url, shop_link, order, active

-- flyersテーブル
flyers: id, user_id, image_url, title, description, event_date, venue_name, 
        venue_address, active, deleted_at
```

### Authentication Flow (React版)
```typescript
// App.tsx - ProtectedRoute パターン
const ProtectedRoute = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
      setLoading(false);
    });
  }, []);

  return user ? children : <Navigate to="/auth" />;
};
```

### State Management Pattern (React版)
- **Local State**: `useState` for UI状態
- **Supabase**: Database操作
- **No Global State**: admin機能は各ページ独立

### File Upload (React版パターン)
```typescript
// AdminEdit.tsx の画像アップロード
const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
  // 1MB制限、image/*タイプ検証
  // 古い画像削除
  // 新画像アップロード
  // publicURL取得
};
```

## 🚀 Implementation Plan

### Phase 2-1: Foundation (2 sessions) ✅
- [x] `middleware.ts` - ルート保護
- [x] `app/auth/page.tsx` - 認証ページ
- [x] `app/admin/layout.tsx` - Admin layout
- [x] Supabase Auth helpers setup

### Phase 2-2: Dashboard + Profile Edit (2 sessions) ✅
- [x] `app/admin/page.tsx` - Dashboard
- [x] `app/admin/edit/page.tsx` - Profile編集
- [x] 画像アップロード機能
- [x] フォームバリデーション

### Phase 2-3: Social Links (3 sessions) ✅
- [x] `app/admin/social/page.tsx` - Social管理
- [x] @dnd-kit ドラッグ&ドロップ
- [x] SVG動的読み込み
- [x] レスポンシブモーダル

### Phase 2-4: Audio Management (3 sessions) ✅
- [x] `app/admin/audio/page.tsx` - Audio管理  
- [x] `app/api/soundcloud/route.ts` - oEmbed proxy
- [x] トラック管理機能
- [x] ドラッグ&ドロップ並び替え

### Phase 2-5: Flyers (1 session) ✅
- [x] `app/admin/flyers/page.tsx` - Flyer管理
- [x] 削除機能のみ実装

### Phase 2-6: Testing & Polish (1 session) ✅
- [x] 全機能動作確認
- [x] TypeScript コンパイル確認
- [x] 開発サーバー動作確認

## ✅ Success Criteria

### Functional Requirements
- [ ] React版と100%同一機能
- [ ] 全デバイスでの完全動作
- [ ] 既存Supabaseテーブル使用
- [ ] **Profileページ絶対不変**

### Technical Requirements  
- [ ] Next.js 14 App Router準拠
- [ ] TypeScript strict mode
- [ ] Server/Client Components適切分離
- [ ] モバイルファースト対応

## 📊 Estimated Timeline

**Total**: **12セッション** (既存DB使用により大幅短縮)

- **Phase 2-1**: 2 sessions (Foundation)
- **Phase 2-2**: 2 sessions (Dashboard + Edit)  
- **Phase 2-3**: 3 sessions (Social Links)
- **Phase 2-4**: 3 sessions (Audio Management)
- **Phase 2-5**: 1 session (Flyers)
- **Phase 2-6**: 1 session (Testing)

## 🚨 Critical Rules

1. **React版完全準拠**: 推測・改良一切なし
2. **Profileページ絶対不変**: 明確指示なき限り一切変更禁止  
3. **事前承認必須**: React版にない機能は全て事前承認
4. **実装前確認**: 「これはReact版にありますか？」必須質問

---

**Ready to start Phase 2-1 (Foundation & Authentication) upon approval.**

この計画はlinkflyer_reactの実際のコードに基づく正確な仕様です。