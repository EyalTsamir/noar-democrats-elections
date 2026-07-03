import type { ReactNode } from 'react'
import { Link } from 'react-router'
import styles from './LinkButton.module.css'

// או קישור פנימי (to) או קישור חיצוני (href) — לא שניהם יחד
type LinkButtonProps = {
  variant?: 'primary' | 'secondary'
  children: ReactNode
} & ({ to: string; href?: never } | { href: string; to?: never })

/** קישור בעיצוב כפתור בולט — לקריאות פעולה מרכזיות (פנימי או חיצוני) */
export function LinkButton(props: LinkButtonProps) {
  const { variant = 'primary', children } = props
  const className = `${styles.button} ${styles[variant]}`

  // קישור חיצוני (למשל אתר ההצבעה) — נפתח בבטחה בכרטיסייה חדשה
  if ('href' in props && props.href !== undefined) {
    return (
      <a href={props.href} target="_blank" rel="noopener noreferrer" className={className}>
        {children}
        <span className="visually-hidden"> (נפתח בכרטיסייה חדשה)</span>
      </a>
    )
  }

  return (
    <Link to={props.to} className={className}>
      {children}
    </Link>
  )
}
