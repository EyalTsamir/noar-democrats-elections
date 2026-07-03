import { createContext, useContext } from 'react'
import { candidates } from '../content/candidates'
import type { Candidate } from '../content/types'

/**
 * ההקשר (Context) שמחזיק את סדר המועמדים האקראי הנוכחי.
 * הסדר מוגרל מחדש ב-CandidateOrderProvider בכל טעינה ובכל מעבר עמוד.
 */
export const CandidateOrderContext = createContext<Candidate[]>([...candidates])

/**
 * סדר המועמדים האקראי של הניווט הנוכחי — זהה בעמוד הבית
 * ובתפריט הצד, כדי שהממשק לא יסתור את עצמו.
 */
export function useCandidateOrder() {
  return useContext(CandidateOrderContext)
}
