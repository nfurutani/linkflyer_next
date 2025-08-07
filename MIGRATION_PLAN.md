# LinkFlyer Next.js - 音楽プレイヤー最優先実装計画

## 🎯 最重要機能
**Two Player Architecture、Global Modal、Global MiniPlayer、Local Modalによる完全な音楽再生システム**

## 現状分析

### ✅ 既に実装済みの資産（活用する）
1. **基本的なTwoPlayerProvider** (181行) - React版の簡略版だが基盤として使える
2. **GlobalMiniPlayer/GlobalModal** - UIは実装済み、状態管理の統合が必要
3. **SoundCloudPlayerV3SingleTwo** (180行) - 基本機能は動作、高度な機能追加が必要
4. **CSS完全移植済み** (937行) - React版と同一のスタイル

### ❌ 不足している重要機能
1. **iframe直接管理システム** - React版のようなプレイヤー削除・切り替えロジック
2. **Local Modal機能** - 個別トラックのモーダル表示
3. **グローバル/ローカル状態同期** - 複雑なイベント処理
4. **ドラッグ操作** - プログレスバーのタッチ/マウス操作
5. **Safari autoplay対策** - initializeAndPlay機能

## 実装計画（大規模リファクタリング回避）

### Phase 0: TwoPlayerContext強化（最優先）
**目標**: React版の機能を段階的に追加（破壊的変更を避ける）

#### Step 1: TwoPlayerProviderの拡張
```typescript
// 既存のProviderに以下を追加：
- iframe管理Map (playersRef)
- プレイヤー削除ロジック (markPlayerAsPlayed)
- グローバル/ローカルモーダル状態
- イベントリスナー統合
```

**作業内容**:
1. `/src/components/providers/TwoPlayerProvider.tsx`を拡張
   - React版の`playersRef.current = new Map<string, PlayerData>()`追加
   - `markPlayerAsPlayed`でプレイヤー削除処理実装
   - `localModalOpen`状態追加
   - `globalModalVisible`/`globalMiniPlayerVisible`追加

#### Step 2: SoundCloudPlayerV3SingleTwoの完全実装
```typescript
// 既存コンポーネントに追加：
- Local Modal機能
- ドラッグ操作
- Safari対策
- グローバル状態同期
```

**作業内容**:
1. `/src/components/audio/SoundCloudPlayerV3SingleTwo.tsx`を拡張
   - `showModal`状態でLocal Modal実装
   - `seekToPosition`、`handleProgressTouchStart`追加
   - `initializeAndPlay` Safari対策追加
   - TwoPlayerContextとの統合強化

#### Step 3: GlobalMiniPlayer/GlobalModalの統合
```typescript
// 既存のグローバルコンポーネントを接続：
- TwoPlayerContextのグローバル状態と同期
- クロスページ再生維持
- モーダル切り替えロジック
```

**作業内容**:
1. GlobalMiniPlayerをTwoPlayerContextと完全統合
2. GlobalModalをグローバル状態で制御
3. Local ModalとGlobal Modalの切り替え処理

### Phase 1: UserProfilePageでの統合テスト
**目標**: 実際のページで全機能が動作することを確認

1. Two Player方式でのトラック切り替え確認
2. Local Modal → Global Modal遷移確認
3. ページ遷移時の再生維持確認
4. Safari対応確認

### Phase 2: 残りのページ実装（Phase 0完了後）
- HomePage
- AdminPages
- FlyerDetailPage

### Phase 3: API/データ連携（Phase 0完了後）
- Supabase統合
- 認証フロー
- データ永続化

## 実装の優先順位

### 🔴 最優先（Phase 0）
1. **TwoPlayerProvider拡張** - iframe管理、プレイヤー削除
2. **Local Modal実装** - SoundCloudPlayerV3SingleTwoに追加
3. **グローバル状態同期** - Mini Player/Modal統合

### 🟡 高優先（Phase 0内）
4. **ドラッグ操作** - プログレスバー機能
5. **Safari対策** - initializeAndPlay
6. **イベント処理** - プレイヤー削除イベント

### 🟢 中優先（Phase 1以降）
7. ページ実装
8. API連携
9. 認証機能

## 成功の定義
✅ React版と同等の音楽再生機能が動作する
✅ Two Player Architectureが正常に機能する
✅ Global/Local Modalが適切に切り替わる
✅ ページ遷移時も音楽が途切れない
✅ Safariで自動再生が可能

## リスク回避策
1. **段階的実装**: 既存コードを壊さず、機能を追加していく
2. **型安全性維持**: TypeScriptの型定義を活用
3. **テスト駆動**: 各機能追加後に動作確認
4. **React版参照**: 実装に迷ったらReact版のコードを参照

## 推定工数
- Phase 0: 8-12時間（最重要機能の完全実装）
- Phase 1: 2-4時間（統合テスト・調整）
- Phase 2-3: 4-6時間（残りの機能）

**合計**: 14-22時間

## 次のアクション
1. TwoPlayerProvider.tsxのバックアップ作成
2. React版TwoPlayerContextの必要な機能を段階的に移植
3. SoundCloudPlayerV3SingleTwoにLocal Modal追加
4. 動作確認とデバッグ