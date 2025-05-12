import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import EventCard from '../components/EventCard';
import FestivalEventCard from '../components/FestivalCard';
import Layout from '../components/Layout';
import '../styles/global.css';
import '../styles/Hjem.css';

const API_KEY = 'c7qLAjGlWre3Sm9jj1V9lpc5Mr5zmlw0';

function Hjem() {
  const navigate = useNavigate();
  const [favoritter, settFavoritter] = useState([]);
  const [festivaler, settFestivaler] = useState([]);
  const [byEvents, settByEvents] = useState([]);
  const [valgtBy, settValgtBy] = useState('Oslo');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const targetFestivals = [
    { 
      id: 'findings',
      name: 'Findings Festival',
      keyword: 'Findings Festival',
      fallbackImage: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
    },
    { 
      id: 'neon',
      name: 'NEON Festival',
      keyword: 'NEON Festival',
      fallbackImage: 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
    },
    { 
      id: 'skeikampen',
      name: 'Skeikampenfestivalen',
      keyword: 'Skeikampen festivalen 2025',
      fallbackImage: 'https://images.unsplash.com/photo-1472653431158-6364773b2a56?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
    },
    { 
      id: 'tons-of-rock',
      name: 'Tons of Rock',
      keyword: 'Tons of Rock',
      fallbackImage: 'https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
    }
  ];

  const storbyer = ['Oslo', 'Berlin', 'London', 'Paris'];

  useEffect(() => {
    const lagrede = JSON.parse(localStorage.getItem('favoritter')) || [];
    settFavoritter(lagrede);

    const fetchFestivals = async () => {
      try {
        const results = await Promise.all(
          targetFestivals.map(async (festival) => {
            try {
              // Special handling for Skeikampenfestivalen
              if (festival.id === 'skeikampen') {
                return {
                  ...festival,
                  eventData: {
                    id: festival.id,
                    name: festival.name,
                    images: [{ url: festival.fallbackImage }],
                    _embedded: {
                      venues: [{
                        city: { name: 'Skeikampen' },
                        country: { name: 'Norway' }
                      }]
                    },
                    dates: { start: { localDate: '2023-08-10' } },
                    classifications: [{
                      genre: { name: 'Music Festival' }
                    }]
                  }
                };
              }

              // Special handling for NEON Festival
              if (festival.id === 'neon') {
                const res = await fetch(
                  `https://corsproxy.io/?https://app.ticketmaster.com/discovery/v2/events.json?apikey=${API_KEY}&keyword=${encodeURIComponent(festival.keyword)}&size=1`
                );
                const data = await res.json();
                
                const neonEvent = data._embedded?.events?.find(e => 
                  e.name.toLowerCase().includes('neon festival')
                );

                if (!neonEvent) {
                  return {
                    ...festival,
                    eventData: {
                      id: festival.id,
                      name: festival.name,
                      images: [{ url: festival.fallbackImage }],
                      _embedded: {
                        venues: [{
                          city: { name: 'Oslo' },
                          country: { name: 'Norway' }
                        }]
                      },
                      dates: { start: { localDate: 'Coming soon' } },
                      classifications: [{
                        genre: { name: 'Music Festival' }
                      }]
                    }
                  };
                }

                return {
                  ...festival,
                  eventData: neonEvent
                };
              }

              // Default handling for other festivals
              const res = await fetch(
                `https://corsproxy.io/?https://app.ticketmaster.com/discovery/v2/events.json?apikey=${API_KEY}&keyword=${encodeURIComponent(festival.keyword)}&size=1`
              );
              const data = await res.json();
              
              if (!data._embedded?.events?.[0]) {
                return {
                  ...festival,
                  eventData: {
                    id: festival.id,
                    name: festival.name,
                    images: [{ url: festival.fallbackImage }],
                    _embedded: {
                      venues: [{
                        city: { name: 'Various' },
                        country: { name: 'Various' }
                      }]
                    },
                    dates: { start: { localDate: 'Coming soon' } },
                    classifications: [{
                      genre: { name: 'Music Festival' }
                    }]
                  }
                };
              }
              
              return {
                ...festival,
                eventData: data._embedded.events[0]
              };
            } catch (err) {
              console.error(`Error fetching ${festival.name}:`, err);
              return {
                ...festival,
                eventData: {
                  id: festival.id,
                  name: festival.name,
                  images: [{ url: festival.fallbackImage }],
                  _embedded: {
                    venues: [{
                      city: { name: 'Various' },
                      country: { name: 'Various' }
                    }]
                  },
                  dates: { start: { localDate: 'Coming soon' } },
                  classifications: [{
                    genre: { name: 'Music Festival' }
                  }]
                }
              };
            }
          })
        );
        settFestivaler(results);
      } catch (err) {
        setError('Kunne ikke hente festivaldata');
        console.error('Fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchFestivals();
  }, []);

  useEffect(() => {
    const hentByEvents = async () => {
      try {
        const res = await fetch(
          `https://corsproxy.io/?https://app.ticketmaster.com/discovery/v2/events.json?apikey=${API_KEY}&city=${valgtBy}&size=10`
        );
        const data = await res.json();
        settByEvents(data._embedded?.events || []);
      } catch (err) {
        console.error('Feil ved henting av byarrangementer:', err);
      }
    };

    hentByEvents();
  }, [valgtBy]);

  const byttFavoritt = (id) => {
    const oppdatert = favoritter.includes(id)
      ? favoritter.filter((fid) => fid !== id)
      : [...favoritter, id];
    settFavoritter(oppdatert);
    localStorage.setItem('favoritter', JSON.stringify(oppdatert));
  };

  const handleEventClick = (id) => {
    navigate(`/event/${id}`);
  };

  if (loading) {
    return (
      <Layout>
        <div className="loading-spinner"></div>
        <p>Laster festivaler...</p>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="error-message">
          <p>{error}</p>
          <button onClick={() => window.location.reload()}>Prøv på nytt</button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container">
        <h2 className="page-title">SOMMERENS FESTIVALER!</h2>
        
        <div className="festival-row">
          {festivaler.map((festival) => {
            const event = festival.eventData;
            return (
              <FestivalEventCard
                key={festival.id}
                id={festival.id}
                name={event.name || festival.name}
                image={event.images?.[0]?.url || festival.fallbackImage}
                city={event._embedded?.venues?.[0]?.city?.name || 'Oslo'}
                country={event._embedded?.venues?.[0]?.country?.name || 'Norway'}
                date={event.dates?.start?.localDate}
                genre={event.classifications?.[0]?.genre?.name || 'Music Festival'}
              />
            );
          })}
        </div>

        <h2 className="page-title section-title">Hva skjer i verdens storbyer!</h2>
        <div className="city-buttons">
          {storbyer.map((by) => (
            <button
              key={by}
              className={`city-button ${valgtBy === by ? 'active' : ''}`}
              onClick={() => settValgtBy(by)}
            >
              {by}
            </button>
          ))}
        </div>

        <h2 className="page-title">Du kan oppleve {valgtBy}</h2>
        {byEvents.length === 0 ? (
          <p className="no-events">Ingen arrangementer funnet i {valgtBy}</p>
        ) : (
          <div className="event-grid">
            {byEvents.map((event) => (
              <EventCard
                key={event.id}
                id={event.id}
                tittel={event.name}
                bilde={event.images?.[0]?.url}
                by={event._embedded?.venues[0]?.city?.name}
                land={event._embedded?.venues[0]?.country?.name}
                dato={`${event.dates?.start?.localDate || ''} ${event.dates?.start?.localTime || ''}`}
                klikkbar={true}
                erFavoritt={favoritter.includes(event.id)}
                onToggleFavoritt={byttFavoritt}
              />
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}

export default Hjem;