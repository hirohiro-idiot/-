/* 音声再生の設定：ここだけ編集してください。
   file はリポジトリ内のファイルへの相対パス。例: audio/start.mp3
   at は開始からの秒数（例: 90 = 1分30秒後）。
   enabled: false でその項目を無効化できます。
   ファイルをまだ追加していない場合は再生されません。 */
window.GAME_AUDIO = {
  enabled: true,
  volume: 0.8, // 0〜1
  onStart: null, // 例: "audio/start.mp3"（初回開始時のみ）
  onFinish: null, // 例: "audio/finish.mp3"
  onEvent: null, // 例: "audio/event.mp3"（ランダムイベント時）
  cues: [
    // { at: 30, file: "audio/voice01.mp3", enabled: true },
    // { at: 60, file: "audio/voice02.mp3", enabled: true },
    // { at: 120, file: "audio/voice03.mp3", enabled: true },
  ]
};
