import { useMemo } from 'react'
import type { ReactNode } from 'react'
import { useLocation } from 'react-router'
import { candidates } from '../content/candidates'
import { shuffle } from '../utils/shuffle'
import { CandidateOrderContext } from '../utils/useCandidateOrder'

interface CandidateOrderProviderProps {
  children: ReactNode
}

/**
 * מגריל סדר מועמדים אקראי חדש בכל טעינת עמוד מלאה ובכל מעבר בין עמודים.
 * location.key מתחלף רק בניווט — ולכן useMemo מערבב רק אז,
 * ולא ברינדורים רגילים (כמו פתיחת התפריט וסגירתו).
 */
export function CandidateOrderProvider({ children }: CandidateOrderProviderProps) {
  const location = useLocation()
  const orderedCandidates = useMemo(() => {
    // location.key מוזכר כאן כדי שהגרלה חדשה תקרה בכל ניווט — ורק אז
    void location.key
    return shuffle(candidates)
  }, [location.key])

  return (
    <CandidateOrderContext.Provider value={orderedCandidates}>
      {children}
    </CandidateOrderContext.Provider>
  )
}
