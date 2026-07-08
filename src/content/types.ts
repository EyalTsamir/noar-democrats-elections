/**
 * ============================================================
 * הגדרות הטיפוסים של תוכן האתר
 * ============================================================
 * הקובץ הזה מגדיר את "הצורה" של התוכן — אילו שדות קיימים ומה שמים בהם.
 * בדרך כלל אין צורך לערוך אותו.
 * את התוכן עצמו עורכים בקבצים שלצידו:
 *   electionConfig.ts — טקסטים כלליים, תאריכים וקישורים
 *   candidates.ts     — המועמדים והמועמדות
 *   committee.ts      — ועדת הבחירות
 */

/** קישור לרשת חברתית או לעמוד חיצוני */
export interface SocialLink {
  /** הטקסט שיוצג על הקישור, למשל: "האינסטגרם של דנה" */
  label: string;
  /** הכתובת המלאה — חייבת להתחיל ב-https://‎ */
  url: string;
}

/** חבר/ת מזכירות מוצעת של מועמד/ת */
export interface SecretariatMember {
  /** שם מלא בעברית */
  name: string;
  /** תחום אחריות מוצע (לא חובה) */
  role?: string;
}

/** מועמד/ת בבחירות */
export interface Candidate {
  /** מזהה ייחודי וקבוע באנגלית — לא ישתנה גם אם שאר הפרטים ישתנו */
  id: string;
  /**
   * קובע את כתובת העמוד של המועמד/ת.
   * אותיות אנגליות קטנות ומקפים בלבד, למשל: 'dana-cohen'
   */
  slug: string;
  /** השם המלא בעברית */
  fullName: string;
  /**
   * שם קובץ התמונה בלבד (לא נתיב!) — הקובץ יושב בתיקייה public/candidates
   * מומלץ ששם הקובץ יהיה זהה ל-slug, למשל: 'dana-cohen.jpg'
   */
  image: string;
  /**
   * תיאור מילולי של התמונה לקוראי מסך (לא חובה).
   * אם משאירים ריק — יוצג השם המלא במקום.
   */
  imageAlt?: string;
  /** המשפט המרכזי — מוצג מודגש ובולט */
  mainStatement: string;
  /** הטקסט האישי — כל פריט במערך הוא פסקה נפרדת */
  personalText: string[];
  /** המזכירות המוצעת (לא חובה) */
  proposedSecretariat?: SecretariatMember[];
  /** קישורים לרשתות חברתיות (לא חובה, אפשר כמה) */
  socialLinks?: SocialLink[];
}

/** חבר/ת ועדת הבחירות */
export interface CommitteeMember {
  /** שם מלא בעברית */
  name: string;
  /** פירוט נוסף על התפקיד (לא חובה) */
  role?: string;
}

/** קבוצת בעלי תפקיד בוועדה — למשל "יושב/ת ראש" או "חברי הוועדה" */
export interface CommitteeGroup {
  /** כותרת הקבוצה שתוצג מעל הרשימה */
  roleTitle: string;
  /** האנשים בקבוצה */
  members: CommitteeMember[];
}

/** אירוע מתוארך בלוח הזמנים של הבחירות */
export interface ScheduleEvent {
  /** תאריך בפורמט תצוגה, למשל: '15.7.2026' */
  date: string;
  /** שעה או טווח שעות, למשל: '22:00' או '10:00–22:00' */
  time: string;
  /** מה קורה במועד הזה */
  title: string;
}

/**
 * מקטע בעמוד "מידע על הבחירות" — ממלאים רק את השדות הרלוונטיים.
 * מקטע יכול לשלב אירועים מתוארכים, נקודות ופסקאות (בסדר הזה).
 */
export interface InfoSection {
  /** מזהה באנגלית לצרכים טכניים — לא מוצג באתר */
  id: string;
  /** כותרת המקטע */
  title: string;
  /** אירועים מתוארכים (לא חובה) */
  events?: ScheduleEvent[];
  /** רשימת נקודות (לא חובה) */
  bullets?: string[];
  /** פסקאות טקסט חופשי (לא חובה) */
  paragraphs?: string[];
}

/** ההגדרות הכלליות של מערכת הבחירות והאתר */
export interface ElectionConfig {
  /** שם האתר המלא */
  siteTitle: string;
  /** שם קצר — מוצג בסרגל העליון */
  siteShortTitle: string;
  /** פסקת הפתיחה בעמוד הבית */
  introText: string;
  /** אזור הזמן של הבחירות — קבוע, אין לשנות */
  timezone: 'Asia/Jerusalem';
  /** תאריך סגירת הגשת המועמדות בפורמט 'YYYY-MM-DD' */
  candidacyCloseDate: string;
  /** שעת סגירת הגשת המועמדות בפורמט 'HH:MM' */
  candidacyCloseTime: string;
  /** תאריך סגירת ספר המצביעים בפורמט 'YYYY-MM-DD' */
  registryCloseDate: string;
  /** שעת סגירת ספר המצביעים בפורמט 'HH:MM' */
  registryCloseTime: string;
  /** תאריך עימות המועמדים בפורמט 'YYYY-MM-DD' */
  debateDate: string;
  /** שעת עימות המועמדים בפורמט 'HH:MM' */
  debateTime: string;
  /** תאריך יום הבחירות בפורמט 'YYYY-MM-DD' (ריק = טרם נקבע) */
  electionDate: string;
  /** שעת פתיחת ההצבעה בפורמט 'HH:MM' (ריק = טרם נקבע) */
  votingStartTime: string;
  /** שעת סגירת ההצבעה בפורמט 'HH:MM' (ריק = טרם נקבע) */
  votingEndTime: string;
  /** הטקסט במקטע "מי זכאי להצביע" בעמוד המידע (כ־30 מילים) */
  eligibilityText: string;
  /** הטקסט במקטע "כיצד תתבצע ההצבעה" בעמוד המידע (כ־40 מילים) */
  votingMethodText: string;
  /** קישור להצבעה — יוצג באתר רק בשלב מאוחר יותר */
  votingUrl: string;
}
