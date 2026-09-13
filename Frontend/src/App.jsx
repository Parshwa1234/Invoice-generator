import { useEffect } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { SignedIn, SignedOut, SignIn, UserButton, useAuth } from '@clerk/clerk-react';
import { setupAxiosInterceptors } from './api/axiosConfig';
import Dashboard from './pages/Dashboard';
import CreateInvoice from './pages/CreateInvoice';
import './App.css';

function App() {
  const { getToken } = useAuth();
  const location = useLocation();

  useEffect(() => {
    setupAxiosInterceptors(getToken);
  }, [getToken]);

  return (
    <div className="app-container">
      <SignedOut>
        <div className="login-container">
          <div className="login-header">
            <h1>InvoiceGen</h1>
            <p>Professional invoicing, simplified.</p>
          </div>
          <SignIn />
        </div>
      </SignedOut>

      <SignedIn>
        <nav className="navbar">
          <div className="nav-brand">InvoiceGen</div>
          <div className="nav-links">
            <Link to="/" className={location.pathname === '/' ? 'active' : ''}>
              Dashboard
            </Link>
            <Link to="/create" className="btn-create">
              + New Invoice
            </Link>
            <UserButton
              appearance={{
                elements: {
                  avatarBox: { width: '36px', height: '36px' }
                }
              }}
            />
          </div>
        </nav>

        <main className="main-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/create" element={<CreateInvoice />} />
          </Routes>
        </main>
      </SignedIn>
    </div>
  );
}

export default App;
