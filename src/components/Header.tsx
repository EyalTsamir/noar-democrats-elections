import { useCallback, useRef, useState } from 'react'
import { Link } from 'react-router'
import { electionConfig } from '../content/electionConfig'
import { IconMenu } from './icons'
import { NavDrawer } from './NavDrawer'
import styles from './Header.module.css'

/** הסרגל העליון הדביק — מחזיק את כפתור התפריט ואת מצב הפתיחה של המגירה */
export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const menuButtonRef = useRef<HTMLButtonElement>(null)

  // זהות יציבה — כדי שאפקט סגירת-הניווט ב-NavDrawer לא ירוץ בכל רינדור
  const closeMenu = useCallback(() => setIsMenuOpen(false), [])

  return (
    <header className={`${styles.header} ink`}>
      <div className={styles.inner}>
        <button
          ref={menuButtonRef}
          type="button"
          className={styles.menuButton}
          aria-expanded={isMenuOpen}
          aria-controls="nav-drawer"
          aria-label="פתיחת תפריט"
          onClick={() => setIsMenuOpen(true)}
        >
          <IconMenu />
        </button>

        {/* הלוגו של התנועה משוחזר כאן כטיפוגרפיה חיה — השם בין שני פסים
            (ה-::before/::after ב-CSS), במקום תמונה זעירה שלא ניתן לקרוא.
            הטקסט עצמו הוא השם הנגיש של הקישור */}
        <Link to="/" className={styles.homeLink}>
          {electionConfig.siteShortTitle}
        </Link>
      </div>

      <NavDrawer isOpen={isMenuOpen} onClose={closeMenu} triggerRef={menuButtonRef} />
    </header>
  )
}
