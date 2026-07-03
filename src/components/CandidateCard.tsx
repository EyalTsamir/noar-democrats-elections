import { Link } from 'react-router'
import type { Candidate } from '../content/types'
import { candidateImageUrl } from '../utils/candidateImage'
import styles from './CandidateCard.module.css'

interface CandidateCardProps {
  candidate: Candidate
}

/** כרטיס מועמד/ת בעמוד הבית — מוביל לעמוד האישי */
export function CandidateCard({ candidate }: CandidateCardProps) {
  return (
    <Link to={`/candidate/${candidate.slug}`} className={styles.card}>
      {/* alt ריק — שם המועמד/ת שבתוך אותו קישור הוא הטקסט הנגיש */}
      <img
        src={candidateImageUrl(candidate.image)}
        alt=""
        loading="lazy"
        className={styles.image}
      />
      <span className={styles.text}>
        <span className={styles.name}>{candidate.fullName}</span>
      </span>
    </Link>
  )
}
