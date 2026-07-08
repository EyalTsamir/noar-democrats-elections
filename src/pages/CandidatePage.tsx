import { useParams } from 'react-router'
import {
  IconArrowForward,
  IconExternal,
  IconFacebook,
  IconInstagram,
  IconTikTok,
  IconX,
} from '../components/icons'
import { LinkButton } from '../components/LinkButton'
import { candidates } from '../content/candidates'
import { candidateImageUrl } from '../utils/candidateImage'
import { useDocumentTitle } from '../utils/useDocumentTitle'
import styles from './CandidatePage.module.css'

/** בחירת אייקון לפי כתובת הקישור — עורכי התוכן לא צריכים לציין רשת */
function SocialIcon({ url }: { url: string }) {
  const size = 20
  if (url.includes('instagram.com')) return <IconInstagram size={size} />
  if (url.includes('x.com') || url.includes('twitter.com')) return <IconX size={size} />
  if (url.includes('facebook.com') || url.includes('fb.com')) return <IconFacebook size={size} />
  if (url.includes('tiktok.com')) return <IconTikTok size={size} />
  return <IconExternal size={size} />
}

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
    <article>
      {/* כותרת בסגנון כרזת קמפיין — תמונה "מודבקת" על לוח דיו */}
      <header className={`${styles.header} ink`}>
        <div className={styles.headerInner}>
          <img
            src={candidateImageUrl(candidate.image)}
            alt={candidate.imageAlt ?? candidate.fullName}
            className={styles.image}
          />
          <h1 className={styles.name}>{candidate.fullName}</h1>
          <p className={styles.statement}>{candidate.mainStatement}</p>
        </div>
      </header>

      <div className={styles.page}>
        {/* הטקסט האישי — כותרת מקטע כדי שהגוף לא יתחיל באופן חטוף */}
        <section aria-labelledby="about-heading">
          <h2 id="about-heading" className={`accent-heading ${styles.subTitle}`}>
            קצת עליי
          </h2>
          <div className={styles.body}>
            {candidate.personalText.map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
        </section>

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

        {candidate.socialLinks && candidate.socialLinks.length > 0 && (
          <ul className={styles.social}>
            {candidate.socialLinks.map((link) => (
              <li key={link.url}>
                <a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.socialLink}
                >
                  <SocialIcon url={link.url} />
                  {link.label}
                  <span className="visually-hidden"> (נפתח בכרטיסייה חדשה)</span>
                </a>
              </li>
            ))}
          </ul>
        )}

        {/* חזרה לרשימת כל המועמדים בעמוד הבית */}
        <nav className={styles.backNav} aria-label="ניווט בין מועמדים">
          <LinkButton to="/" variant="secondary">
            לכל המועמדים והמועמדות
            <IconArrowForward size={20} />
          </LinkButton>
        </nav>
      </div>
    </article>
  )
}
