import { Outlet } from 'react-router-dom';

export const Layout = () => {
  return (
    <div>
      <nav>
        <h1>EdTech</h1>
      </nav>
      <main>
        <Outlet />
      </main>
    </div>
  );
};
