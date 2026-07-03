import { afterEach, describe, expect, it, vi } from 'vitest'
import { shuffle } from './shuffle'

afterEach(() => {
  vi.restoreAllMocks()
})

describe('shuffle', () => {
  it('לא משנה את המערך המקורי', () => {
    const source = ['א', 'ב', 'ג', 'ד', 'ה']
    const snapshot = [...source]
    shuffle(source)
    expect(source).toEqual(snapshot)
  })

  it('מחזיר תמורה — אותם איברים, אותו אורך', () => {
    const fixtures: number[][] = [[], [1], [1, 2], [1, 2, 3, 4, 5]]
    for (const fixture of fixtures) {
      const result = shuffle(fixture)
      expect(result).toHaveLength(fixture.length)
      expect([...result].sort()).toEqual([...fixture].sort())
    }
  })

  it('מחזיר מופע חדש של מערך', () => {
    const source = [1, 2, 3]
    expect(shuffle(source)).not.toBe(source)
  })

  it('מערבב דטרמיניסטית עם אקראיות מדומה', () => {
    // Math.random תמיד 0 — כל צעד מחליף את האיבר הנוכחי עם הראשון,
    // ולכן התוצאה על [1..5] ידועה מראש
    vi.spyOn(Math, 'random').mockReturnValue(0)
    expect(shuffle([1, 2, 3, 4, 5])).toEqual([2, 3, 4, 5, 1])
  })

  it('מפיק סדרים שונים עבור ערכי אקראיות שונים', () => {
    // ערך קבוע גבוה משאיר כל איבר במקומו (j === i בכל צעד)
    vi.spyOn(Math, 'random').mockReturnValue(0.999999)
    expect(shuffle([1, 2, 3, 4, 5])).toEqual([1, 2, 3, 4, 5])
  })
})
