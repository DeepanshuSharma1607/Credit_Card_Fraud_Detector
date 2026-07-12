import { Route, BrowserRouter, Routes } from 'react-router-dom'
import Masthead from './components/Masthead'
import Footer from './components/Footer'
import NewCasePage from './pages/NewCasePage'
import LedgerPage from './pages/LedgerPage'

export default function App() {
  return (
    <BrowserRouter>
      <div className="flex min-h-screen flex-col">
        <Masthead />
        <main className="newsprint-texture flex-1">
          <Routes>
            <Route path="/" element={<NewCasePage />} />
            <Route path="/ledger" element={<LedgerPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  )
}
