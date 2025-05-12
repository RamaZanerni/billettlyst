import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Layout from '../components/Layout';
import FestivalEventCard from '../components/FestivalEventCard';
import '../App.css';

const API_KEY = 'c7qLAjGlWre3Sm9jj1V9lpc5Mr5zmlw0';

function FestivalEventsPage() {
  const { festivalName } = useParams();
  const [events, setEvents] = useState([]);
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem('festivalFavorites');
    return saved ? JSON.parse(saved) : [];
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [festivalGenres, setFestivalGenres] = useState([]);
  const [uniqueArtists, setUniqueArtists] = useState([]);

  // Toggle favorite status
  const toggleFavorite = (eventId) => {
    setFavorites(prev => {
      const newFavorites = prev.includes(eventId)
        ? prev.filter(id => id !== eventId)
        : [...prev, eventId];
      localStorage.setItem('festivalFavorites', JSON.stringify(newFavorites));
      return newFavorites;
    });
  };

  const isFavorite = (eventId) => favorites.includes(eventId);

  // Extract unique genres from events
  const extractUniqueGenres = (events) => {
    const genres = new Set();
    
    events.forEach(event => {
      if (event.genre && event.genre !== 'Undefined') genres.add(event.genre);
      if (event.subGenre && event.subGenre !== 'Undefined') genres.add(event.subGenre);
      if (event.segment && event.segment !== 'Undefined') genres.add(event.segment);
    });
    
    setFestivalGenres(Array.from(genres).filter(genre => genre && genre !== 'Undefined'));
  };

  // Extract unique human artists from events
  const extractUniqueArtists = (events) => {
    const artistMap = new Map();
    
    events.forEach(event => {
      event.artists?.forEach(artist => {
        // Only include if it's a human performer (not another event or attraction)
        if (artist.type === 'individual' || 
            (artist.classifications?.[0]?.segment?.name === 'Music' && 
             artist.classifications?.[0]?.genre?.name !== 'Other')) {
          if (!artistMap.has(artist.id)) {
            artistMap.set(artist.id, artist);
          }
        }
      });
    });
    
    setUniqueArtists(Array.from(artistMap.values()));
  };

  const fetchEvents = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const searchKeyword = festivalName.replace(/-/g, ' ');
      const response = await fetch(
        `https://app.ticketmaster.com/discovery/v2/events.json?keyword=${encodeURIComponent(searchKeyword)}&apikey=${API_KEY}&size=50`
      );
      
      if (!response.ok) throw new Error('Failed to fetch events');
      
      const data = await response.json();
      
      // Check if events exist in the response
      if (!data._embedded?.events || data._embedded.events.length === 0) {
        // Try a more general search if no exact matches found
        const generalResponse = await fetch(
          `https://app.ticketmaster.com/discovery/v2/events.json?keyword=${encodeURIComponent(searchKeyword.split(' ')[0])}&apikey=${API_KEY}&size=50`
        );
        
        if (!generalResponse.ok) throw new Error('No events found for this festival');
        
        const generalData = await generalResponse.json();
        
        if (!generalData._embedded?.events || generalData._embedded.events.length === 0) {
          throw new Error('No events found for this festival');
        }
        
        data._embedded = generalData._embedded;
      }
      
      const formattedEvents = data._embedded.events.map(event => ({
        id: event.id,
        title: event.name,
        image: event.images?.find(img => img.width > 1000)?.url || 
               event.images?.[0]?.url || 
               'https://via.placeholder.com/500',
        city: event._embedded?.venues?.[0]?.city?.name || 'Unknown City',
        country: event._embedded?.venues?.[0]?.country?.name || 'Unknown Country',
        date: event.dates?.start?.localDate || 'Date not available',
        genre: event.classifications?.[0]?.genre?.name || 'Music Festival',
        subGenre: event.classifications?.[0]?.subGenre?.name || '',
        segment: event.classifications?.[0]?.segment?.name || '',
        // Add artists information with more details
        artists: event._embedded?.attractions?.map(attraction => ({
          id: attraction.id,
          name: attraction.name,
          image: attraction.images?.find(img => img.width > 1000)?.url || 
                 attraction.images?.[0]?.url || 
                 'https://via.placeholder.com/500',
          type: attraction.type,
          classifications: attraction.classifications
        })) || []
      }));
      
      setEvents(formattedEvents);
      extractUniqueGenres(formattedEvents);
      extractUniqueArtists(formattedEvents);
    } catch (err) {
      setError(err.message);
      setEvents([]);
      setFestivalGenres([]);
      setUniqueArtists([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [festivalName]);

  const displayName = festivalName.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading events...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <h2>Couldn't load events</h2>
        <p>{error}</p>
        <button onClick={fetchEvents}>Try Again</button>
      </div>
    );
  }

  return (
    <Layout>
      <div className="festival-events-page">
        <h1>{displayName}</h1>
        <div className='festival-container'>
          {festivalGenres.length > 0 && (
            <div className="festivalGenre">
              <h2>Sjanger:</h2>
              <ul>
                {festivalGenres.map((genre, index) => (
                  <li className='festivalGenreLabel' key={index}>{genre}</li>
                ))}
              </ul>
            </div>
          )}
          
          <div className="festivalSocialMedia">
            <h2>Social Media:</h2>
            <div className="social-icons">
              <a href="#" target="_blank" rel="noopener noreferrer">Twitter</a>
              <a href="#" target="_blank" rel="noopener noreferrer">Facebook</a>
              <a href="#" target="_blank" rel="noopener noreferrer">Instagram</a>
            </div>
          </div>
          
          <div className="festivalPass">
            <h2>Festivalpass:</h2>
            <div className="events-grid">
              {events.map(event => (
                <FestivalEventCard
                  key={event.id}
                  id={event.id}
                  tittel={event.title}
                  bilde={event.image}
                  by={event.city}
                  land={event.country}
                  dato={event.date}
                  genre={event.genre}
                  erFavoritt={isFavorite(event.id)}
                  onToggleFavoritt={toggleFavorite}
                />
              ))}
            </div>
          </div>

          <div className="festivalArtist">
            <h2>Artister:</h2>
            {uniqueArtists.length > 0 ? (
              <div className="events-grid">
                {uniqueArtists.map(artist => (
                  <div key={artist.id} className="artist-card">
                    <img 
                      src={artist.image} 
                      alt={artist.name} 
                      onError={(e) => {
                        e.target.onerror = null; 
                        e.target.src = 'https://via.placeholder.com/500';
                      }}
                    />
                    <h4>{artist.name}</h4>
                  </div>
                ))}
              </div>
            ) : (
              <p>No artist information available</p>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default FestivalEventsPage;