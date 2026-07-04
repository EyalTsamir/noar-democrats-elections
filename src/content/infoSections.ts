import { electionConfig } from './electionConfig'
import type { InfoSection } from './types'

/**
 * ============================================================
 * מקטעי עמוד "מידע על הבחירות" — עורכים כאן את תוכן העמוד
 * ============================================================
 * הסדר שכאן קובע את סדר המקטעים בעמוד.
 * בכל מקטע ממלאים רק את מה שצריך:
 *   events     — מועדים (תאריך + שעה + מה קורה)
 *   bullets    — רשימת נקודות
 *   paragraphs — פסקאות טקסט חופשי
 * שני הטקסטים המרכזיים (זכאות ואופן ההצבעה) נערכים
 * בקובץ electionConfig.ts, לצד שאר הטקסטים הכלליים.
 */
export const infoSections: InfoSection[] = [
  {
    id: 'schedule',
    title: 'מועדים',
    events: [
      { date: '15.7.2026', time: '22:00', title: 'סגירת ספר הבוחרים וטופס המועמדות' },
      { date: '18.7.2026', time: '22:00', title: 'עימות המועמדים' },
      { date: '22.7.2026', time: '10:00–22:00', title: 'ההצבעה' },
    ],
  },
  {
    id: 'threshold',
    title: 'תנאי הסף',
    bullets: ['ותק של חודש לפחות בנוער', 'גיל מעל 16'],
  },
  {
    id: 'exemption',
    title: 'אפשרות להגיש בקשת החרגה',
    paragraphs: [
      'מי שאינם עומדים בתנאי הסף יכולים להגיש בקשת החרגה לוועדת הבחירות.',
    ],
  },
  {
    id: 'eligibility',
    title: 'מי זכאי להצביע',
    paragraphs: [electionConfig.eligibilityText],
  },
  {
    id: 'method',
    title: 'כיצד תתבצע ההצבעה',
    paragraphs: [electionConfig.votingMethodText],
  },
]
