import { Link } from 'react-router-dom';
import '../styles/FestivalEventCard.css';

function FestivalEventCard({ 
  id, 
  name, 
  image, 
  isFeatured = false,
}) {

  return (
    <div className="festival-card-contianer">
      <div className={`festival-card ${isFeatured ? 'featured' : ''}`}>
        <div className="festival-image-container">
          <img 
            src={image || 'https://via.placeholder.com/400x250?text=Festival'} 
            alt={name} 
            className="festival-image"
            loading="lazy"
          />
          {isFeatured && <span className="featured-badge">Featured</span>}
        </div>
        <div className="festival-details">
          <h3>{name}</h3>
          <Link to={`/festivals/${name.toLowerCase().replace(/\s+/g, '-')}`} className="festival-card-link"><button>Les mer om {name}</button></Link>
        </div>
      </div>
    </div>
  );
}

export default FestivalEventCard;
