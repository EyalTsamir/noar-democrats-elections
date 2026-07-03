import { DateTime } from 'luxon'
import { Link } from 'react-router'
import { electionConfig } from '../content/electionConfig'
import styles from './DevPhasePanel.module.css'

/**
 * לוח בקרה לסימולציית זמן — פיתוח בלבד.
 * מוצג רק כאשר import.meta.env.DEV אמת, ולכן מסולק כליל מגרסת הייצור.
 * הקישורים קובעים ?now=<ISO בשעון ישראל> ומאפשרים לבדוק כל גבול לפני/בדיוק/אחרי.
 * זו אינה בקרה ציבורית לשינוי שלב — היא לא קיימת באתר שמתפרסם.
 */

interface BoundaryLink {
  label: string
  date: string
  time: string
}

const BOUNDARIES: BoundaryLink[] = [
  { label: 'סגירת הספר', date: electionConfig.registryCloseDate, time: electionConfig.registryCloseTime },
  { label: 'עימות', date: electionConfig.debateDate, time: electionConfig.debateTime },
  { label: 'פתיחת הצבעה', date: electionConfig.electionDate, time: electionConfig.votingStartTime },
  { label: 'סגירת הצבעה', date: electionConfig.electionDate, time: electionConfig.votingEndTime },
]

// מחזיר מחרוזת שעון-קיר (בלי אזור זמן) של הגבול בתוספת/החסרה של שניות.
// parseSimulatedClock יפרש אותה חזרה בשעון ישראל, ולכן אין באג של קידוד "+".
function boundaryIso(date: string, time: string, deltaSeconds: number): string {
  return DateTime.fromISO(`${date}T${time}`, { zone: electionConfig.timezone })
    .plus({ seconds: deltaSeconds })
    .toFormat("yyyy-MM-dd'T'HH:mm:ss")
}

export function DevPhasePanel() {
  return (
    <aside className={styles.panel} aria-label="סימולציית זמן (פיתוח)">
      <p className={styles.title}>סימולציית זמן · פיתוח</p>
      <ul className={styles.list}>
        {BOUNDARIES.map((boundary) => (
          <li key={boundary.label} className={styles.row}>
            <span className={styles.rowLabel}>{boundary.label}</span>
            <span className={styles.links}>
              <Link to={{ search: `?now=${boundaryIso(boundary.date, boundary.time, -1)}` }}>−1ש׳</Link>
              <Link to={{ search: `?now=${boundaryIso(boundary.date, boundary.time, 0)}` }}>בדיוק</Link>
              <Link to={{ search: `?now=${boundaryIso(boundary.date, boundary.time, 1)}` }}>+1ש׳</Link>
            </span>
          </li>
        ))}
      </ul>
      <Link to={{ search: '' }} className={styles.live}>
        חזרה לזמן אמת
      </Link>
    </aside>
  )
}
