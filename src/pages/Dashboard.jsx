import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import '../styles/Dashboard.css';
import { client } from '../lib/sanity';

function Dashboard() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);
  const [username, setUsername] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const savedLogin = localStorage.getItem('isLoggedIn');
    if (savedLogin) {
      const { username } = JSON.parse(savedLogin);
      setUsername(username);
      setIsLoggedIn(true);
      fetchUserData(username);
    }
  }, []);

  const fetchUserData = async (username) => {
    setIsLoading(true);
    setError(null);
    try {
      const currentUser = await client.fetch(
        `*[_type == "user" && name == $username][0]{
          _id,
          name,
          age,
          gender,
           email,
          "profileImage": image.asset->url,
          "wishlist": wishlist[]->{
            _id,
            title,
            category
          },
          "purchases": previousPurchases[]->{
            _id,
            title,
            category
          },
          "friends": friends[]->{
            _id,
            name,
            "profileImage": image.asset->url,
            "wishlist": wishlist[]->{
              title,
              category
            }
          }
        }`,
        { username }
      );

      setUserData(currentUser);
    } catch (err) {
      setError('Kunne ikke laste data. Prøv igjen senere.');
      console.error('Fetch error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = (e) => {
    e.preventDefault();
    const trimmedUsername = username.trim();
    if (trimmedUsername) {
      setIsLoggedIn(true);
      localStorage.setItem('isLoggedIn', JSON.stringify({
        username: trimmedUsername,
        timestamp: Date.now()
      }));
      fetchUserData(trimmedUsername);
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserData(null);
    setUsername('');
    localStorage.removeItem('isLoggedIn');
  };

  if (!isLoggedIn) {
    return (
      <Layout>
        <form onSubmit={handleLogin} className="dashboard-container">
          <h2 className="dashboard-title">Logg inn</h2>
          <input
            type="text"
            placeholder="Rama"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="dashboard-input"
            required
          />
          <button type="submit" className="dashboard-button">
            Logg inn 
          </button>
        </form>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="dashboard-container">
        {isLoading && <p>Laster data...</p>}
        {error && <p className="error-message">{error}</p>}

        {userData && (
          <>
            <div className="user-profile-header">
              {userData.profileImage && (
                <img 
                  src={`${userData.profileImage}?w=200&h=200&fit=crop`} 
                  alt="Profilbilde" 
                  className="profile-image"
                />
              )}
              <div className="user-info">
                <h2 className="dashboard-title">{userData.name}</h2>
                <p>Alder: {userData.age}</p>
                <p>Kjønn: {userData.gender === 'male' ? 'Mann' : userData.gender === 'female' ? 'Kvinne' : 'Annet'}</p>
              <p>E-mail: {userData.email}</p>

                
              </div>
            </div>
            

            <section className="friends-section">
              <h3>Venner</h3>
              {userData.friends && userData.friends.length > 0 ? (
                userData.friends.map(friend => (
                  <div key={friend._id} className="friend-card">
                    <div className="friend-header">
                      {friend.profileImage && (
                        <img 
                          src={`${friend.profileImage}?w=100&h=100&fit=crop`} 
                          alt={friend.name} 
                          className="friend-image"
                        />
                      )}
                      <h4>{friend.name}</h4>
                    </div>
                    {friend.wishlist && friend.wishlist.length > 0 && (
                      <>
                        <p className="common-interests">
                          Du og {friend.name} ønsker begge å dra på {friend.wishlist[0].title}, hva med å dra sammen?
                        </p>
                        <div className="categories">
                          {friend.wishlist.slice(0, 3).map((item, index) => (
                            <span key={index} className="category-tag">{item.category}</span>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                ))
              ) : (
                <p>Ingen venner å vise</p>
              )}
            </section>

            <section className="dashboard-section">
              <h3>Min kjøp ({userData.purchases?.length || 0})</h3>
              {userData.purchases && userData.purchases.length > 0 ? (
                <div className="events-list">
                  {userData.purchases.map(item => (
                    <div key={item._id} className="event-item">
                      <h4>{item.title}</h4>
                      <p>Kategori: {item.category}</p>
            <Link to={`/dashboard/event/${item._id}`}> Se mer om dette ønsket</Link>                      </div>
                  ))}
                </div>
              ) : (
                <p>Ingen kjøp å vise</p>
              )}
            </section>

            <section className="dashboard-section">
              <h3>Min ønskeliste ({userData.wishlist?.length || 0})</h3>
              {userData.wishlist && userData.wishlist.length > 0 ? (
                <div className="events-list">
                  {userData.wishlist.map(item => (
                    <div key={item._id} className="event-item">
                      <h4>{item.title}</h4>
                      <p>Kategori: {item.category}</p>
            <Link to={`/dashboard/event/${item._id}`}>Se mer om dette ønsket</Link>               

                    </div>
                  ))}
                </div>
              ) : (
                <p>Ingen ønsker å vise</p>
              )}
            </section>
          </>
        )}

        <button onClick={handleLogout} className="dashboard-button logout-button">
          Logg ut
        </button>
      </div>
    </Layout>
  );
}

export default Dashboard;