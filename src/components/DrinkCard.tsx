import { useState, type CSSProperties } from 'react'
import { getDrink } from '../drinks.ts'

type CardSize = 'slot' | 'pool' | 'ghost'

type DrinkCardProps = {
  drinkId: string
  size?: CardSize
  dimmed?: boolean
}

export function DrinkCard({
  drinkId,
  size = 'pool',
  dimmed = false,
}: DrinkCardProps) {
  const drink = getDrink(drinkId)
  const [loadedId, setLoadedId] = useState<string | null>(null)
  const [failedId, setFailedId] = useState<string | null>(null)
  const imgLoaded = loadedId === drinkId
  const imgFailed = failedId === drinkId
  const showPhoto = !imgFailed && imgLoaded

  return (
    <div
      className={`drink-card drink-card--${size} drink-card--${drink.art}${dimmed ? ' is-dimmed' : ''}`}
      style={
        {
          '--drink-hue': drink.hue,
          '--drink-accent': drink.accent,
        } as CSSProperties
      }
      aria-label={drink.name}
    >
      <div className="drink-card__frame">
        {!imgFailed && (
          <img
            className="drink-card__photo"
            src={`${import.meta.env.BASE_URL}assets/drinks/${drink.id}.webp`}
            alt=""
            draggable={false}
            hidden={!showPhoto}
            decoding="async"
            onLoad={() => setLoadedId(drinkId)}
            onError={() => setFailedId(drinkId)}
          />
        )}
        {!showPhoto && (
          <div className="drink-card__art" aria-hidden="true">
            <span className="drink-card__shine" />
            {drink.art === 'placeholder' && (
              <span className="drink-card__p1">P1</span>
            )}
          </div>
        )}
      </div>
      <span className="drink-card__label">{drink.shortName}</span>
    </div>
  )
}
