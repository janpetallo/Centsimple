import Navbar from "./Navbar";
import { Outlet } from "react-router-dom";

function Layout() {
  return (
    <div>
      <header>
        <Navbar />
      </header>
      <main>
        <Outlet /> {/* Placeholder; Child pages will be rendered here */}
      </main>
    </div>
  );
}

export default Layout;
