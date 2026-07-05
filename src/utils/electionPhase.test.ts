import { DateTime, Settings } from 'luxon'
import { afterEach, describe, expect, it } from 'vitest'
import { electionConfig } from '../content/electionConfig'
import { infoSections } from '../content/infoSections'
import {
  getCountdownParts,
  getElectionBoundaries,
  getElectionPhase,
  isValidVotingUrl,
  parseSimulatedClock,
} from './electionPhase'

const zone = 'Asia/Jerusalem'

// בונה רגע מוחלט בשעון ישראל
function il(iso: string): DateTime {
  return DateTime.fromISO(iso, { zone })
}

// נקודות הזמן הנדרשות (מקור האמת: electionConfig)
const boundaries = getElectionBoundaries(electionConfig)
const cc = il('2026-07-10T22:00') // סגירת הגשת המועמדות
const rc = il('2026-07-15T22:00') // סגירת ספר המצביעים
const db = il('2026-07-18T22:00') // עימות המועמדים
const vo = il('2026-07-22T10:00') // פתיחת ההצבעה
const vc = il('2026-07-22T22:00') // סגירת ההצבעה

afterEach(() => {
  // מאפסים אזור ברירת מחדל אם נבדק שינוי שלו
  Settings.defaultZone = 'system'
})

describe('getElectionBoundaries', () => {
  it('כל חמש נקודות הזמן תקינות', () => {
    expect(boundaries.candidacyClose.isValid).toBe(true)
    expect(boundaries.registryClose.isValid).toBe(true)
    expect(boundaries.debate.isValid).toBe(true)
    expect(boundaries.votingOpen.isValid).toBe(true)
    expect(boundaries.votingClose.isValid).toBe(true)
  })

  it('הנקודות תואמות במדויק את המועדים הנדרשים', () => {
    expect(boundaries.candidacyClose.toMillis()).toBe(cc.toMillis())
    expect(boundaries.registryClose.toMillis()).toBe(rc.toMillis())
    expect(boundaries.debate.toMillis()).toBe(db.toMillis())
    expect(boundaries.votingOpen.toMillis()).toBe(vo.toMillis())
    expect(boundaries.votingClose.toMillis()).toBe(vc.toMillis())
  })

  it('יולי 2026 מזוהה כשעון קיץ ישראל (UTC+3)', () => {
    expect(vo.offset).toBe(180)
  })

  it('תאריך ריק אינו מפיל את המנוע ואינו מזייף "הצבעה נסגרה"', () => {
    const broken = getElectionBoundaries({ ...electionConfig, registryCloseDate: '' })
    expect(broken.registryClose.isValid).toBe(false)
    // גם הרבה אחרי כל התאריכים — נשארים בשלב הראשון בגלל נקודה לא-תקינה
    expect(getElectionPhase(il('2026-08-01T00:00'), broken).id).toBe('before-candidacy-close')
  })
})

describe('getElectionPhase — גבולות מדויקים', () => {
  it('הרבה לפני סגירת המועמדות → before-candidacy-close', () => {
    expect(getElectionPhase(il('2026-07-01T12:00'), boundaries).id).toBe('before-candidacy-close')
  })

  it('שנייה לפני סגירת המועמדות → before-candidacy-close', () => {
    expect(getElectionPhase(cc.minus({ seconds: 1 }), boundaries).id).toBe('before-candidacy-close')
  })

  it('בדיוק בסגירת המועמדות → before-registry-close (מעבר על הגבול)', () => {
    const p = getElectionPhase(cc, boundaries)
    expect(p.id).toBe('before-registry-close')
    expect(p.target?.toMillis()).toBe(rc.toMillis())
  })

  it('בין סגירת המועמדות לסגירת הספר → before-registry-close', () => {
    expect(getElectionPhase(il('2026-07-12T12:00'), boundaries).id).toBe('before-registry-close')
  })

  it('שנייה לפני סגירת הספר → before-registry-close', () => {
    expect(getElectionPhase(rc.minus({ seconds: 1 }), boundaries).id).toBe('before-registry-close')
  })

  it('בדיוק בסגירת הספר → before-debate (מעבר על הגבול)', () => {
    const p = getElectionPhase(rc, boundaries)
    expect(p.id).toBe('before-debate')
    expect(p.target?.toMillis()).toBe(db.toMillis())
  })

  it('בין הסגירה לעימות → before-debate', () => {
    expect(getElectionPhase(il('2026-07-16T12:00'), boundaries).id).toBe('before-debate')
  })

  it('שנייה לפני העימות → before-debate', () => {
    expect(getElectionPhase(db.minus({ seconds: 1 }), boundaries).id).toBe('before-debate')
  })

  it('בדיוק בעימות → before-voting', () => {
    const p = getElectionPhase(db, boundaries)
    expect(p.id).toBe('before-voting')
    expect(p.target?.toMillis()).toBe(vo.toMillis())
  })

  it('בין העימות לפתיחת ההצבעה → before-voting', () => {
    expect(getElectionPhase(il('2026-07-20T12:00'), boundaries).id).toBe('before-voting')
  })

  it('שנייה לפני פתיחת ההצבעה → before-voting', () => {
    expect(getElectionPhase(vo.minus({ seconds: 1 }), boundaries).id).toBe('before-voting')
  })

  it('בדיוק בפתיחת ההצבעה → voting-open', () => {
    const p = getElectionPhase(vo, boundaries)
    expect(p.id).toBe('voting-open')
    expect(p.target?.toMillis()).toBe(vc.toMillis())
  })

  it('במהלך ההצבעה → voting-open', () => {
    expect(getElectionPhase(il('2026-07-22T15:00'), boundaries).id).toBe('voting-open')
  })

  it('שנייה לפני סגירת ההצבעה → voting-open', () => {
    expect(getElectionPhase(vc.minus({ seconds: 1 }), boundaries).id).toBe('voting-open')
  })

  it('בדיוק בסגירת ההצבעה → voting-closed (בלי יעד ספירה)', () => {
    const p = getElectionPhase(vc, boundaries)
    expect(p.id).toBe('voting-closed')
    expect(p.target).toBeNull()
  })

  it('אחרי סגירת ההצבעה → voting-closed', () => {
    expect(getElectionPhase(il('2026-07-23T09:00'), boundaries).id).toBe('voting-closed')
  })
})

describe('getElectionPhase — עמידות לאזור זמן שאינו ישראל', () => {
  it('אותו רגע מיוצג בניו-יורק → אותו שלב (שנייה לפני פתיחה)', () => {
    const nyBefore = DateTime.fromMillis(vo.minus({ seconds: 1 }).toMillis(), {
      zone: 'America/New_York',
    })
    expect(getElectionPhase(nyBefore, boundaries).id).toBe('before-voting')
  })

  it('אותו רגע מיוצג בניו-יורק → אותו שלב (בדיוק בפתיחה)', () => {
    const nyAt = DateTime.fromMillis(vo.toMillis(), { zone: 'America/New_York' })
    expect(getElectionPhase(nyAt, boundaries).id).toBe('voting-open')
  })

  it('אזור ברירת המחדל של המערכת אינו משפיע על התוצאה', () => {
    Settings.defaultZone = 'America/New_York'
    const local = getElectionBoundaries(electionConfig)
    expect(local.votingOpen.offset).toBe(180) // עדיין נבנה עם zone מפורש
    expect(getElectionPhase(il('2026-07-22T15:00'), local).id).toBe('voting-open')
  })
})

describe('getCountdownParts', () => {
  it('כשהיעד עבר — הכול אפס, אין ערכים שליליים', () => {
    const parts = getCountdownParts(vo.plus({ seconds: 5 }), vo)
    expect(parts).toMatchObject({ days: 0, hours: 0, minutes: 0, seconds: 0, isElapsed: true })
    expect(parts.totalMs).toBe(0)
  })

  it('מפרק נכון משך של יום, שעתיים, 3 דקות ו-4 שניות', () => {
    const now = il('2026-07-01T00:00')
    const target = DateTime.fromMillis(now.toMillis() + (((1 * 24 + 2) * 60 + 3) * 60 + 4) * 1000)
    expect(getCountdownParts(now, target)).toMatchObject({
      days: 1,
      hours: 2,
      minutes: 3,
      seconds: 4,
    })
  })

  it('חצי שנייה מעוגלת כלפי מעלה ל-1 (בלי אפס מוקדם)', () => {
    const now = il('2026-07-01T00:00')
    const target = DateTime.fromMillis(now.toMillis() + 500)
    const parts = getCountdownParts(now, target)
    expect(parts.seconds).toBe(1)
    expect(parts.isElapsed).toBe(false)
  })
})

describe('isValidVotingUrl', () => {
  it('מחרוזת ריקה → false', () => expect(isValidVotingUrl('')).toBe(false))
  it('https תקין → true', () => expect(isValidVotingUrl('https://vote.example.com/x')).toBe(true))
  it('http תקין → true', () => expect(isValidVotingUrl('http://vote.example.com')).toBe(true))
  it('javascript: → false', () => expect(isValidVotingUrl('javascript:alert(1)')).toBe(false))
  it('ftp: → false', () => expect(isValidVotingUrl('ftp://host/file')).toBe(false))
  it('כתובת בלי סכימה → false', () => expect(isValidVotingUrl('vote.example.com')).toBe(false))
  it('רווחים בלבד → false', () => expect(isValidVotingUrl('   ')).toBe(false))
})

describe('parseSimulatedClock', () => {
  it('null → null', () => expect(parseSimulatedClock(null, electionConfig)).toBeNull())
  it('ריק → null', () => expect(parseSimulatedClock('', electionConfig)).toBeNull())
  it('ISO תקין → DateTime תקין בשעון ישראל', () => {
    const dt = parseSimulatedClock('2026-07-22T09:59:59', electionConfig)
    expect(dt?.isValid).toBe(true)
    expect(dt?.offset).toBe(180)
  })
  it('זבל → null', () => expect(parseSimulatedClock('garbage', electionConfig)).toBeNull())
})

describe('מעבר שלב ללא רענון (הוכחה ברמת הלוגיקה)', () => {
  it('שנייה לפני הגבול ובדיוק בגבול מחזירים שלבים שונים', () => {
    expect(getElectionPhase(rc.minus({ seconds: 1 }), boundaries).id).not.toBe(
      getElectionPhase(rc, boundaries).id,
    )
    expect(getElectionPhase(vc.minus({ seconds: 1 }), boundaries).id).not.toBe(
      getElectionPhase(vc, boundaries).id,
    )
  })
})

describe('סנכרון בין ההגדרות ללוח הזמנים (drift-guard)', () => {
  it('הגבולות שנגזרו מ-electionConfig תואמים את מחרוזות התצוגה ב-infoSections', () => {
    const schedule = infoSections.find((section) => section.id === 'schedule')
    const events = schedule?.events ?? []
    expect(events).toHaveLength(4)

    expect(boundaries.candidacyClose.setZone(zone).toFormat('d.M.yyyy')).toBe(events[0].date)
    expect(boundaries.candidacyClose.setZone(zone).toFormat('HH:mm')).toBe(events[0].time)

    expect(boundaries.registryClose.setZone(zone).toFormat('d.M.yyyy')).toBe(events[1].date)
    expect(boundaries.registryClose.setZone(zone).toFormat('HH:mm')).toBe(events[1].time)

    expect(boundaries.debate.setZone(zone).toFormat('d.M.yyyy')).toBe(events[2].date)
    expect(boundaries.debate.setZone(zone).toFormat('HH:mm')).toBe(events[2].time)

    expect(boundaries.votingOpen.setZone(zone).toFormat('d.M.yyyy')).toBe(events[3].date)
    // טווח שעות ההצבעה — בודקים הכלה כדי לא להיתלות בתו המקף המדויק
    expect(events[3].time).toContain(boundaries.votingOpen.setZone(zone).toFormat('HH:mm'))
    expect(events[3].time).toContain(boundaries.votingClose.setZone(zone).toFormat('HH:mm'))
  })
})
