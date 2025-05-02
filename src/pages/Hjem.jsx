import { useEffect, useState } from 'react';
import EventCard from '../components/EventCard';

const API_KEY = 'feRlIFpaAJZbzis6ksrLvAuSO6N9Z2nR'; 

const FESTIVAL_NAVN = ['Findings', 'Neon', 'Skeikampenfestivalen', 'Tons of Rock'];

function Hjem() {
  const [festivaler, settFestivaler] = useState([]);

  useEffect(() => {
    async function hentFestivaler() {
      const alle = [];

      for (const navn of FESTIVAL_NAVN) {
        const res = await fetch(
          `https://app.ticketmaster.com/discovery/v2/events.json?apikey=${API_KEY}&keyword=${navn}&countryCode=NO`
        );
        const data = await res.json();
        if (data._embedded?.events?.[0]) {

            
          alle.push(data._embedded.events[0]);
        }
      }

      settFestivaler(alle);
    }

    hentFestivaler();
  }, []);

  return (
    <div>
      <h1>Utvalgte festivaler</h1>
      {festivaler.map((event) => (
        <EventCard
          key={event.id}
          title={event.name}
          image={event.images?.[0]?.url}
          city={event._embedded.venues[0]?.city?.name}
          country={event._embedded.venues[0]?.country?.name}
          date={event.dates.start.localDate}
        />
      ))}
    </div>
  );
}

export default Hjem;
