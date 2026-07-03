import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter } from 'react-router'
// גופן Heebo ארוז עם האתר — אין תלות ברשת בזמן ריצה
import '@fontsource-variable/heebo/index.css'
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
