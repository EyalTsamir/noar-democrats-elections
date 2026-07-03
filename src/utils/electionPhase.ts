/**
 * מנוע שלבי הבחירות — לוגיקה טהורה, בלי React ובלי DOM.
 * כל החישובים נשענים על אזור הזמן של הבחירות (Asia/Jerusalem) דרך Luxon,
 * כדי שהאתר יתנהג נכון גם כשנפתח ממדינה אחרת או ממחשב בשעון שונה.
 * הקובץ הזה אינו קורא ל-import.meta ולכן נבדק בקלות ורץ גם בבדיקות.
 */
import { DateTime } from 'luxon'
import type { ElectionConfig } from '../content/types'

/**
 * מזהי שלבי הבחירות (איחוד מחרוזות — לא enum, בשל erasableSyntaxOnly).
 * שלב עתידי אפשרי: 'results-published' — יתווסף אחרי 'voting-closed'
 * כשתוחלט תצוגת התוצאות. אין לממש כרגע תוצאות/זוכה/נתונים.
 */
export type ElectionPhaseId =
  | 'before-registry-close'
  | 'before-debate'
  | 'before-voting'
  | 'voting-open'
  | 'voting-closed'

/** ארבע נקודות הזמן שמפרידות בין השלבים (רגעים מוחלטים) */
export interface ElectionBoundaries {
  registryClose: DateTime
  debate: DateTime
  votingOpen: DateTime
  votingClose: DateTime
}

export interface ElectionPhase {
  id: ElectionPhaseId
  /** הרגע שאליו סופרים; null כשאין ספירה (למשל אחרי סגירת ההצבעה) */
  target: DateTime | null
}

export interface CountdownParts {
  days: number
  hours: number
  minutes: number
  seconds: number
  /** מילי-שניות שנותרו, אף פעם לא שלילי */
  totalMs: number
  /** true כשהיעד כבר עבר */
  isElapsed: boolean
}

/** בונה רגע מוחלט מתאריך+שעה כשעון-קיר באזור הזמן של הבחירות */
function zonedMoment(date: string, time: string, zone: string): DateTime {
  return DateTime.fromISO(`${date}T${time}`, { zone })
}

/** מחשב את ארבע נקודות הזמן מתוך ההגדרות המרכזיות */
export function getElectionBoundaries(config: ElectionConfig): ElectionBoundaries {
  const zone = config.timezone
  return {
    registryClose: zonedMoment(config.registryCloseDate, config.registryCloseTime, zone),
    debate: zonedMoment(config.debateDate, config.debateTime, zone),
    votingOpen: zonedMoment(config.electionDate, config.votingStartTime, zone),
    votingClose: zonedMoment(config.electionDate, config.votingEndTime, zone),
  }
}

/**
 * מחזיר את שלב הבחירות עבור רגע נתון.
 * ההשוואה נעשית במילי-שניות (toMillis) — אי אפשר להשוות שני DateTime עם <.
 * הסמנטיקה: בדיוק ברגע הגבול כבר עוברים לשלב הבא (השוואת < חמורה).
 */
export function getElectionPhase(now: DateTime, boundaries: ElectionBoundaries): ElectionPhase {
  const { registryClose, debate, votingOpen, votingClose } = boundaries

  // הגנה: אם אחת מנקודות הזמן אינה תקינה (תאריך ריק/שגוי), אל תסיק בטעות
  // "ההצבעה נסתיימה" (כי NaN < x הוא תמיד false) — היוותר בשלב הראשון.
  if (
    !registryClose.isValid ||
    !debate.isValid ||
    !votingOpen.isValid ||
    !votingClose.isValid
  ) {
    return {
      id: 'before-registry-close',
      target: registryClose.isValid ? registryClose : null,
    }
  }

  const nowMs = now.toMillis()
  if (nowMs < registryClose.toMillis()) return { id: 'before-registry-close', target: registryClose }
  if (nowMs < debate.toMillis()) return { id: 'before-debate', target: debate }
  if (nowMs < votingOpen.toMillis()) return { id: 'before-voting', target: votingOpen }
  if (nowMs < votingClose.toMillis()) return { id: 'voting-open', target: votingClose }
  return { id: 'voting-closed', target: null }
}

/**
 * מפרק את הזמן שנותר עד היעד לימים/שעות/דקות/שניות.
 * מחושב מחדש מהזמן המוחלט בכל קריאה (לא מונה יורד) — עמיד להשהיית לשונית/שינה.
 * עיגול כלפי מעלה (ceil) של השניות כדי שהערך האחרון יהיה 00:00:01 ולא אפס מוקדם.
 */
export function getCountdownParts(now: DateTime, target: DateTime): CountdownParts {
  const totalMs = Math.max(0, target.toMillis() - now.toMillis())
  const totalSeconds = Math.ceil(totalMs / 1000)
  const days = Math.floor(totalSeconds / 86400)
  const hours = Math.floor((totalSeconds % 86400) / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60
  return { days, hours, minutes, seconds, totalMs, isElapsed: totalMs === 0 }
}

/** בודק שכתובת ההצבעה תקינה ובטוחה (http/https בלבד) */
export function isValidVotingUrl(url: string): boolean {
  if (!url) return false
  try {
    const parsed = new URL(url)
    return parsed.protocol === 'http:' || parsed.protocol === 'https:'
  } catch {
    return false
  }
}

/**
 * ממיר מחרוזת ISO (מפרמטר ?now= בפיתוח) לרגע בשעון ישראל.
 * מחזיר null אם ריק או לא תקין. משמש רק את מנגנון סימולציית הזמן בפיתוח.
 */
export function parseSimulatedClock(param: string | null, config: ElectionConfig): DateTime | null {
  if (!param) return null
  const parsed = DateTime.fromISO(param, { zone: config.timezone })
  return parsed.isValid ? parsed : null
}
