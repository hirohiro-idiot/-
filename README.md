# My Timer Game v0.1

GitHub Pagesで動く、カスタマイズ可能なセッションタイマーです。バックエンド、APIキー、ビルド工程は不要です。

## 公開手順

1. GitHubで新しい公開リポジトリを作成（例：`my-timer-game`）。
2. ZIPを展開し、`index.html`、`style.css`、`app.js`、`config`フォルダをリポジトリの**ルート**にアップロードしてコミット。
3. リポジトリの **Settings → Pages → Build and deployment** で **Deploy from a branch** を選択。
4. Branchを **main**、Folderを **/(root)** にして **Save**。
5. 公開された `https://ユーザー名.github.io/my-timer-game/` を開く。反映には数分かかる場合があります。

## 機能

- 5〜30分のタイマー（開始、一時停止、再開、リセット）
- Easy/Normal/Hardのイベント間隔（45/25/12秒）
- ランダムイベント、直前のイベントの連続回避、次のイベントボタン
- イベント編集・端末内保存（localStorage）
- 音声読み上げ（ブラウザのSpeechSynthesis）と通知音（Web Audio）
- スマートフォン対応

## カスタマイズ

- `style.css`: 色、配置、フォント
- `config/events.json`: 初期イベントのサンプル（現在の実装では初期値は `app.js` の `DEFAULT_EVENTS` に定義されています。変更するときはそちらも編集してください）
- `config/settings.json`: 設定値のドキュメント（実際の初期値は `app.js` の `DEFAULTS` を変更）
- ブラウザ上のイベント編集は、その端末のみに保存されます。

## 注意

ブラウザがバックグラウンドにあると音声通知が抑制される場合があります。タイマーの残り時間は復帰時に実時間に基づき補正されます。保存設定はブラウザのサイトデータを消去すると失われます。公開リポジトリ内のファイルは第三者が閲覧できます。
