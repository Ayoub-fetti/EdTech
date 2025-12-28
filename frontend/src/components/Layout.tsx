import { Outlet, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export const Layout = () => {
  const { user, logout } = useAuth();

  return (
    <div>
      <nav className="p-4 bg-gray-800 text-white">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-bold">EdTech</h1>
          {user && (
            <div className="flex gap-4">
              <Link to="/sessions">Sessions</Link>
              <Link to="/courses">Courses</Link>
              <Link to="/students">Students</Link>
              <button onClick={logout} className="bg-red-500 px-4 py-2 rounded">Logout</button>
            </div>
          )}
        </div>
      </nav>
      <main className="p-6">
        <Outlet />
      </main>
    </div>
  );
};