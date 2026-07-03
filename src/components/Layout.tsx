import type { MouseEvent as ReactMouseEvent, ReactNode } from 'react'
import { electionConfig } from '../content/electionConfig'
import { Header } from './Header'
import styles from './Layout.module.css'

interface LayoutProps {
  children: ReactNode
}

/** שלד העמוד: קישור דילוג, סרגל עליון, אזור תוכן ראשי וכותרת תחתונה */
export function Layout({ children }: LayoutProps) {
  // קישור עוגן רגיל היה מתפרש כשינוי נתיב של HashRouter,
  // ולכן הדילוג ממומש בפוקוס ידני
  const handleSkip = (event: ReactMouseEvent<HTMLAnchorElement>) => {
    event.preventDefault()
    document.getElementById('main-content')?.focus()
  }

  return (
    <>
      <a className="skip-link" href="#main-content" onClick={handleSkip}>
        דילוג לתוכן הראשי
      </a>
      <Header />
      <main id="main-content" tabIndex={-1}>
        {children}
      </main>
      <footer className={`${styles.footer} ink`}>
        {/* פס כפול — הדהוד פסי הלוגו, חתימת הזהות גם בתחתית */}
        <div className={styles.footerBars} aria-hidden="true" />
        <p className={styles.footerTitle}>{electionConfig.siteTitle}</p>
        <p className={styles.footerNote}>מערכת הבחירות 2026 · מהרחוב לכנסת</p>
      </footer>
    </>
  )
}
