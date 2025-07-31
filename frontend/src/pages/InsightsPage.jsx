import { useState, useEffect } from 'react';
import * as apiService from '../services/api.service';
import * as formatter from '../utils/format';
import IncomeExpenseChart from '../components/IncomeExpenseBarChart';
import ExpensePieChart from '../components/ExpensePieChart';
import LoadingSpinner from '../components/LoadingSpinner';
import BackIcon from '../icons/BackIcon';
import { useNavigate } from 'react-router-dom';

function InsightsPage() {
  const [reportData, setReportData] = useState(null);
  const [dateRange, setDateRange] = useState('last30days'); // Default to last 30 days'
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchReportData() {
      setLoading(true);
      setError(null);

      try {
        const data = await apiService.getSummaryReport(dateRange);
        console.log('Report data fetched successfully', data);
        setReportData(data);
      } catch (error) {
        console.error('Error fetching report data:', error.message);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }
    fetchReportData();
  }, [dateRange]);

  function handleDateRangeChange(e) {
    setDateRange(e.target.value);
  }

  function handleBackButtonClick() {
    navigate('/dashboard');
  }

  return (
    <>
      <div className="mb-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center justify-start gap-2">
          <button
            onClick={handleBackButtonClick}
            className="hover:bg-surface-container cursor-pointer rounded-full p-2 transition-colors"
          >
            <BackIcon className="h-6 w-6" />
          </button>
          <h2 className="text-headline-medium text-left">Insights</h2>
        </div>

        <div className="flex grow flex-col justify-center gap-4 sm:flex-row sm:items-center sm:justify-start md:grow-0 md:justify-end">
          <label
            htmlFor="dateRange"
            className="text-label-large text-on-surface-variant"
          >
            Date Range
          </label>
          <select
            className="bg-surface-variant text-on-surface-variant border-outline focus:ring-inverse-surface grow rounded-2xl border px-4 py-2 focus:ring-1 focus:outline-none"
            id="dateRange"
            value={dateRange}
            onChange={handleDateRangeChange}
          >
            <option value="">All Time</option>
            <option value="last7days">Last 7 Days</option>
            <option value="last30days">Last 30 Days</option>
            <option value="last90days">Last 90 Days</option>
            <option value="thisMonth">This Month</option>
            <option value="lastMonth">Last Month</option>
            <option value="thisYear">This Year</option>
            <option value="lastYear">Last Year</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="flex grow items-center justify-center">
          <LoadingSpinner className="text-on-primary-container bg-primary-container h-16 w-16 rounded-full" />
        </div>
      ) : (
        <div>
          {reportData ? (
            <div>
              <div className="bg-surface-container flex flex-col items-start justify-between gap-1 rounded-2xl p-6 shadow-sm">
                <p className="text-on-surface-variant text-sm">Balance</p>
                <p className="text-headline-medium text-on-surface">
                  {formatter.formatCurrency(reportData.balance)}
                </p>

                {reportData.startDate && (
                  <div className="text-on-surface-variant text-body-large">
                    From {formatter.formatDate(reportData.startDate)} to{' '}
                    {reportData.endDate
                      ? formatter.formatDate(
                          // Create a new Date object from the endDate string,
                          // then get its time in milliseconds and subtract one day's worth of milliseconds.
                          new Date(
                            new Date(reportData.endDate).getTime() -
                              24 * 60 * 60 * 1000
                          )
                        )
                      : 'Present'}
                  </div>
                )}
              </div>

              {reportData.totalIncome > 0 || reportData.totalExpense > 0 ? ( // If there is data, show the charts
                <div className="mt-4 grid grid-cols-1 gap-8 lg:grid-cols-2">
                  <div className="bg-surface-container border-outline/10 hover:bg-surface-variant hover:text-on-surface-variant flex items-center justify-center rounded-xl border p-4 transition-colors">
                    <IncomeExpenseChart reportData={reportData} />
                  </div>
                  {reportData.totalExpense > 0 && (
                    <div className="bg-surface-container border-outline/10 hover:bg-surface-variant hover:text-on-surface-variant flex items-center justify-center rounded-xl border p-4 transition-colors">
                      <ExpensePieChart reportData={reportData} />
                    </div>
                  )}
                </div>
              ) : (
                // If there is no data, show a helpful message
                <p className="bg-surface-container border-outline/10 mt-4 rounded-xl border p-8">
                  No transaction data available for the selected period.
                </p>
              )}
            </div>
          ) : (
            <p className="bg-surface-container border-outline/10 mt-4 rounded-xl border p-8">
              No data available for the selected period.
            </p>
          )}
        </div>
      )}
      {error && (
        <p className="text-on-error-container bg-error-container mt-2 w-fit rounded-2xl p-2 text-center text-sm">
          {error}
        </p>
      )}
    </>
  );
}

export default InsightsPage;
