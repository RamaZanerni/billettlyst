import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Hjem from './pages/Hjem'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Hjem />} />
        {/* senere: /hendelse/:id, /kategori/:slug, /dashboard */}
      </Routes>
    </Router>
  )
}

export default App
