// App.jsx
import { Outlet } from 'react-router-dom';
import './styles.css';

function App() {
  return (
    <div className="app">
      {/* App Header */}
      <header className="app-header">
        <div className="header-content">
          <h1 className="app-title">🚗 Parking Note App</h1>
          <p className="app-subtitle">Never forget where you parked again!</p>
        </div>
      </header>

      {/* Outlet for routed pages */}
      <main className="main-content">
        <div className="content-container">
          <Outlet />
        </div>
      </main>

      {/* Footer */}
      <footer className="app-footer">
        <div className="footer-content">
          <p>&copy; 2024 Parking Note App - Keep track of your parking spots</p>
          <div className="footer-links">
            <span>Made with ❤️ and React</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
