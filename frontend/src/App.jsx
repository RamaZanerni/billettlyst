import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Hjem from './pages/Hjem'
import EventPage from './pages/EventPage';
import CategoryPage from './pages/CategoryPage';
import Dashboard from './pages/Dashboard';
import { SanityProvider } from './providers/SanityProvider'
import FestivalEventsPage from './pages/FestivalEventPage';
import EventDetails  from './pages/EventDetails';
import SanityEventDetails  from './components/SanityEventDetails';



function App() {
  return (
     <SanityProvider>
    <Router>
      
      <Routes>
      
        <Route path="/" element={<Hjem />} />
        {/* senere: /event/:id, /kategori/:slug, /dashboard */}
        <Route path="/event/:id" element={<EventPage />} />
        <Route path="/category/:slug" element={<CategoryPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/sanity-event/:id" element={<SanityEventDetails />} />
        <Route path="/festivals/:festivalName" element={<FestivalEventsPage />} />
          <Route path="/dashboard/event/:eventId" element={<EventDetails />} />

        

      </Routes>
    </Router>
    </SanityProvider>
  )
}

export default App
