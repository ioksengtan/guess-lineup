import {
  POOL_MAX,
  POOL_MIN,
  SLOT_MAX,
  SLOT_MIN,
  type GameSettings,
  type PlayMode,
} from '../types.ts'

type SetupScreenProps = {
  settings: GameSettings
  onChange: (next: GameSettings) => void
  onStart: () => void
}

export function SetupScreen({ settings, onChange, onStart }: SetupScreenProps) {
  const invalid = settings.poolSize < settings.slots

  const setSlots = (slots: number) => {
    const next = clamp(slots, SLOT_MIN, SLOT_MAX)
    onChange({
      ...settings,
      slots: next,
      poolSize: Math.max(settings.poolSize, next),
    })
  }

  const setPoolSize = (poolSize: number) => {
    const next = clamp(poolSize, POOL_MIN, POOL_MAX)
    if (next < settings.slots) return
    onChange({ ...settings, poolSize: next })
  }

  const setMode = (mode: PlayMode) => {
    onChange({ ...settings, mode })
  }

  return (
    <main className="screen screen--setup">
      <header className="hero">
        <p className="eyebrow">首發題材 · 橘色飲料架</p>
        <h1>橘架猜排列</h1>
        <p className="lede">
          把牌庫拖到空位排出隱藏排列。送出後只會告訴你有幾個位置全對——對了哪一格不會說。愈快排對分數愈好。
        </p>
      </header>

      <section className="panel" aria-label="遊戲設定">
        <Stepper
          label="格數"
          value={settings.slots}
          min={SLOT_MIN}
          max={SLOT_MAX}
          onChange={setSlots}
        />
        <Stepper
          label="牌庫種類"
          value={settings.poolSize}
          min={Math.max(POOL_MIN, settings.slots)}
          max={POOL_MAX}
          onChange={setPoolSize}
        />
        {settings.poolSize === 8 && (
          <p className="hint">第 8 種是標示 P1 的占位牌。</p>
        )}

        <fieldset className="mode-field">
          <legend>模式</legend>
          <div className="mode-toggle" role="group">
            <button
              type="button"
              className={settings.mode === 'solo' ? 'is-active' : ''}
              onClick={() => setMode('solo')}
            >
              單人
            </button>
            <button
              type="button"
              className={settings.mode === 'versus' ? 'is-active' : ''}
              onClick={() => setMode('versus')}
            >
              對戰
            </button>
          </div>
          <p className="hint">
            {settings.mode === 'versus'
              ? '同一支裝置、同一題。A 做完後交給 B，比誰比較快。'
              : '自己對時計，排對就結束。'}
          </p>
        </fieldset>
      </section>

      <button
        type="button"
        className="btn btn--primary btn--block"
        disabled={invalid}
        onClick={onStart}
      >
        開始
      </button>
    </main>
  )
}

function Stepper({
  label,
  value,
  min,
  max,
  onChange,
}: {
  label: string
  value: number
  min: number
  max: number
  onChange: (n: number) => void
}) {
  return (
    <div className="stepper">
      <span className="stepper__label">{label}</span>
      <div className="stepper__ctrl">
        <button
          type="button"
          aria-label={`減少${label}`}
          disabled={value <= min}
          onClick={() => onChange(value - 1)}
        >
          −
        </button>
        <span className="stepper__value">{value}</span>
        <button
          type="button"
          aria-label={`增加${label}`}
          disabled={value >= max}
          onClick={() => onChange(value + 1)}
        >
          +
        </button>
      </div>
    </div>
  )
}

function clamp(n: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, n))
}
