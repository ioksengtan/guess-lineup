type HandoffScreenProps = {
  onContinue: () => void
}

export function HandoffScreen({ onContinue }: HandoffScreenProps) {
  return (
    <main className="screen screen--handoff">
      <p className="eyebrow">對戰</p>
      <h1>請交給下一位</h1>
      <p className="lede">
        玩家 A 已完成。畫面已清空，答案與題目種子不變。請把裝置交給玩家
        B，再開始計時。
      </p>
      <button type="button" className="btn btn--primary btn--block" onClick={onContinue}>
        玩家 B 開始
      </button>
    </main>
  )
}
