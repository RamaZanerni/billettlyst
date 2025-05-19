import React from 'react';
import NoImageAvailable from '../assets/No_Image_Available.jpg'; // Import local image
import '../styles/VenueCard.css';

function VenueCard({ id, navn, bilde, by, land, erFavoritt, onToggleFavoritt }) {
  // Function to get the best available image
  const getImageUrl = (imageData) => {
    if (!imageData) return NoImageAvailable;
    
    // If it's already a URL string
    if (typeof imageData === 'string') return imageData;
    
    // If it's an array of images, try to find the first valid one
    if (Array.isArray(imageData)) {
      const validImage = imageData.find(img => img.url);
      return validImage ? validImage.url : NoImageAvailable;
    }
    
    // If it's an image object with url property
    if (imageData.url) return imageData.url;
    
    return NoImageAvailable;
  };

  const imageUrl = getImageUrl(bilde);

  return (
    <div className="venue-card">
      <div className="venue-image-container">
        <img
          src={imageUrl}
          alt={navn}
          className="venue-image"
          onError={(e) => {
            e.target.src = NoImageAvailable;
            e.target.className = 'venue-image placeholder';
          }}
        />
      </div>
      
      <div className="venue-info">
        <h3 className="venue-name">{navn}</h3>
        <p className="venue-location">
          {by && <span className="city">{by}</span>}
          {land && <span className="country">, {land}</span>}
        </p>
      </div>

      <button
        className={`venue-favorite-button ${erFavoritt ? 'active' : ''}`}
        onClick={() => onToggleFavoritt(id)}
        aria-label={erFavoritt ? 'Remove from favorites' : 'Add to favorites'}
      >
        {erFavoritt ? '❤️' : '🤍'}
      </button>
    </div>
  );
}

export default VenueCard;