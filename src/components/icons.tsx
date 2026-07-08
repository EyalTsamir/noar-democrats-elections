/**
 * אייקוני SVG מוטמעים — בלי ספריית אייקונים חיצונית.
 * כל האייקונים דקורטיביים (aria-hidden); הטקסט הנגיש מגיע תמיד
 * מהכפתור או מהקישור שמכיל אותם.
 * כיווניות: האתר תמיד RTL, ולכן "קדימה" מצויר שמאלה.
 */

interface IconProps {
  size?: number
  className?: string
}

function svgProps(size: number, className?: string) {
  return {
    className,
    width: size,
    height: size,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 2,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    'aria-hidden': true,
    focusable: false,
  } as const
}

/** שלושה פסים — פתיחת התפריט (מהדהד את פסי הלוגו) */
export function IconMenu({ size = 24, className }: IconProps) {
  return (
    <svg {...svgProps(size, className)}>
      <path d="M4 7h16M4 12h16M4 17h16" />
    </svg>
  )
}

/** איקס — סגירה */
export function IconClose({ size = 24, className }: IconProps) {
  return (
    <svg {...svgProps(size, className)}>
      <path d="m6 6 12 12M18 6 6 18" />
    </svg>
  )
}

/** חץ קטן כלפי מטה — פתיחת תת-תפריט */
export function IconChevronDown({ size = 24, className }: IconProps) {
  return (
    <svg {...svgProps(size, className)}>
      <path d="m6 9 6 6 6-6" />
    </svg>
  )
}

/** חץ "קדימה" — מצביע שמאלה, כי האתר בעברית */
export function IconArrowForward({ size = 24, className }: IconProps) {
  return (
    <svg {...svgProps(size, className)}>
      <path d="M19 12H5" />
      <path d="m11 18-6-6 6-6" />
    </svg>
  )
}

/** קישור חיצוני — חץ יוצא מקופסה, מותאם ל-RTL */
export function IconExternal({ size = 24, className }: IconProps) {
  return (
    <svg {...svgProps(size, className)}>
      <path d="M9 3H3v6" />
      <path d="M14 14 3 3" />
      <path d="M6 13v6a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-6" />
    </svg>
  )
}

/* ---------- אייקוני רשתות חברתיות — לקישורים בעמוד האישי ---------- */

/** אינסטגרם — מצלמה מרובעת עם עדשה */
export function IconInstagram({ size = 24, className }: IconProps) {
  return (
    <svg {...svgProps(size, className)}>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <path d="M17.2 6.8h.01" />
    </svg>
  )
}

/* לוגואים שמצוירים כמילוי (fill) ולא כקו — X, פייסבוק, טיקטוק */
function fillProps(size: number, className?: string) {
  return {
    className,
    width: size,
    height: size,
    viewBox: '0 0 24 24',
    fill: 'currentColor',
    'aria-hidden': true,
    focusable: false,
  } as const
}

/** X (טוויטר לשעבר) */
export function IconX({ size = 24, className }: IconProps) {
  return (
    <svg {...fillProps(size, className)}>
      <path d="M18.9 1.15h3.68l-8.04 9.19L24 22.85h-7.41l-5.8-7.58-6.64 7.58H.47l8.6-9.83L0 1.15h7.59l5.24 6.93Zm-1.29 19.5h2.04L6.49 3.24H4.3Z" />
    </svg>
  )
}

/** פייסבוק */
export function IconFacebook({ size = 24, className }: IconProps) {
  return (
    <svg {...fillProps(size, className)}>
      <path d="M24 12.07C24 5.45 18.63.07 12 .07S0 5.45 0 12.07c0 5.99 4.39 10.95 10.13 11.85v-8.38H7.08v-3.47h3.05V9.43c0-3 1.79-4.67 4.53-4.67 1.31 0 2.69.24 2.69.24v2.95h-1.52c-1.49 0-1.95.93-1.95 1.87v2.25h3.32l-.53 3.47h-2.79v8.38C19.61 23.02 24 18.06 24 12.07Z" />
    </svg>
  )
}

/** טיקטוק */
export function IconTikTok({ size = 24, className }: IconProps) {
  return (
    <svg {...fillProps(size, className)}>
      <path d="M12.53.02C13.84 0 15.14.01 16.44 0c.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07Z" />
    </svg>
  )
}
