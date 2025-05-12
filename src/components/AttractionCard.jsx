import React from 'react';
import '../styles/AttractionCard.css';

function AttractionCard({ id, navn, bilde, erFavoritt, onToggleFavoritt }) {
  return (
    <div className="attraction-card">
      <img 
        src={bilde} 
        alt={navn} 
        className="attraction-image"
        onError={(e) => {
          e.target.src = 'https://via.placeholder.com/150';
        }}
      />
      <h3 className="attraction-title">{navn}</h3>
      
      <button
        className={`favorite-button ${erFavoritt ? 'active' : ''}`}
        onClick={() => onToggleFavoritt(id)}
        aria-label={erFavoritt ? 'Fjern fra favoritter' : 'Legg til i favoritter'}
      >
        {erFavoritt ? '❤️' : '🤍'}
      </button>
    </div>
  );
}

export default AttractionCard;