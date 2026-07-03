import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter } from 'react-router'
// הגופנים ארוזים עם האתר — אין תלות ברשת בזמן ריצה:
// Heebo לטקסט רץ, Secular One לכותרות התצוגה
import '@fontsource-variable/heebo/index.css'
import '@fontsource/secular-one/index.css'
import './styles/tokens.css'
import './styles/global.css'
import App from './App'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/* HashRouter — ניווט ישיר לעמודים עובד גם באחסון סטטי כמו GitHub Pages */}
    <HashRouter>
      <App />
    </HashRouter>
  </StrictMode>,
)
