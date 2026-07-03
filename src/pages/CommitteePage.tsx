import circlePhoto from '../assets/activities/activity-circle-1200.webp'
import circlePhotoSm from '../assets/activities/activity-circle-700.webp'
import { EmptyState } from '../components/EmptyState'
import { PageHero } from '../components/PageHero'
import { committee } from '../content/committee'
import { useDocumentTitle } from '../utils/useDocumentTitle'
import styles from './CommitteePage.module.css'

export function CommitteePage() {
  useDocumentTitle('ועדת הבחירות')

  return (
    <>
      <PageHero
        title="ועדת הבחירות"
        lead="כאן יוצגו חברות וחברי ועדת הבחירות המלווים את התהליך."
        photo={{ src: circlePhoto, srcSm: circlePhotoSm }}
      />

      <div className={styles.page}>
        {committee.length > 0 ? (
          <div className={styles.groups}>
            {committee.map((group) => (
              <section key={group.roleTitle} className={styles.group}>
                <h2 className={styles.groupTitle}>{group.roleTitle}</h2>
                <ul className={styles.members}>
                  {group.members.map((member) => (
                    <li key={member.name} className={styles.member}>
                      <span className={styles.memberName}>{member.name}</span>
                      {member.role && (
                        <span className={styles.memberRole}>{member.role}</span>
                      )}
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        ) : (
          <div className={styles.empty}>
            <EmptyState title="הרכב ועדת הבחירות יפורסם כאן בקרוב" />
          </div>
        )}
      </div>
    </>
  )
}
