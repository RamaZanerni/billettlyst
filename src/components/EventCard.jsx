import '../styles/EventCard.css';

function EventCard({ 
  id, 
  tittel, 
  bilde, 
  by, 
  land, 
  dato, 
  klikkbar = true, 
 
}) {
 
  const content = (
    <div className="event-card">
      <img 
        src={bilde || 'https://via.placeholder.com/300x200?text=Ingen+bilde'} 
        alt={tittel} 
        className="event-image"
        loading="lazy"
      />
      <div className="event-details">
        <h3>{tittel}</h3>
        {by && land && <p className="location">{by}, {land}</p>}
        {dato && <p className="date">{dato}</p>}
   
      </div>
    </div>
  );

  return klikkbar ? (
    <div className="event-card-link">
      {content}
    </div>
  ) : (
    content
  );
}

export default EventCard;