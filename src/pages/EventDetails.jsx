import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { client } from '../lib/sanity';
import { getEventDetails } from '../lib/ticketmasterService';
import '../styles/EventDetails.css';
import Layout from '../components/Layout';


export default function EventDetails() {
  const { eventId } = useParams();
  const [event, setEvent] = useState(null);
  const [wishlistUsers, setWishlistUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        //  Hent grunnleggende data fra Sanity

        const sanityEvent = await client.fetch(
          `*[_type == "event" && _id == $eventId][0]{
            _id,
            title,
            date,
            location,
            apiId,
            category,
            "profileImage": image.asset->url 
          }`,
          { eventId }
        );

     // Hent tilleggsdata fra Ticketmaster API hvis apiId finnes  
        let tmData = {};
        if (sanityEvent.apiId) {
          tmData = await getEventDetails(sanityEvent.apiId, 'c7qLAjGlWre3Sm9jj1V9lpc5Mr5zmlw0');
        }
     
        setEvent({
          ...sanityEvent,
          title: tmData.title || sanityEvent.title,
          date: tmData.date || sanityEvent.date,
          location: tmData.location || sanityEvent.location,
          imageUrl: tmData.imageUrl || sanityEvent.imageUrl,
          description: tmData.description || '',
          genre: tmData.category || sanityEvent.category
        });

        // Hent brukere som har lagt til arrangementet i ønskelisten sin        
        const users = await client.fetch(
          `*[_type == "user" && $eventId in wishlist[]._ref]{
            _id,
            name,
            "profileImage": image.asset->url
          }`,
          { eventId }
        );
        setWishlistUsers(users);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [eventId]);

  if (loading) return <div className="loading">Laster...</div>;
  if (!event) return <div className="error">Arrangement ikke funnet</div>;

  const categoryLabels = {
  festival: 'Festival',
  sport: 'Sport',
  teater: 'Teater/Show',
  music: 'Music'
};


  // Date and time format
  const formattedDateTime = new Date(event.date).toLocaleString('nb-NO', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
     <Layout>
    <div className="event-details">
      <div className="event-header">
        <h1>{event.title}</h1>
      </div>

      <div className="event-content">
        <div className="event-image-container">
          <img 
            src={event.imageUrl || 'https://via.placeholder.com/800x400'} 
            alt={event.title} 
            className="event-image"
          />
        </div>

        <div className="event-info">
          <h2>Arrangementsinformasjon</h2>
          
          <div className="info-section">
            <h3>Dato og tid</h3>
            <p>{formattedDateTime}</p>
          </div>

          <div className="info-section">
            <h3>Sted</h3>
            <p>{event.location}</p>
          </div>

          <div className="info-section">
            <h3>Sjanger</h3>
        <p>{categoryLabels[event.genre] || categoryLabels[event.category] || 'Musikk'}</p>
          </div>

          {event.description && (
            <div className="info-section">
              <h3>Beskrivelse</h3>
              <p>{event.description}</p>
            </div>
          )}
        </div>

        <div className="wishlist-users">
          <h2>Hvem har dette i ønskeliste</h2>
          {wishlistUsers.length > 0 ? (
            <div className="users-grid">
              {wishlistUsers.map(user => (
                <div key={user._id} className="user-card">
                  {user.profileImage && (
                    <img 
                      src={`${user.profileImage}?w=100&h=100&fit=crop`} 
                      alt={user.name}
                      className="user-avatar"
                    />
                  )}
                  <span className="user-name">{user.name}</span>
                </div>
              ))}
            </div>
          ) : (
            <p>Ingen har lagt dette til i ønskelisten ennå</p>
          )}
        </div>
      </div>

      <Link to="/dashboard" className="back-button">Tilbake til dashboard</Link>
    </div>
    </Layout>
  );
}