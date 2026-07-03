import { LinkButton } from '../components/LinkButton'
import { useDocumentTitle } from '../utils/useDocumentTitle'
import styles from './NotFoundPage.module.css'

export function NotFoundPage() {
  useDocumentTitle('העמוד לא נמצא')

  return (
    <div className={styles.page}>
      <p className={styles.code} aria-hidden="true">
        404
      </p>
      <h1 className={styles.title}>העמוד שחיפשתם לא נמצא</h1>
      <p className={styles.text}>
        אולי הקישור השתנה, ואולי פשוט הגעתם לכאן בטעות — קורה לטובים ביותר.
      </p>
      <LinkButton to="/">חזרה לעמוד הבית</LinkButton>
    </div>
  )
}
