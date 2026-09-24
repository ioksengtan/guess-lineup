import { useRef, useState } from 'react'
import { CompareScreen } from './components/CompareScreen.tsx'
import { HandoffScreen } from './components/HandoffScreen.tsx'
import { PlayScreen } from './components/PlayScreen.tsx'
import { ResultScreen } from './components/ResultScreen.tsx'
import { SetupScreen } from './components/SetupScreen.tsx'
import { getPoolIds } from './drinks.ts'
import { createSeed, generateAnswer } from './game/generateAnswer.ts'
import { loadSettings, normalizeSettings, saveSettings } from './game/settingsStorage.ts'
import type { GameSettings } from './types.ts'

type Screen =
  | { kind: 'setup' }
  | { kind: 'playing'; player: 'solo' | 'A' | 'B'; timeA?: number }
  | { kind: 'handoff'; timeA: number }
  | { kind: 'solo_result'; elapsedMs: number }
  | { kind: 'compare'; timeA: number; timeB: number }

type Puzzle = {
  settings: GameSettings
  seed: number
  round: number
  poolIds: string[]
  answer: string[]
}

function makePuzzle(settings: GameSettings, round: number): Puzzle {
  const poolIds = getPoolIds(settings.poolSize)
  const seed = createSeed()
  return {
    settings,
    seed,
    round,
    poolIds,
    answer: generateAnswer(seed, settings.slots, poolIds),
  }
}

export default function App() {
  const [settings, setSettings] = useState<GameSettings>(() => loadSettings())
  const [puzzle, setPuzzle] = useState<Puzzle | null>(null)
  const [screen, setScreen] = useState<Screen>({ kind: 'setup' })
  const roundRef = useRef(0)

  const changeSettings = (next: GameSettings) => {
    const safe = normalizeSettings(next)
    setSettings(safe)
    saveSettings(safe)
  }

  const startGame = (nextSettings: GameSettings) => {
    const safe = normalizeSettings(nextSettings)
    roundRef.current += 1
    setPuzzle(makePuzzle(safe, roundRef.current))
    setScreen({
      kind: 'playing',
      player: safe.mode === 'versus' ? 'A' : 'solo',
    })
  }

  const replay = () => startGame(puzzle?.settings ?? settings)

  const goSetup = () => {
    setScreen({ kind: 'setup' })
    setPuzzle(null)
  }

  if (screen.kind === 'setup') {
    return (
      <div className="app">
        <SetupScreen
          settings={settings}
          onChange={changeSettings}
          onStart={() => startGame(settings)}
        />
      </div>
    )
  }

  if (screen.kind === 'handoff') {
    return (
      <div className="app">
        <HandoffScreen
          onContinue={() =>
            setScreen({ kind: 'playing', player: 'B', timeA: screen.timeA })
          }
        />
      </div>
    )
  }

  if (screen.kind === 'solo_result') {
    return (
      <div className="app">
        <ResultScreen
          elapsedMs={screen.elapsedMs}
          onReplay={replay}
          onSetup={goSetup}
        />
      </div>
    )
  }

  if (screen.kind === 'compare') {
    return (
      <div className="app">
        <CompareScreen
          timeA={screen.timeA}
          timeB={screen.timeB}
          onReplay={replay}
          onSetup={goSetup}
        />
      </div>
    )
  }

  if (!puzzle) {
    return (
      <div className="app">
        <SetupScreen
          settings={settings}
          onChange={changeSettings}
          onStart={() => startGame(settings)}
        />
      </div>
    )
  }

  return (
    <div className="app">
      <PlayScreen
        key={`${puzzle.round}-${screen.player}`}
        player={screen.player}
        slots={puzzle.settings.slots}
        poolIds={puzzle.poolIds}
        answer={puzzle.answer}
        onRestartSetup={goSetup}
        onSolved={(elapsedMs) => {
          if (screen.player === 'solo') {
            setScreen({ kind: 'solo_result', elapsedMs })
            return
          }
          if (screen.player === 'A') {
            setScreen({ kind: 'handoff', timeA: elapsedMs })
            return
          }
          setScreen({
            kind: 'compare',
            timeA: screen.timeA ?? elapsedMs,
            timeB: elapsedMs,
          })
        }}
      />
    </div>
  )
}
