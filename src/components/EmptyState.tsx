import styles from './EmptyState.module.css'

interface EmptyStateProps {
  title: string
  note?: string
}

/**
 * מצב ריק שקט — כרטיס עדין שמסמן שתוכן יתווסף בהמשך.
 * לא נראה כמו שגיאה, ונעלם מעצמו ברגע שהתוכן האמיתי נוסף.
 */
export function EmptyState({ title, note }: EmptyStateProps) {
  return (
    <div className={styles.emptyState}>
      <p className={styles.title}>{title}</p>
      {note && <p className={styles.note}>{note}</p>}
    </div>
  )
}
