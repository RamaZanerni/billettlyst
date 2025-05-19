import { Link } from 'react-router-dom';

import '../styles/FestivalEventCard.css'

function FestivalEventCard({ 
  id, 
  tittel, 
  bilde, 
  by, 
  land, 
  dato, 
  klikkbar = true, 
  erFavoritt = false, 
  onToggleFavoritt 
}) {
  const handleFavoriteClick = (e) => {
    e.stopPropagation();
    e.preventDefault();
    if (onToggleFavoritt) {
      onToggleFavoritt(id);
    }
  };

  const handleBuyClick = (e) => {
    e.stopPropagation();
// Det kan legge til billettkjøpslogikk her    
  };

  const content = (
    <div className="event-card">
      <img 
        src={bilde || 'https://via.placeholder.com/300x200?text=Ingen+bilde'} 
        alt={tittel} 
        className="event-image"
        loading="lazy"
        onError={(e) => {
          e.target.src = 'https://via.placeholder.com/300x200?text=Ingen+bilde';
        }}
      />
      <div className="event-details">
        <h3>{tittel}</h3>
        {by && land && <p className="location">{by}, {land}</p>}
        {dato && <p className="date">{dato}</p>}
        <div className="event-actions">
          {onToggleFavoritt && (
            <button 
              onClick={handleFavoriteClick}
              className={`fav-button ${erFavoritt ? 'active' : ''}`}
              aria-label={erFavoritt ? 'Fjern fra favoritter' : 'Legg til i favoritter'}
            >
              {erFavoritt ? '✓ På ønskeliste' : '+ Legg til ønskeliste'}
            </button>
          )}
          <button 
            onClick={handleBuyClick}
            className="buy-button"
          >
            Kjøp
          </button>
        </div>
      </div>
    </div>
  );

  return klikkbar ? (
    <Link 
      to={`/event/${id}`} 
      className="event-card-link"
      aria-label={`Vis detaljer for ${tittel}`}
    >
      {content}
    </Link>
  ) : (
    content
  );
}

export default FestivalEventCard;