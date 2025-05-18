import Navbar from './Navbar';
import '../styles/global.css'

function Layout({ children }) {
  return (
    <>
     <div className="page-wrapper">
      <Navbar />
      <main className="main-content">
         <div className="container">
           {children}
         </div>
         </main>
       <footer className="footer">
        <p>
          Data levert av <a href="https://developer.ticketmaster.com/" target="_blank" rel="noopener noreferrer">Ticketmaster API</a>
        </p>
      </footer>
        </div>
    </>
  );
}

export default Layout;
