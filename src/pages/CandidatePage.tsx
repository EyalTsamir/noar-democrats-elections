import { useParams } from 'react-router'
import { IconExternal } from '../components/icons'
import { LinkButton } from '../components/LinkButton'
import { candidates } from '../content/candidates'
import { candidateImageUrl } from '../utils/candidateImage'
import { useDocumentTitle } from '../utils/useDocumentTitle'
import styles from './CandidatePage.module.css'

/** העמוד האישי של מועמד/ת — נטען לפי ה-slug שבכתובת */
export function CandidatePage() {
  const { slug } = useParams()
  const candidate = candidates.find(
    (c) => c.slug === decodeURIComponent(slug ?? ''),
  )

  useDocumentTitle(candidate ? candidate.fullName : 'לא נמצא')

  // slug לא מוכר — הודעה ידידותית במקום עמוד שבור
  if (!candidate) {
    return (
      <div className={styles.notFound}>
        <h1 className={styles.notFoundTitle}>לא מצאנו את מי שחיפשתם</h1>
        <p className={styles.notFoundText}>
          ייתכן שהקישור השתנה, או שהמועמד/ת עדיין לא פורסמו באתר.
        </p>
        <LinkButton to="/">חזרה לעמוד הבית</LinkButton>
      </div>
    )
  }

  return (
    <article className={styles.page}>
      <header className={styles.header}>
        <img
          src={candidateImageUrl(candidate.image)}
          alt={candidate.imageAlt ?? candidate.fullName}
          className={styles.image}
        />
        <h1 className={styles.name}>{candidate.fullName}</h1>
        <p className={styles.statement}>{candidate.mainStatement}</p>
      </header>

      <div className={styles.body}>
        {candidate.personalText.map((paragraph, index) => (
          <p key={index}>{paragraph}</p>
        ))}
      </div>

      {candidate.proposedSecretariat && candidate.proposedSecretariat.length > 0 && (
        <section
          className={styles.secretariat}
          aria-labelledby="secretariat-heading"
        >
          <h2 id="secretariat-heading" className={`accent-heading ${styles.subTitle}`}>
            המזכירות המוצעת
          </h2>
          <ul className={styles.members}>
            {candidate.proposedSecretariat.map((member) => (
              <li key={member.name} className={styles.member}>
                <span className={styles.memberName}>{member.name}</span>
                {member.role && (
                  <span className={styles.memberRole}>{member.role}</span>
                )}
              </li>
            ))}
          </ul>
        </section>
      )}

      {candidate.socialLink && (
        <p className={styles.social}>
          <a
            href={candidate.socialLink.url}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.socialLink}
          >
            {candidate.socialLink.label}
            <IconExternal size={18} />
          </a>
        </p>
      )}
    </article>
  )
}
