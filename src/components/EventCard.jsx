function EventCard({ title, image, city, country, date }) {
    return (
      <div style={{ border: '1px solid #ccc', padding: '1rem', marginBottom: '1rem' }}>
        <img
          src={image}
          alt={title}
          style={{ width: '100%', maxHeight: '200px', objectFit: 'cover' }}
        />
        <h2>{title}</h2>
        <p>{city}, {country}</p>
        <p>{date}</p>
      </div>
    );
  }
  
  export default EventCard;
  