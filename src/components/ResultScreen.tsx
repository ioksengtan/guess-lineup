import { formatTime } from '../game/formatTime.ts'

type ResultScreenProps = {
  elapsedMs: number
  onReplay: () => void
  onSetup: () => void
}

export function ResultScreen({ elapsedMs, onReplay, onSetup }: ResultScreenProps) {
  return (
    <main className="screen screen--result">
      <p className="eyebrow">單人結果</p>
      <h1>排對了</h1>
      <p className="score">
        <span className="score__value">{formatTime(elapsedMs)}</span>
        <span className="score__unit">秒</span>
      </p>
      <p className="lede">分數是耗時，愈低愈好。</p>
      <div className="stack-actions">
        <button type="button" className="btn btn--primary btn--block" onClick={onReplay}>
          再玩一局
        </button>
        <button type="button" className="btn btn--ghost btn--block" onClick={onSetup}>
          回設定
        </button>
      </div>
    </main>
  )
}
