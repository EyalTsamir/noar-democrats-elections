import type { DateTime } from 'luxon'
// צילום הפעילות מעובד מראש לגווני אפור; הצבע נמזג בזמן ריצה (דואוטון כחול)
import firePhoto from '../assets/activities/activity-fire-1600.webp'
import firePhotoSm from '../assets/activities/activity-fire-800.webp'
import { CandidateCard } from '../components/CandidateCard'
import { Countdown } from '../components/Countdown'
import { EmptyState } from '../components/EmptyState'
import { IconArrowForward, IconExternal } from '../components/icons'
import { LinkButton } from '../components/LinkButton'
import { Marquee } from '../components/Marquee'
import { electionConfig } from '../content/electionConfig'
import { countdownHeadings, phaseCopy } from '../content/phaseCopy'
import { getCountdownParts, isValidVotingUrl, type ElectionPhase } from '../utils/electionPhase'
import { useCandidateOrder } from '../utils/useCandidateOrder'
import { useDocumentTitle } from '../utils/useDocumentTitle'
import { useElectionPhase } from '../utils/useNow'
import styles from './HomePage.module.css'

export function HomePage() {
  useDocumentTitle()
  // סדר אקראי משותף — זהה לסדר שמוצג בתפריט הצד באותו ניווט
  const candidates = useCandidateOrder()
  // הרגע הנוכחי ושלב הבחירות — מתעדכנים כל שנייה וממתגים את תוכן ה-Hero לבד
  const { now, phase } = useElectionPhase()

  return (
    <>
      <section className={`${styles.hero} ink`} data-phase={phase.id}>
        {/* שכבת הרקע: צילום מדורה בדואוטון כחול (אדום ביום ההצבעה) */}
        <div className={styles.heroMedia} aria-hidden="true">
          <img
            src={firePhoto}
            srcSet={`${firePhotoSm} 800w, ${firePhoto} 1600w`}
            sizes="100vw"
            alt=""
            fetchPriority="high"
            className={styles.heroPhoto}
          />
        </div>
        <div className={styles.heroInner}>
          <p className={styles.kicker}>מערכת הבחירות 2026</p>
          <HeroContent phase={phase} now={now} />
        </div>
      </section>

      <Marquee
        items={['הקול שלך קובע', 'מהרחוב לכנסת', 'בחירות 2026', 'נוער הדמוקרטים']}
      />

      <section className={styles.candidates} aria-labelledby="candidates-heading">
        <div className={styles.candidatesInner}>
          <h2 id="candidates-heading" className={`accent-heading ${styles.sectionTitle}`}>
            המועמדים והמועמדות
          </h2>

          {candidates.length > 0 ? (
            <ul className={styles.grid}>
              {candidates.map((candidate) => (
                <li key={candidate.id}>
                  <CandidateCard candidate={candidate} />
                </li>
              ))}
            </ul>
          ) : (
            <EmptyState
              title="המועמדים והמועמדות יוצגו כאן בקרוב"
              note="שווה לחזור ולהתעדכן!"
            />
          )}
        </div>
      </section>
    </>
  )
}

/** תוכן ה-Hero המשתנה לפי שלב הבחירות */
function HeroContent({ phase, now }: { phase: ElectionPhase; now: DateTime }) {
  switch (phase.id) {
    // שלושת שלבי הספירה לאחור — אותו מבנה, יעד שונה
    case 'before-registry-close':
    case 'before-debate':
    case 'before-voting': {
      const heading = countdownHeadings[phase.id]
      return (
        <>
          {/* כותרת הפוסטר — מילה ראשונה במתאר (outline), השאר מלא */}
          <h1 className={styles.title}>
            <span className={styles.titleOutline}>בחירות</span>{' '}
            <span className={styles.titleSolid}>בנוער הדמוקרטים!</span>
          </h1>
          <p className={styles.countdownLead}>הזמן שנותר עד {heading}</p>
          {phase.target && (
            <div className={styles.countdownWrap}>
              <Countdown parts={getCountdownParts(now, phase.target)} label={heading} />
            </div>
          )}
          <div className={styles.cta}>
            <LinkButton to="/info" variant="ghost">
              למידע על הבחירות
              <IconArrowForward size={20} />
            </LinkButton>
          </div>
        </>
      )
    }

    // ההצבעה פתוחה — מצב יום הבחירות: ה-Hero כולו מתהפך לדיו אדום
    case 'voting-open': {
      const hasVotingUrl = isValidVotingUrl(electionConfig.votingUrl)
      return (
        <>
          <h1 className={styles.titleVoting}>{phaseCopy.votingDayHeadline}</h1>
          <p className={styles.countdownLead}>הזמן שנותר עד {countdownHeadings['voting-open']}</p>
          {phase.target && (
            <div className={styles.countdownWrap}>
              <Countdown parts={getCountdownParts(now, phase.target)} label={countdownHeadings['voting-open']} />
            </div>
          )}
          <p className={styles.closingTime}>
            {phaseCopy.votingClosingPrefix}{' '}
            <span dir="ltr">{electionConfig.votingEndTime}</span>
          </p>
          <div className={styles.cta}>
            {hasVotingUrl ? (
              <LinkButton href={electionConfig.votingUrl} variant="urgent">
                {phaseCopy.votingButtonLabel}
                <IconExternal size={20} />
              </LinkButton>
            ) : (
              <p className={styles.votingPending}>{phaseCopy.votingLinkPending}</p>
            )}
          </div>
        </>
      )
    }

    // ההצבעה נסגרה — מסך סיום, בלי ספירה ובלי כפתור
    case 'voting-closed':
      return (
        <>
          <h1 className={styles.title}>
            <span className={styles.titleSolid}>{phaseCopy.votingClosedTitle}</span>
          </h1>
          <p className={styles.closedNote}>{phaseCopy.votingClosedNote}</p>
        </>
      )

    // כל השלבים מכוסים; ברירת המחדל שומרת על טיפוסיות אם יתווסף שלב עתידי
    default:
      return null
  }
}
