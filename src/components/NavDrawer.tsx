import { useEffect, useRef, useState } from 'react'
import type { MouseEvent as ReactMouseEvent, RefObject } from 'react'
import { NavLink, useLocation } from 'react-router'
import logoUrl from '../assets/logo-noar.jpg'
import { useCandidateOrder } from '../utils/useCandidateOrder'
import { useDevPanel } from '../utils/useDevPanel'
import { IconChevronDown, IconClose } from './icons'
import styles from './NavDrawer.module.css'

interface NavDrawerProps {
  isOpen: boolean
  onClose: () => void
  /** כפתור ההמבורגר — הפוקוס חוזר אליו כשהתפריט נסגר */
  triggerRef: RefObject<HTMLButtonElement | null>
}

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  isActive ? `${styles.navLink} ${styles.navLinkActive}` : styles.navLink

const subLinkClass = ({ isActive }: { isActive: boolean }) =>
  isActive ? `${styles.subLink} ${styles.subLinkActive}` : styles.subLink

/**
 * תפריט צד נפתח (מגירה) — נשען על <dialog> מקורי:
 * showModal מספק בחינם לכידת פוקוס, סגירה ב-Escape, רקע אינרטי
 * והחזרת פוקוס. בעברית המגירה נפתחת מצד ימין.
 */
export function NavDrawer({ isOpen, onClose, triggerRef }: NavDrawerProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const [isCandidatesOpen, setIsCandidatesOpen] = useState(false)
  const { pathname } = useLocation()
  // סדר אקראי משותף — זהה לסדר הכרטיסים בעמוד הבית באותו ניווט
  const candidates = useCandidateOrder()
  const { registerFooterClick } = useDevPanel()

  // פתיחה/סגירה של ה-dialog בהתאם למצב שמנוהל ב-Header
  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    if (isOpen && !dialog.open) {
      dialog.showModal()
    } else if (!isOpen && dialog.open) {
      dialog.close()
    }
  }, [isOpen])

  // סגירה אוטומטית בכל מעבר עמוד
  useEffect(() => {
    onClose()
  }, [pathname, onClose])

  // אירוע close נורה בכל דרכי הסגירה (Escape, קוד) — מסנכרן מצב ומחזיר פוקוס
  const handleDialogClose = () => {
    onClose()
    triggerRef.current?.focus()
  }

  // לחיצה על הרקע המואפל סוגרת את התפריט; לחיצות על התוכן לא נחשבות,
  // כי ה-content ממלא את ה-dialog במלואו
  const handleBackdropClick = (event: ReactMouseEvent<HTMLDialogElement>) => {
    if (event.target === dialogRef.current) {
      onClose()
    }
  }

  return (
    <dialog
      ref={dialogRef}
      id="nav-drawer"
      className={`${styles.drawer} ink`}
      aria-label="תפריט ניווט"
      onClose={handleDialogClose}
      onClick={handleBackdropClick}
    >
      <div className={styles.content}>
        <div className={styles.drawerTop}>
          {/* הלוגו הרשמי של התנועה — מודבק כאן כמו מדבקת פוסטר,
              בגודל שבו הכיתוב שבתוכו באמת קריא. alt ריק: דקורטיבי,
              השם מופיע כטקסט בסרגל העליון */}
          <img src={logoUrl} alt="" width={84} height={84} className={styles.drawerLogo} />
          {/* האלמנט הראשון שניתן למקד בתוך ה-dialog — הפוקוס נוחת עליו בפתיחה */}
          <button
            type="button"
            className={styles.closeButton}
            aria-label="סגירת תפריט"
            onClick={onClose}
          >
            <IconClose />
          </button>
        </div>

        <nav aria-label="תפריט ראשי">
          <ul className={styles.navList}>
            <li>
              <NavLink to="/" end className={navLinkClass} onClick={onClose}>
                ראשי
              </NavLink>
            </li>

            <li>
              <button
                type="button"
                className={styles.navLink}
                aria-expanded={isCandidatesOpen}
                aria-controls="candidates-submenu"
                onClick={() => setIsCandidatesOpen((open) => !open)}
              >
                מועמדים
                <IconChevronDown
                  size={20}
                  className={
                    isCandidatesOpen
                      ? `${styles.chevron} ${styles.chevronOpen}`
                      : styles.chevron
                  }
                />
              </button>
              <div id="candidates-submenu" hidden={!isCandidatesOpen}>
                {candidates.length > 0 ? (
                  <ul className={styles.submenu}>
                    {candidates.map((candidate) => (
                      <li key={candidate.id}>
                        <NavLink
                          to={`/candidate/${candidate.slug}`}
                          className={subLinkClass}
                          onClick={onClose}
                        >
                          {candidate.fullName}
                        </NavLink>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className={styles.submenuEmpty}>
                    המועמדים והמועמדות יפורסמו בקרוב
                  </p>
                )}
              </div>
            </li>

            <li>
              <NavLink to="/info" className={navLinkClass} onClick={onClose}>
                מידע על הבחירות
              </NavLink>
            </li>

            <li>
              <NavLink to="/committee" className={navLinkClass} onClick={onClose}>
                ועדת הבחירות
              </NavLink>
            </li>
          </ul>
        </nav>

        {/* 3 לחיצות רצופות חושפות איסטר-אג — לוח סימולציית זמן, ראו DevPanelProvider */}
        <p className={styles.drawerFooter} onClick={registerFooterClick}>
          מערכת הבחירות 2026
        </p>
      </div>
    </dialog>
  )
}
