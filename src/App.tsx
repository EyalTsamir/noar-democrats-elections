import { Route, Routes } from 'react-router'
import { CandidateOrderProvider } from './components/CandidateOrderProvider'
import { DevPanelProvider } from './components/DevPanelProvider'
import { DevPhasePanel } from './components/DevPhasePanel'
import { Layout } from './components/Layout'
import { ScrollToTop } from './components/ScrollToTop'
import { CandidatePage } from './pages/CandidatePage'
import { CommitteePage } from './pages/CommitteePage'
import { HomePage } from './pages/HomePage'
import { InfoPage } from './pages/InfoPage'
import { NotFoundPage } from './pages/NotFoundPage'

export default function App() {
  return (
    <DevPanelProvider>
      <ScrollToTop />
      <CandidateOrderProvider>
        <Layout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/candidate/:slug" element={<CandidatePage />} />
            <Route path="/info" element={<InfoPage />} />
            <Route path="/committee" element={<CommitteePage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Layout>
      </CandidateOrderProvider>
      {/* בקרת סימולציית זמן — מוסתרת כברירת מחדל, נחשפת רק כאיסטר-אג */}
      <DevPhasePanel />
    </DevPanelProvider>
  )
}
