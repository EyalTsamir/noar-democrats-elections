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
