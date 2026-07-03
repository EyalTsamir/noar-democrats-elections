import { createContext, useContext } from 'react'

export interface DevPanelContextValue {
  /** האם לוח סימולציית הזמן נחשף (אחרי 3 לחיצות רצופות על חתימת התחתית) */
  isRevealed: boolean
  /** קריאה בכל לחיצה על כיתוב "מערכת הבחירות" בתחתית מגירת הניווט */
  registerFooterClick: () => void
}

export const DevPanelContext = createContext<DevPanelContextValue>({
  isRevealed: false,
  registerFooterClick: () => {},
})

/**
 * לוח סימולציית הזמן מוסתר כברירת מחדל בכל סביבה (כולל פיתוח),
 * ונחשף רק כאיסטר-אג — ראו DevPanelProvider.
 */
export function useDevPanel() {
  return useContext(DevPanelContext)
}
