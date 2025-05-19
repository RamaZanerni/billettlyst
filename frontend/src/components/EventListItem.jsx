import React from 'react';
import '../styles/EventListItem.css';

function EventListItem({ 
  id, 
  tittel, 
  bilde, 
  by, 
  land, 
  dato, 
  tid, 
  erFavoritt, 
  onToggleFavoritt 
}) {
  return (
    <div className="event-item">
      <div className="event-image-wrapper">
        <img
          src={bilde}
          alt={tittel}
          className="event-image"
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/150';
          }}
        />
      </div>
      
      <div className="event-details">
        <h3 className="event-title">{tittel}</h3>
        
        <div className="event-meta">
          <div className="meta-item">
            <span className="icon">📅</span>
            <span>{dato}</span>
          </div>
          
          <div className="meta-item">
            <span className="icon">⏰</span>
            <span>{tid || 'N/A'}</span>
          </div>
          
          <div className="meta-item">
            <span className="icon">📍</span>
            <span>{by}, {land}</span>
          </div>
        </div>
      </div>

      <button
        className={`event-favorite-button ${erFavoritt ? 'active' : ''}`}
        onClick={() => onToggleFavoritt(id)}
        aria-label={erFavoritt ? 'Fjern fra favoritter' : 'Legg til i favoritter'}
      >
        {erFavoritt ? '❤️' : '🤍'}
      </button>
    </div>
  );
}

export default EventListItem;