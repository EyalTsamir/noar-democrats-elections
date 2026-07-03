import styles from './Marquee.module.css'

interface MarqueeProps {
  /** הסיסמאות שנעות בפס — מוצגות בלולאה אינסופית */
  items: string[]
}

/**
 * פס סיסמאות נע — אנרגיית רחוב בין מקטעי העמוד.
 * התוכן הנע דקורטיבי ומוסתר מקוראי מסך; גרסה סטטית אחת
 * של הסיסמאות זמינה להם בטקסט נסתר.
 */
export function Marquee({ items }: MarqueeProps) {
  // שני עותקים זהים של הרשימה — הזזה ברוחב עותק אחד יוצרת לולאה חלקה
  const strip = (
    <>
      {items.map((item) => (
        <span key={item} className={styles.item}>
          {item}
          <span className={styles.diamond}>◆</span>
        </span>
      ))}
    </>
  )

  return (
    <div className={styles.marquee}>
      <p className="visually-hidden">{items.join(' · ')}</p>
      <div className={styles.track} aria-hidden="true">
        <div className={styles.group}>{strip}</div>
        <div className={styles.group}>{strip}</div>
      </div>
    </div>
  )
}
