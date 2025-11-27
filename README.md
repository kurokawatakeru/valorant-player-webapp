# VALORANT Player Analytics (VPA)

VALORANTプロプレイヤーのパフォーマンスデータを可視化し、統計分析を提供するWebアプリケーションです。

## デザインコンセプト

**8-bitレトロゲームスタイル** - サイバーパンク風のネオンカラーとピクセルアートを組み合わせたユニークなビジュアルデザイン。

- ピクセルフォント (Press Start 2P / DotGothic16)
- ネオンカラーパレット (レッド、シアン、イエロー、マゼンタ)
- ピクセルボーダーとドロップシャドウ効果
- ダークテーマベース

## 主要機能

### 選手データ分析
- **パフォーマンス推移**: ACS、K/D、HS%の時系列グラフ
- **エージェント統計**: 使用率と各エージェントでの成績
- **マップ別統計**: マップごとの勝率とパフォーマンス
- **キャリア履歴**: チーム移籍履歴と各期間の成績

### 選手比較機能
- 2人の選手を並べて統計比較
- ACS、K/D、HS%、勝率などの指標を可視化

### 検索・フィルター
- 選手名・チーム名での検索
- 国別フィルタリング
- チーム別フィルタリング
- ソート機能 (名前順、チーム順、国順)

### パフォーマンス最適化
- **APIキャッシュ**: 5分間のTTLでレスポンスをキャッシュ
- **コード分割**: React.lazyによる遅延ローディング
- **メモ化**: React.memoとuseMemoによる再レンダリング最適化

## 技術スタック

- **フレームワーク**: React 18 + TypeScript
- **ビルドツール**: Vite
- **スタイリング**: Tailwind CSS
- **グラフ**: Chart.js + react-chartjs-2
- **ルーティング**: React Router v6
- **API**: vlr.orlandomm.net API

## ファイル構成

```
valorant-player-webapp/
├── public/                    # 静的アセット
├── src/
│   ├── api/
│   │   └── apiService.ts      # API連携 + キャッシュ機能
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Header.tsx     # ナビゲーションヘッダー
│   │   │   ├── Footer.tsx     # フッター
│   │   │   └── PageLoadingFallback.tsx
│   │   └── ErrorBoundary.tsx  # エラーハンドリング
│   ├── pages/
│   │   ├── HomePage.tsx       # ホームページ
│   │   ├── PlayersListPage.tsx # 選手一覧
│   │   ├── PlayerDetailPage.tsx # 選手詳細
│   │   ├── ComparePage.tsx    # 選手比較
│   │   ├── TeamsListPage.tsx  # チーム一覧
│   │   └── TeamDetailPage.tsx # チーム詳細
│   ├── types/
│   │   └── index.ts           # TypeScript型定義
│   ├── App.tsx                # ルートコンポーネント
│   ├── index.css              # グローバルスタイル
│   └── main.tsx               # エントリーポイント
├── index.html                 # HTMLテンプレート (ピクセルフォント読み込み)
├── tailwind.config.js         # Tailwind設定 (カスタムフォント)
├── package.json
├── tsconfig.json
└── vite.config.ts
```

## セットアップ

```bash
# 依存関係のインストール
npm install

# 開発サーバーの起動
npm run dev

# 本番ビルド
npm run build

# プレビュー
npm run preview
```

開発サーバーは http://localhost:5173 で起動します。

## API キャッシュ

APIレスポンスは5分間キャッシュされます。キャッシュをクリアするには：

```typescript
import { clearApiCache } from './api/apiService';
clearApiCache();
```

## デプロイ

### 推奨プラットフォーム
1. **Vercel** - 継続的デプロイ、プレビュー環境
2. **Netlify** - サーバーレス関数対応
3. **GitHub Pages** - シンプルな静的ホスティング

### ビルド出力
`dist` ディレクトリに生成されます。

## 注意事項

- このサイトはRiot Gamesの公式サイトではありません
- Riot Gamesが承認または支援するものではありません
- VALORANT is a trademark of Riot Games, Inc.

## ライセンス

MIT License
