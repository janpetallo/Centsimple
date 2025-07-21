import { Link } from 'react-router-dom';
import FolderIcon from '../icons/FolderIcon';
import BarChartIcon from '../icons/BarChartIcon';
import WalletIcon from '../icons/WalletIcon';

function HomePage() {
  return (
    <div>
      {/* === Hero Section === */}
      <section className="bg-gradient-to-br from-gray-50 to-gray-100 px-4 py-20">
        <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 lg:grid-cols-2">
          <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
            <h1 className="text-4xl font-bold md:text-6xl">
              Take Control of Your Finances, Simply.
            </h1>
            <p className="mt-4 max-w-xl text-lg text-gray-600">
              The free, easy-to-use tool for tracking your income, expenses, and
              financial goals.
            </p>
            <Link
              className="bg-brand hover:bg-brand-hover mt-8 rounded-full px-6 py-3 font-bold text-white transition-transform hover:scale-105"
              to="/register"
            >
              Get Started for Free
            </Link>
          </div>
          <div className="hidden lg:block">
            <div className="rounded-xl bg-white p-4 shadow-2xl">
              <div className="mb-4 flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-red-400"></div>
                <div className="h-3 w-3 rounded-full bg-yellow-400"></div>
                <div className="h-3 w-3 rounded-full bg-green-400"></div>
              </div>

              <div className="space-y-4">
                <div className="h-10 w-2/3 rounded-lg bg-gray-200"></div>
                <div className="flex items-end gap-2">
                  <div className="h-16 w-8 rounded-md bg-green-300"></div>
                  <div className="h-24 w-8 rounded-md bg-red-300"></div>
                  <div className="h-20 w-8 rounded-md bg-green-300"></div>
                </div>
                <div className="h-8 w-full rounded-lg bg-gray-100"></div>
                <div className="h-8 w-full rounded-lg bg-gray-100"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* === Features Section === */}
      <section className="px-4 py-20">
        <h2 className="text-center text-3xl font-bold">
          Everything You Need to Manage Your Money.
        </h2>
        <div className="mx-auto mt-12 grid max-w-7xl grid-cols-1 gap-8 md:grid-cols-3">
          <div className="flex flex-col items-center text-center">
            <WalletIcon className="text-brand h-12 w-12" />
            <h3 className="mt-4 text-xl font-bold">Track Everything</h3>
            <p className="mt-2 text-gray-600">
              Log your income and expenses with just a few clicks.
            </p>
          </div>
          <div className="flex flex-col items-center text-center">
            <BarChartIcon className="text-brand h-12 w-12" />
            <h3 className="mt-4 text-xl font-bold">Visualize Your Habits</h3>
            <p className="mt-2 text-gray-600">
              See exactly where your money is going with our insightful charts
              and reports.
            </p>
          </div>
          <div className="flex flex-col items-center text-center">
            <FolderIcon className="text-brand h-12 w-12" />
            <h3 className="mt-4 text-xl font-bold">Stay Organized</h3>
            <p className="mt-2 text-gray-600">
              Create custom categories to build a budget that works for you.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default HomePage;
