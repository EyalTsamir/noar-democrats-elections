import styles from './PageHero.module.css'

interface PageHeroProps {
  title: string
  lead?: string
  /** צילום רקע אופציונלי — מוצג בדואוטון כחול מאחורי הכותרת */
  photo?: { src: string; srcSm: string }
}

/**
 * כותרת עמוד פנימי — רצועת דיו כהה עם חיתוך אלכסוני,
 * באותה שפה חזותית של ה-Hero בעמוד הבית.
 */
export function PageHero({ title, lead, photo }: PageHeroProps) {
  return (
    <header className={`${styles.hero} ink`}>
      {photo && (
        <div className={styles.media} aria-hidden="true">
          <img
            src={photo.src}
            srcSet={`${photo.srcSm} 760w, ${photo.src} 1500w`}
            sizes="100vw"
            alt=""
            className={styles.photo}
          />
        </div>
      )}
      <div className={styles.inner}>
        <h1 className={`accent-heading ${styles.title}`}>{title}</h1>
        {lead && <p className={styles.lead}>{lead}</p>}
      </div>
    </header>
  )
}
