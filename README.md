# LinkFlyer Next - 音楽プレイヤー最優先実装プロジェクト

## 🚨 最重要機能
**Two Player Architecture、Global Modal、Global MiniPlayer、Local Modalによる完全な音楽再生システム**

## 📊 進捗状況サマリー

| Phase | 項目 | 進捗 | 優先度 |
|-------|------|------|--------|
| **Phase 0** | 音楽プレイヤー完全実装 | 🔴 0% | **最優先** |
| Phase 1 | 統合テスト | ⏸️ | 高 |
| Phase 2 | ページ実装 | ⏸️ | 中 |
| Phase 3 | API/データ連携 | ⏸️ | 低 |

---

## 🎯 Phase 0: 音楽プレイヤー完全実装（最優先）

### 📋 実装チェックリスト

#### Step 1: TwoPlayerProvider拡張 🔴 未着手
- [ ] iframe管理Map (`playersRef`) の追加
- [ ] プレイヤー削除ロジック (`markPlayerAsPlayed`) の実装
- [ ] `localModalOpen` 状態の追加
- [ ] `globalModalVisible`/`globalMiniPlayerVisible` の追加
- [ ] イベントリスナー統合

#### Step 2: SoundCloudPlayerV3SingleTwo完全実装 🔴 未着手
- [ ] Local Modal機能の追加
- [ ] ドラッグ操作の実装
- [ ] Safari対策 (`initializeAndPlay`) の追加
- [ ] グローバル状態同期の強化
- [ ] タッチイベント処理

#### Step 3: GlobalMiniPlayer/GlobalModal統合 🔴 未着手
- [ ] TwoPlayerContextとの完全統合
- [ ] クロスページ再生維持
- [ ] Local/Global Modal切り替え処理
- [ ] 状態同期の実装

### 🐛 既知の課題
| 課題 | 状態 | 影響度 |
|------|------|--------|
| Two Player切り替えが機能しない | 🔴 未解決 | 高 |
| Safari自動再生が動作しない | 🔴 未解決 | 高 |
| プログレスバードラッグ不可 | 🔴 未解決 | 中 |
| Local Modal未実装 | 🔴 未解決 | 高 |

---

## 📈 Phase 1: 統合テスト（Phase 0完了後）

### 📋 テスト項目
- [ ] Two Player方式でのトラック切り替え
- [ ] Local Modal → Global Modal遷移
- [ ] ページ遷移時の再生維持
- [ ] Safari対応確認
- [ ] モバイルデバイステスト

---

## 🏗️ Phase 2: ページ実装（Phase 0完了後）

### 📋 実装ページ
- [ ] HomePage
- [ ] UserProfilePage（音楽プレイヤー統合）
- [ ] AdminPages
- [ ] FlyerDetailPage
- [ ] AuthPage

---

## 🔌 Phase 3: API/データ連携（Phase 0完了後）

### 📋 実装項目
- [ ] Supabase統合
- [ ] 認証フロー
- [ ] データ永続化
- [ ] 画像アップロード
- [ ] エラーハンドリング

---

## 🎵 現在の実装状況

### ✅ 完了済み（活用する資産）
1. **基本的なTwoPlayerProvider** (181行) - 基盤として使用
2. **GlobalMiniPlayer/GlobalModal UI** - 見た目は実装済み
3. **SoundCloudPlayerV3SingleTwo基本機能** (180行) - 拡張が必要
4. **CSS完全移植** (937行) - React版と同一

### ❌ 未実装（最優先で実装）
1. **iframe直接管理システム** ⚠️ 致命的
2. **Local Modal機能** ⚠️ 致命的
3. **グローバル/ローカル状態同期** ⚠️ 致命的
4. **ドラッグ操作** 
5. **Safari autoplay対策** ⚠️ 致命的

---

## 📝 技術詳細

### Two Player Architecture
```typescript
// React版の実装（参考）
playersRef.current = new Map<string, PlayerData>()
// 最大2つのプレイヤーを交互に使用
// Safari autoplay対策として必須
```

### Modal階層
1. **Local Modal**: 各トラック固有のモーダル
2. **Global Modal**: ミニプレイヤーから開くグローバルモーダル
3. **Global MiniPlayer**: 常に表示される底部プレイヤー

### 状態管理フロー
```
SoundCloudPlayerV3SingleTwo (Local)
    ↓ markPlayerAsPlayed
TwoPlayerContext (Global State)
    ↓ sync
GlobalMiniPlayer / GlobalModal
```

---

## 🚀 次のアクション

### 今すぐ実行
1. **TwoPlayerProvider.tsxのバックアップ作成**
2. **React版TwoPlayerContextのiframe管理部分を移植開始**
3. **動作確認環境の準備**

### コマンド
```bash
# 開発サーバー起動
npm run dev

# ビルド確認
npm run build

# 型チェック
npm run type-check
```

---

## 📚 参考資料
- [CLAUDE.md](./CLAUDE.md) - プロジェクト仕様
- [MIGRATION_PLAN.md](./MIGRATION_PLAN.md) - 詳細な実装計画
- React版実装: `/tmp/linkflyer_react/`

---

## ⏰ 推定工数
- **Phase 0**: 8-12時間 🔴 最優先
- **Phase 1**: 2-4時間
- **Phase 2-3**: 4-6時間
- **合計**: 14-22時間

---

## 🎯 成功の定義
✅ React版と同等の音楽再生機能が動作する  
✅ Two Player Architectureが正常に機能する  
✅ Global/Local Modalが適切に切り替わる  
✅ ページ遷移時も音楽が途切れない  
✅ Safariで自動再生が可能  

---

*最終更新: 2025/08/08 00:45*