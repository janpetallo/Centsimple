import Navbar from './Navbar';
import { Outlet } from 'react-router-dom';

function Layout() {
  return (
    <div className="flex min-h-screen flex-col">
      <header>
        <Navbar />
      </header>
      <main className="mx-auto w-full max-w-7xl flex-grow px-4 py-8">
        <Outlet /> {/* Placeholder; Child pages will be rendered here */}
      </main>
    </div>
  );
}

export default Layout;
