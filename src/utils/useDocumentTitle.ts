import { useEffect } from 'react'
import { electionConfig } from '../content/electionConfig'

/** מעדכן את כותרת הלשונית בדפדפן: "שם העמוד | שם האתר" */
export function useDocumentTitle(pageTitle?: string): void {
  useEffect(() => {
    document.title = pageTitle
      ? `${pageTitle} | ${electionConfig.siteTitle}`
      : electionConfig.siteTitle
  }, [pageTitle])
}
