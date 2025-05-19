import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import ArtistCard from '../components/ArtistCard';
import '../styles/EventPage.css';

const API_KEY = 'c7qLAjGlWre3Sm9jj1V9lpc5Mr5zmlw0';

function EventPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [relatedEvents, setRelatedEvents] = useState([]);
  const [artists, setArtists] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('info');

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('favoritter')) || [];
    setFavorites(saved);
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
    const fetchData = async () => {
      try {
        // Fetch main event
        const eventRes = await fetch(
  `/discovery/v2/events/${id}.json?apikey=${API_KEY}`
        );
        const eventData = await eventRes.json();
        setEvent(eventData);
         await delay(300);

        // Fetch related events
        const keyword = encodeURIComponent(eventData.name.split(' ')[0]);
        const relatedRes = await fetch(
  `/discovery/v2/events.json?apikey=${API_KEY}&keyword=${keyword}&size=4`
        );
        const relatedData = await relatedRes.json();
        setRelatedEvents(relatedData._embedded?.events?.filter(e => e.id !== id) || []);

        // Fetch artists
        if (eventData._embedded?.attractions) {
          setArtists(eventData._embedded.attractions);
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const toggleFavorite = () => {
    const updated = favorites.includes(id)
      ? favorites.filter(fid => fid !== id)
      : [...favorites, id];
    setFavorites(updated);
    localStorage.setItem('favoritter', JSON.stringify(updated));
  };

  if (loading) return <div className="loading">Laster...</div>;
  if (!event) return <div className="error">Fant ikke arrangement</div>;

  return (
    <Layout>
      <div className="event-container">
        <button onClick={() => navigate(-1)} className="back-button">
          &larr; Tilbake
        </button>

        <div className="main-event">
          <h1>{event.name}</h1>
          <div className="event-header">
            <img 
              src={event.images?.find(img => img.width > 800)?.url} 
              alt={event.name} 
              className="event-main-image"
            />
            
            <div className="event-actions">
              <button className="buy-button">Kjøp Billett</button>
              <button 
                onClick={toggleFavorite}
                className={`favorite-btn ${favorites.includes(id) ? 'active' : ''}`}
              >
                {favorites.includes(id) ? '✓ I ønskeliste' : '+ Legg til ønskeliste'}
              </button>
            </div>
          </div>
          
          <div className="event-tabs">
            <button 
              className={`tab-button ${activeTab === 'info' ? 'active' : ''}`}
              onClick={() => setActiveTab('info')}
            >
              Informasjon
            </button>
            <button 
              className={`tab-button ${activeTab === 'transport' ? 'active' : ''}`}
              onClick={() => setActiveTab('transport')}
            >
              Transport
            </button>
            <button 
              className={`tab-button ${activeTab === 'social' ? 'active' : ''}`}
              onClick={() => setActiveTab('social')}
            >
              Sosiale Medier
            </button>
          </div>
          
          <div className="tab-content">
            {activeTab === 'info' && (
              <div className="event-info">
                <p><strong>Sted:</strong> {event._embedded?.venues?.[0]?.city?.name} {event._embedded?.venues?.[0]?.country?.name}</p>
                <p><strong>Adresse:</strong> {event._embedded?.venues?.[0]?.address?.line1}</p>
                <p><strong>Dato:</strong> {event.dates?.start?.localDate}</p>
                <p><strong>Tid:</strong> {event.dates?.start?.localTime}</p>
                <p><strong>Sjanger:</strong> {event.classifications?.[0]?.genre?.name || 'Festival'}</p>
                <p><strong>Beskrivelse:</strong> {event.info || 'Ingen beskrivelse tilgjengelig'}</p>
              </div>
            )}
            
            {activeTab === 'transport' && (
              <div className="transport-info">
                <h3>Festival Busser</h3>
                <p>Det vil være dedikerte festivalbusser fra sentrum til festivalområdet:</p>
                <ul>
                  <li>Avgang hver 30. minutt fra 10:00 til 02:00</li>
                  <li>Pris: 50 NOK per tur</li>
                  <li>Bussholdeplass: Sentralstasjonen</li>
                </ul>
                
                <h3>Parkering</h3>
                <p>Begrenset parkering tilgjengelig nær festivalområdet. Anbefaler å bruke kollektivtransport.</p>
              </div>
            )}
            
            {activeTab === 'social' && (
              <div className="social-media">
                <h3>Følg oss på sosiale medier</h3>
                <div className="social-links">
                  <a href="#" className="social-link facebook">Facebook</a>
                  <a href="#" className="social-link instagram">Instagram</a>
                  <a href="#" className="social-link twitter">Twitter</a>
                </div>
                
                <h3>#FestivalHashtag</h3>
                <p>Bruk hashtaggen <strong>#{event.name.replace(/\s+/g, '')}</strong> for å dele dine opplevelser!</p>
              </div>
            )}
          </div>
        </div>

        {artists.length > 0 && (
          <div className="artists-section">
            <h2>Artister</h2>
            <div className="artists-grid">
              {artists.map(artist => (
                <ArtistCard
                  key={artist.id}
                  name={artist.name}
                  image={artist.images?.[0]?.url}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}

export default EventPage;