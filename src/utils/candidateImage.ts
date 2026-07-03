/**
 * בונה כתובת לתמונת מועמד/ת מתוך שם הקובץ בלבד.
 * התמונות יושבות ב-public/candidates ומוגשות יחסית לבסיס האתר,
 * כך שהאתר עובד גם תחת נתיב-משנה של GitHub Pages.
 */
export function candidateImageUrl(fileName: string): string {
  return `${import.meta.env.BASE_URL}candidates/${fileName}`
}
