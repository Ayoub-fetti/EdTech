import { Outlet, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export const Layout = () => {
  const { user, logout } = useAuth();

  return (
    <div>
      <nav style={{ padding: '10px', borderBottom: '1px solid #ccc' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1>EdTech</h1>
          
          {user && (
            <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
              <Link to={`/${user.role}`}>Dashboard</Link>
              <span>Welcome, {user.name}</span>
              <button onClick={logout}>Logout</button>
            </div>
          )}
        </div>
      </nav>
      
      <main style={{ padding: '20px' }}>
        <Outlet />
      </main>
    </div>
  );
};
