import { useCallback, useMemo, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { DevPanelContext } from '../utils/useDevPanel'

interface DevPanelProviderProps {
  children: ReactNode
}

// 3 לחיצות תוך פחות מ-2 שניות חושפות את לוח סימולציית הזמן
const CLICKS_TO_REVEAL = 3
const CLICK_WINDOW_MS = 2000

/**
 * חושף את לוח סימולציית הזמן (DevPhasePanel) רק אחרי 3 לחיצות רצופות על
 * חתימת "מערכת הבחירות" בתחתית מגירת הניווט — איסטר-אג מכוון, לא בקרה גלויה.
 * פועל גם בגרסת הייצור: הזמן המדומה משפיע רק על הדפדפן שלוחץ, לא על נתוני האתר.
 */
export function DevPanelProvider({ children }: DevPanelProviderProps) {
  const [isRevealed, setIsRevealed] = useState(false)
  const clickTimestamps = useRef<number[]>([])

  const registerFooterClick = useCallback(() => {
    const now = Date.now()
    const recent = clickTimestamps.current.filter((t) => now - t <= CLICK_WINDOW_MS)
    recent.push(now)
    clickTimestamps.current = recent
    if (recent.length >= CLICKS_TO_REVEAL) {
      setIsRevealed(true)
    }
  }, [])

  const value = useMemo(
    () => ({ isRevealed, registerFooterClick }),
    [isRevealed, registerFooterClick],
  )

  return <DevPanelContext.Provider value={value}>{children}</DevPanelContext.Provider>
}
