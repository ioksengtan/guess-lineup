import { useState } from 'react'
import { CompareScreen } from './components/CompareScreen.tsx'
import { HandoffScreen } from './components/HandoffScreen.tsx'
import { PlayScreen } from './components/PlayScreen.tsx'
import { ResultScreen } from './components/ResultScreen.tsx'
import { SetupScreen } from './components/SetupScreen.tsx'
import { getPoolIds } from './drinks.ts'
import { createSeed, generateAnswer } from './game/generateAnswer.ts'
import { defaultSettings, type GameSettings } from './types.ts'

type Screen =
  | { kind: 'setup' }
  | { kind: 'playing'; player: 'solo' | 'A' | 'B' }
  | { kind: 'handoff' }
  | { kind: 'solo_result'; elapsedMs: number }
  | { kind: 'compare'; timeA: number; timeB: number }

type Puzzle = {
  settings: GameSettings
  seed: number
  poolIds: string[]
  answer: string[]
}

function makePuzzle(settings: GameSettings): Puzzle {
  const poolIds = getPoolIds(settings.poolSize)
  const seed = createSeed()
  return {
    settings,
    seed,
    poolIds,
    answer: generateAnswer(seed, settings.slots, poolIds),
  }
}

export default function App() {
  const [settings, setSettings] = useState<GameSettings>(defaultSettings)
  const [puzzle, setPuzzle] = useState<Puzzle | null>(null)
  const [timeA, setTimeA] = useState<number | null>(null)
  const [screen, setScreen] = useState<Screen>({ kind: 'setup' })

  const startGame = (nextSettings: GameSettings) => {
    const next = makePuzzle(nextSettings)
    setPuzzle(next)
    setTimeA(null)
    setScreen({
      kind: 'playing',
      player: nextSettings.mode === 'versus' ? 'A' : 'solo',
    })
  }

  const goSetup = () => {
    setScreen({ kind: 'setup' })
    setPuzzle(null)
    setTimeA(null)
  }

  if (screen.kind === 'setup') {
    return (
      <div className="app">
        <SetupScreen
          settings={settings}
          onChange={setSettings}
          onStart={() => startGame(settings)}
        />
      </div>
    )
  }

  if (screen.kind === 'handoff') {
    return (
      <div className="app">
        <HandoffScreen
          onContinue={() => setScreen({ kind: 'playing', player: 'B' })}
        />
      </div>
    )
  }

  if (screen.kind === 'solo_result') {
    return (
      <div className="app">
        <ResultScreen
          elapsedMs={screen.elapsedMs}
          onReplay={() => startGame(settings)}
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
          onReplay={() => startGame(settings)}
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
          onChange={setSettings}
          onStart={() => startGame(settings)}
        />
      </div>
    )
  }

  return (
    <div className="app">
      <PlayScreen
        key={`${puzzle.seed}-${screen.player}`}
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
            setTimeA(elapsedMs)
            setScreen({ kind: 'handoff' })
            return
          }
          setScreen({
            kind: 'compare',
            timeA: timeA ?? elapsedMs,
            timeB: elapsedMs,
          })
        }}
      />
    </div>
  )
}
