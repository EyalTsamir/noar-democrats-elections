import { DateTime } from 'luxon'
import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router'
import { electionConfig } from '../content/electionConfig'
import {
  getElectionBoundaries,
  getElectionPhase,
  parseSimulatedClock,
  type ElectionPhase,
} from './electionPhase'

// תדירות עדכון השעון — שנייה, מספיק לתצוגת שניות חיה בלי בזבוז משאבים
const TICK_MS = 1000

/**
 * מחזיר את "עכשיו" ומתעדכן כל שנייה.
 * בכל טיק מחושב הזמן המוחלט מחדש (base + זמן אמת שחלף) ולא מונה יורד,
 * כדי שהספירה תישאר מדויקת גם אחרי השהיית לשונית, שינה, או עיכוב הטיימר.
 *
 * פיתוח בלבד: פרמטר ?now=<ISO> בכתובת מדמה רגע אחר (בשעון ישראל) ו"רץ" קדימה.
 * הענף כולו מסולק מגרסת הייצור כי import.meta.env.DEV הופך שם ל-false.
 */
export function useNow(): DateTime {
  const [searchParams] = useSearchParams()

  // override של זמן — פיתוח בלבד; בייצור נשאר null והקוד סביבו מסולק בבנייה
  let overrideIso: string | null = null
  if (import.meta.env.DEV) {
    overrideIso = searchParams.get('now')
  }

  const [now, setNow] = useState<DateTime>(() => resolveBase(overrideIso))

  useEffect(() => {
    const base = resolveBase(overrideIso)
    const anchorReal = Date.now()
    setNow(base)

    const id = setInterval(() => {
      const elapsed = Date.now() - anchorReal
      setNow(base.plus({ milliseconds: elapsed }))
    }, TICK_MS)

    return () => clearInterval(id)
  }, [overrideIso])

  return now
}

// נקודת הבסיס לשעון: זמן מדומה (בפיתוח) או הזמן האמיתי
function resolveBase(overrideIso: string | null): DateTime {
  if (import.meta.env.DEV && overrideIso) {
    const simulated = parseSimulatedClock(overrideIso, electionConfig)
    if (simulated) return simulated
  }
  return DateTime.now()
}

/** מחזיר את "עכשיו" ואת שלב הבחירות הנגזר ממנו — שניהם מתעדכנים כל שנייה */
export function useElectionPhase(): { now: DateTime; phase: ElectionPhase } {
  const now = useNow()
  const boundaries = useMemo(() => getElectionBoundaries(electionConfig), [])
  const phase = getElectionPhase(now, boundaries)
  return { now, phase }
}
