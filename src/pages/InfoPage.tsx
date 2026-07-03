import meetingPhoto from '../assets/activities/activity-meeting-1600.webp'
import meetingPhotoSm from '../assets/activities/activity-meeting-800.webp'
import { PageHero } from '../components/PageHero'
import { infoSections } from '../content/infoSections'
import { useDocumentTitle } from '../utils/useDocumentTitle'
import styles from './InfoPage.module.css'

/**
 * עמוד "מידע על הבחירות" — התוכן כולו מגיע משכבת התוכן
 * (src/content/infoSections.ts), והעמוד רק מציג אותו.
 */
export function InfoPage() {
  useDocumentTitle('מידע על הבחירות')

  return (
    <>
      <PageHero
        title="מידע על הבחירות"
        lead="כאן ירוכזו כל הפרטים על מערכת הבחירות — מועדים, תנאי סף, זכאות ואופן ההצבעה."
        photo={{ src: meetingPhoto, srcSm: meetingPhotoSm }}
      />

      <div className={styles.page}>
        <div className={styles.sections}>
          {infoSections.map((section) => (
            <section
              key={section.id}
              className={styles.section}
              aria-labelledby={`info-${section.id}`}
            >
              <h2 id={`info-${section.id}`} className={styles.sectionTitle}>
                {section.title}
              </h2>

              {section.events && (
                <ul className={styles.events}>
                  {section.events.map((event) => (
                    <li key={event.title} className={styles.event}>
                      {/* dir="ltr" שומר על כיוון קריאה נכון של תאריך ושעות בתוך שורה עברית */}
                      <span dir="ltr" className={styles.eventWhen}>
                        {event.date}, {event.time}
                      </span>
                      <span className={styles.eventTitle}>{event.title}</span>
                    </li>
                  ))}
                </ul>
              )}

              {section.bullets && (
                <ul className={styles.bullets}>
                  {section.bullets.map((bullet) => (
                    <li key={bullet}>{bullet}</li>
                  ))}
                </ul>
              )}

              {section.paragraphs &&
                section.paragraphs.map((paragraph) => (
                  <p key={paragraph} className={styles.sectionText}>
                    {paragraph}
                  </p>
                ))}
            </section>
          ))}
        </div>
      </div>
    </>
  )
}
