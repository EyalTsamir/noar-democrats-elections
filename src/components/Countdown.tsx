import type { CountdownParts } from '../utils/electionPhase'
import styles from './Countdown.module.css'

interface CountdownProps {
  parts: CountdownParts
  /** תיאור היעד לספירה — משמש בתווית הנגישה, למשל "פתיחת ההצבעה" */
  label: string
}

interface UnitView {
  value: number
  singular: string
  plural: string
}

function pad(value: number): string {
  return String(value).padStart(2, '0')
}

// ניסוח עברי תקין ליחיד/רבים עבור קוראי מסך
function spoken(value: number, singular: string, plural: string): string {
  return `${value} ${value === 1 ? singular : plural}`
}

/**
 * ספירה לאחור נגישה.
 * - role="timer" (aria-live מרומז "off") — לא מכריז מחדש בכל שנייה.
 * - התצוגה החזותית מוסתרת מקוראי מסך; התווית הנגישה מנסחת את הזמן שנותר.
 * - המספרים ב-dir="ltr" ו-tabular-nums כדי להיקרא נכון וללא ריצוד ב-RTL.
 */
export function Countdown({ parts, label }: CountdownProps) {
  const units: UnitView[] = [
    { value: parts.days, singular: 'יום', plural: 'ימים' },
    { value: parts.hours, singular: 'שעה', plural: 'שעות' },
    { value: parts.minutes, singular: 'דקה', plural: 'דקות' },
    { value: parts.seconds, singular: 'שנייה', plural: 'שניות' },
  ]

  const ariaLabel = `נותרו ${units
    .map((unit) => spoken(unit.value, unit.singular, unit.plural))
    .join(', ')} עד ${label}`

  return (
    <div className={styles.countdown} role="timer" aria-label={ariaLabel}>
      <div className={styles.units} aria-hidden="true">
        {units.map((unit) => (
          <div key={unit.plural} className={styles.unit}>
            <span dir="ltr" className={styles.value}>
              {pad(unit.value)}
            </span>
            <span className={styles.unitLabel}>{unit.plural}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
