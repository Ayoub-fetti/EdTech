import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export const Layout = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const isActive = (path: string) => location.pathname.startsWith(path);

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-gray-800 text-white shadow-lg">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <Link to="/dashboard" className="text-xl font-bold">
              EdTech
            </Link>
            {user && (
              <div className="flex items-center gap-6">
                <Link
                  to="/dashboard"
                  className={`hover:text-blue-300 ${isActive('/dashboard') ? 'text-blue-300' : ''}`}
                >
                  Dashboard
                </Link>
                {(user.role === 'admin' || user.role === 'teacher') && (
                  <>
                    <Link
                      to="/courses"
                      className={`hover:text-blue-300 ${isActive('/courses') ? 'text-blue-300' : ''}`}
                    >
                      Courses
                    </Link>
                    <Link
                      to="/sessions"
                      className={`hover:text-blue-300 ${isActive('/sessions') ? 'text-blue-300' : ''}`}
                    >
                      Sessions
                    </Link>
                  </>
                )}
                {(user.role === 'admin' || user.role === 'teacher') && (
                  <Link
                    to="/students"
                    className={`hover:text-blue-300 ${isActive('/students') ? 'text-blue-300' : ''}`}
                  >
                    Students
                  </Link>
                )}
                {user.role === 'admin' && (
                  <Link
                    to="/teachers"
                    className={`hover:text-blue-300 ${isActive('/teachers') ? 'text-blue-300' : ''}`}
                  >
                    Teachers
                  </Link>
                )}
                <Link
                  to="/presences"
                  className={`hover:text-blue-300 ${isActive('/presences') ? 'text-blue-300' : ''}`}
                >
                  Presences
                </Link>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-gray-300">{user.name} ({user.role})</span>
                  <button
                    onClick={logout}
                    className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded transition"
                  >
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </nav>
      <main className="container mx-auto px-4 py-8">
        <Outlet />
      </main>
    </div>
  );
};