import { formatTime } from '../game/formatTime.ts'

type CompareScreenProps = {
  timeA: number
  timeB: number
  onReplay: () => void
  onSetup: () => void
}

export function CompareScreen({
  timeA,
  timeB,
  onReplay,
  onSetup,
}: CompareScreenProps) {
  const winner =
    timeA < timeB ? 'A' : timeB < timeA ? 'B' : 'tie'

  return (
    <main className="screen screen--compare">
      <p className="eyebrow">對戰結果</p>
      <h1>
        {winner === 'tie' ? '平手' : winner === 'A' ? '玩家 A 勝' : '玩家 B 勝'}
      </h1>
      <ul className="compare-list">
        <li className={winner === 'A' ? 'is-winner' : ''}>
          <span>玩家 A</span>
          <strong>{formatTime(timeA)} 秒</strong>
        </li>
        <li className={winner === 'B' ? 'is-winner' : ''}>
          <span>玩家 B</span>
          <strong>{formatTime(timeB)} 秒</strong>
        </li>
      </ul>
      <p className="lede">同一題、同一種子。耗時較低者獲勝。</p>
      <div className="stack-actions">
        <button type="button" className="btn btn--primary btn--block" onClick={onReplay}>
          再比一局
        </button>
        <button type="button" className="btn btn--ghost btn--block" onClick={onSetup}>
          回設定
        </button>
      </div>
    </main>
  )
}
