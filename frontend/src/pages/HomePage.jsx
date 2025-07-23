import { Link } from 'react-router-dom';
import FolderIcon from '../icons/FolderIcon';
import BarChartIcon from '../icons/BarChartIcon';
import WalletIcon from '../icons/WalletIcon';

function HomePage() {
  return (
    <div>
      {/* === Hero Section === */}
      <section className="bg-surface-variant rounded-2xl p-12 text-center shadow-sm lg:py-32">
        <h1 className="text-display-large text-on-surface">
          Take Control of Your Finances, Simply.
        </h1>
        <p className="text-body-large text-on-surface-variant mx-auto mt-4 max-w-xl">
          The free, easy-to-use tool for tracking your income, expenses, and
          financial goals.
        </p>
        <Link
          className="bg-primary text-on-primary text-label-large mt-8 inline-block rounded-full px-8 py-3 shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-lg"
          to="/register"
        >
          Get Started for Free
        </Link>
      </section>

      {/* === Features Section === */}
      <section className="px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <h2 className="text-headline-medium text-center">
          Everything You Need to Manage Your Money.
        </h2>
        <div className="mx-auto mt-12 grid max-w-7xl grid-cols-1 gap-8 md:grid-cols-3">
          <div className="bg-surface-container flex flex-col items-center rounded-2xl p-8 text-center shadow-sm transition-transform hover:scale-105">
            <div className="bg-primary-container rounded-full p-4">
              <WalletIcon className="text-on-primary-container h-8 w-8" />
            </div>
            <h3 className="text-title-large mt-4">Track Everything</h3>
            <p className="text-body-large mt-2">
              Log your income and expenses with just a few clicks.
            </p>
          </div>
          <div className="bg-surface-container flex flex-col items-center rounded-2xl p-8 text-center shadow-sm transition-transform hover:scale-105">
            <div className="bg-primary-container rounded-full p-4">
              <BarChartIcon className="text-on-primary-container h-8 w-8" />
            </div>
            <h3 className="text-title-large mt-4">Visualize Your Habits</h3>
            <p className="text-body-large mt-2">
              See exactly where your money is going with our insightful charts
              and reports.
            </p>
          </div>
          <div className="bg-surface-container flex flex-col items-center rounded-2xl p-8 text-center shadow-sm transition-transform hover:scale-105">
            <div className="bg-primary-container rounded-full p-4">
              <FolderIcon className="text-on-primary-container h-8 w-8" />
            </div>
            <h3 className="text-title-large mt-4">Stay Organized</h3>
            <p className="text-body-large mt-2">
              Create custom categories to build a budget that works for you.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default HomePage;
