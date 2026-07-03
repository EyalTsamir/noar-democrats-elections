import { useCallback, useRef, useState } from 'react'
import { Link } from 'react-router'
import logoUrl from '../assets/logo-noar.jpg'
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
    <header className={styles.header}>
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

        <Link to="/" className={styles.homeLink}>
          {/* alt ריק — שם האתר שלצד הלוגו הוא הטקסט הנגיש של הקישור */}
          <img src={logoUrl} alt="" width={28} height={28} className={styles.logo} />
          <span>{electionConfig.siteShortTitle}</span>
        </Link>
      </div>

      <NavDrawer isOpen={isMenuOpen} onClose={closeMenu} triggerRef={menuButtonRef} />
    </header>
  )
}
