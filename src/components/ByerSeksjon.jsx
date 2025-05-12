import { useState, useEffect } from 'react';
import EventCard from './EventCard';

const API_KEY = 'c7qLAjGlWre3Sm9jj1V9lpc5Mr5zmlw0';

const byer = ['Oslo', 'Stockholm', 'Berlin', 'London', 'Paris'];

function ByerSeksjon() {
  const [valgtBy, setValgtBy] = useState('Oslo');
  const [arrangementer, setArrangementer] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const hentArrangementer = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `https://corsproxy.io/?https://app.ticketmaster.com/discovery/v2/events.json?apikey=${API_KEY}&city=${valgtBy}&size=8`
        );
        const data = await res.json();
        setArrangementer(data._embedded?.events || []);
      } catch (error) {
        console.error('Feil ved henting:', error);
      } finally {
        setLoading(false);
      }
    };

    hentArrangementer();
  }, [valgtBy]);

  return (
    <div className="byer-seksjon">
      <h2>Hva skjer i {valgtBy}?</h2>
      
      <div className="by-knapper">
        {byer.map(by => (
          <button
            key={by}
            className={`by-knapp ${valgtBy === by ? 'aktiv' : ''}`}
            onClick={() => setValgtBy(by)}
          >
            {by}
          </button>
        ))}
      </div>

      {loading ? (
        <div>Laster arrangementer...</div>
      ) : (
        <div className="arrangementer-liste">
          {arrangementer.map(arr => (
            <EventCard
              key={arr.id}
              id={arr.id}
              tittel={arr.name}
              bilde={arr.images?.find(img => img.ratio === '3_2')?.url}
              by={arr._embedded?.venues?.[0]?.city?.name}
              land={arr._embedded?.venues?.[0]?.country?.name}
              dato={`${arr.dates?.start?.localDate} ${arr.dates?.start?.localTime}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default ByerSeksjon;