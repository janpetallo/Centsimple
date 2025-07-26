import Navbar from './Navbar';
import { Outlet } from 'react-router-dom';

function Layout() {
  return (
    <div className="bg-surface flex min-h-screen flex-col">
      <header className="sticky top-0 z-50">
        <Navbar />
      </header>
      <main className="mx-auto flex w-full max-w-7xl grow flex-col px-4 py-8 sm:px-6 lg:px-8">
        <Outlet /> {/* Placeholder; Child pages will be rendered here */}
      </main>
    </div>
  );
}

export default Layout;
