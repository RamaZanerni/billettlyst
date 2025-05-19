import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Layout from '../components/Layout';
import AttractionCard from '../components/AttractionCard';
import VenueCard from '../components/VenueCard';
import EventListItem from '../components/EventListItem';
import '../styles/CategoryPage.css';

const API_KEY = 'c7qLAjGlWre3Sm9jj1V9lpc5Mr5zmlw0';

function CategoryPage() {
  const { slug } = useParams();
  const [events, setEvents] = useState([]);
  const [attractions, setAttractions] = useState([]);
  const [venues, setVenues] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchParams, setSearchParams] = useState({
    keyword: '',
    country: 'NO',
    city: '',
    date: ''
  });
  const [appliedFilters, setAppliedFilters] = useState({
    keyword: '',
    country: 'NO',
    city: '',
    date: ''
  });

  const cityOptions = {
    NO: ['Oslo', 'Bergen', 'Trondheim'],
    SE: ['Stockholm', 'Göteborg'],
    DE: ['Berlin', 'Hamburg'],
    FR: ['Paris', 'Lyon'],
    DK: ['København', 'Aarhus'],
  };

  // Last inn favoritter fra localStorage
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('favoritter')) || [];
    setWishlist(saved);
  }, []);

// Legg til/fjern fra favoritter-funksjonen

  const toggleWish = (id) => {
    const updated = wishlist.includes(id)
      ? wishlist.filter((itemId) => itemId !== id)
      : [...wishlist, id];
    setWishlist(updated);
    localStorage.setItem('favoritter', JSON.stringify(updated));
  };

// Hent data når det laster eller endrer filtre

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const searchTerm = appliedFilters.keyword.trim() || slug;

        // hente events
const eventsUrl = new URL('/discovery/v2/events.json', window.location.origin); 
        eventsUrl.searchParams.append('apikey', API_KEY);
        eventsUrl.searchParams.append('keyword', searchTerm);
        eventsUrl.searchParams.append('countryCode', appliedFilters.country);
        eventsUrl.searchParams.append('size', 12);
        if (appliedFilters.city) eventsUrl.searchParams.append('city', appliedFilters.city);
        if (appliedFilters.date) eventsUrl.searchParams.append('startDateTime', `${appliedFilters.date}T00:00:00Z`);

        const delay = (ms) => new Promise(res => setTimeout(res, ms));
const eventsResponse = await fetch(eventsUrl);
        const eventsData = await eventsResponse.json();
        setEvents(eventsData._embedded?.events || []);
        await delay(300);

        // hente attrsksjoner
const attractionsUrl = new URL('/discovery/v2/attractions.json', window.location.origin);
        attractionsUrl.searchParams.append('apikey', API_KEY);
        attractionsUrl.searchParams.append('keyword', searchTerm);
        attractionsUrl.searchParams.append('countryCode', appliedFilters.country);
        attractionsUrl.searchParams.append('size', 12);

const attractionsResponse = await fetch(attractionsUrl);
        const attractionsData = await attractionsResponse.json();
        setAttractions(attractionsData._embedded?.attractions || []);
   await delay(300);
        //  hente eventssteder
const venuesUrl = new URL('/discovery/v2/venues.json', window.location.origin);
        venuesUrl.searchParams.append('apikey', API_KEY);
        venuesUrl.searchParams.append('countryCode', appliedFilters.country);
        venuesUrl.searchParams.append('size', 12);
        if (appliedFilters.city) venuesUrl.searchParams.append('city', appliedFilters.city);

const venuesResponse = await fetch(venuesUrl);
        const venuesData = await venuesResponse.json();
        setVenues(venuesData._embedded?.venues || []);
           await delay(300);

      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [slug, appliedFilters]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSearchParams(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setAppliedFilters(searchParams);
  };

  return (
    <Layout>
      <div className="category-page">
        <form onSubmit={handleSearch} className="search-filters">
          <div className="search-input-group">
            <input
              type="text"
              name="keyword"
              placeholder="Søk etter attraksjon eller spillested..."
              value={searchParams.keyword}
              onChange={handleInputChange}
              className="search-input"
            />
            <button 
              type="submit" 
              className="main-search-button"
              disabled={isLoading}
            >
              {isLoading ? '...' : 'Søk'}
            </button>
          </div>

          <div className="filter-group">
            <select
              name="country"
              value={searchParams.country}
              onChange={handleInputChange}
              className="filter-select"
            >
              <option value="NO">Norge</option>
              <option value="SE">Sverige</option>
              <option value="DE">Tyskland</option>
              <option value="FR">Frankrike</option>
              <option value="DK">Danmark</option>
            </select>

            <select
              name="city"
              value={searchParams.city}
              onChange={handleInputChange}
              className="filter-select"
            >
              <option value="">Alle byer</option>
              {cityOptions[searchParams.country]?.map((city) => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>

            <input
              type="date"
              name="date"
              value={searchParams.date}
              onChange={handleInputChange}
              className="date-input"
            />

            <button 
              type="submit" 
              className="search-button"
              disabled={isLoading}
            >
              {isLoading ? '...' : 'Bruk filter'}
            </button>
          </div>
        </form>

        {isLoading && <div className="loading-indicator">Laster data...</div>}

        <section className="attractions-section">
          <h2 className="section-title">Attraksjoner</h2>
          <div className="cards-grid">
            {attractions.map((attr) => (
              <AttractionCard
                key={attr.id}
                id={attr.id}
                navn={attr.name}
                bilde={attr.images?.[0]?.url}
                erFavoritt={wishlist.includes(attr.id)}
                onToggleFavoritt={toggleWish}
              />
            ))}
          </div>
        </section>

        <section className="events-section">
          <h2 className="section-title">Arrangementer</h2>
          <div className="events-list">
            {events.map((event) => (
              <EventListItem
                key={event.id}
                id={event.id}
                tittel={event.name}
                bilde={event.images?.[0]?.url}
                by={event._embedded?.venues[0]?.city?.name}
                land={event._embedded?.venues[0]?.country?.name}
                dato={event.dates.start.localDate}
                tid={event.dates.start.localTime}
                erFavoritt={wishlist.includes(event.id)}
                onToggleFavoritt={toggleWish}
              />
            ))}
          </div>
        </section>

        <section className="venues-section">
          <h2 className="section-title">Spillesteder</h2>
          <div className="cards-grid">
            {venues.map((venue) => (
              <VenueCard
                key={venue.id}
                id={venue.id}
                navn={venue.name}
                bilde={venue.images} 
                by={venue.city?.name}
                land={venue.country?.name}
                erFavoritt={wishlist.includes(venue.id)}
                onToggleFavoritt={toggleWish}
              />
            ))}
          </div>
        </section>
      </div>
    </Layout>
  );
}

export default CategoryPage;