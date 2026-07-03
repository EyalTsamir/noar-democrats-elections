import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // בסיס יחסי: הבנייה עובדת מכל נתיב-משנה של GitHub Pages בלי הגדרה נוספת.
  // בטוח רק בשילוב HashRouter — המסמך נשאר תמיד ב-index.html.
  base: './',
})
