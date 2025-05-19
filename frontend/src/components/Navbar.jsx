import { Link } from 'react-router-dom';
import '../styles/Navbar.css';

function Navbar() {
   const isLoggedIn = !!localStorage.getItem('isLoggedIn');
  return (

    <header className="navbar">
      <div className="nav-left">
        <Link to="/" className="nav-logo">Billettlyst</Link>
      </div>

      <div className="nav-center">
        <Link to="/category/musikk" className="nav-link">Musikk</Link>
        <Link to="/category/sport" className="nav-link">Sport</Link>
        <Link to="/category/teater" className="nav-link">Teater/Showe</Link>
        
      </div>

      <div className="nav-right">
        {isLoggedIn ? (
  <Link to="/dashboard" className="nav-link">Min side</Link>
) : (
        <Link to="/dashboard" className="nav-link">Logg inn</Link>
          )}
      </div>
    </header>
  );
}

export default Navbar;
