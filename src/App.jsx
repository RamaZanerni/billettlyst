import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Hjem from './pages/Hjem'
import EventPage from './pages/EventPage';
import CategoryPage from './pages/CategoryPage';
import Dashboard from './pages/Dashboard';

import FestivalEventsPage from './pages/FestivalEventPage';


function App() {
  return (
    
    <Router>
      
      <Routes>
      
        <Route path="/" element={<Hjem />} />
        {/* senere: /event/:id, /kategori/:slug, /dashboard */}
        <Route path="/event/:id" element={<EventPage />} />
        <Route path="/category/:slug" element={<CategoryPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        
        <Route path="/festivals/:festivalName" element={<FestivalEventsPage />} />

      </Routes>
    </Router>
  )
}

export default App
