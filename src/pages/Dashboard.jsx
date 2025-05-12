import { useState } from 'react';
import Layout from '../components/Layout';
import '../styles/Dashboard.css';

function Dashboard() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [brukernavn, setBrukernavn] = useState('');

  function handleLogin(e) {
    e.preventDefault();
    if (brukernavn.trim()) {
      setIsLoggedIn(true);
    }
  }

  function handleLogout() {
    setIsLoggedIn(false);
    setBrukernavn('');
  }

  return (
    <Layout>
      {!isLoggedIn ? (
        <form onSubmit={handleLogin} className="dashboard-container">
          <h2 className="dashboard-title">Logg inn</h2>
          <input
            type="text"
            placeholder="Brukernavn"
            value={brukernavn}
            onChange={(e) => setBrukernavn(e.target.value)}
            className="dashboard-input"
          />
          <button type="submit" className="dashboard-button">
            Logg inn
          </button>
        </form>
      ) : (
        <div className="dashboard-container">
  <h2 className="dashboard-title">Velkommen, {brukernavn}!</h2>
  <p style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
    Du er nå logget inn på din side.
  </p>
  <button
    onClick={handleLogout}
    className="dashboard-button"

  >
    Logg ut
  </button>
</div>
      )}
    </Layout>
  );
}

export default Dashboard;
