import { useState, useEffect } from "react";
import * as apiService from "../services/api.service";
import * as formatter from "../utils/format";
import IncomeExpenseChart from "../components/IncomeExpenseBarChart";
import ExpensePieChart from "../components/ExpensePieChart";

function InsightsPage() {
  const [reportData, setReportData] = useState(null);
  const [dateRange, setDateRange] = useState("last30days"); // Default to last 30 days'
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchReportData() {
      setLoading(true);
      setError(null);

      try {
        const data = await apiService.getSummaryReport(dateRange);
        console.log("Report data fetched successfully", data);
        setReportData(data);
      } catch (error) {
        console.error("Error fetching report data:", error.message);
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

  return (
    <div>
      <h2>Insights Page</h2>

      <label htmlFor="dateRange">Date Range:</label>
      <select id="dateRange" value={dateRange} onChange={handleDateRangeChange}>
        <option value="">All Time</option>
        <option value="last7days">Last 7 Days</option>
        <option value="last30days">Last 30 Days</option>
        <option value="last90days">Last 90 Days</option>
        <option value="thisMonth">This Month</option>
        <option value="lastMonth">Last Month</option>
        <option value="thisYear">This Year</option>
        <option value="lastYear">Last Year</option>
      </select>

      {loading ? (
        <h3>Loading...</h3>
      ) : (
        <div>
          {reportData ? (
            <div>
              <div>Balance: {formatter.formatCurrency(reportData.balance)}</div>
              {reportData.startDate && (
                <div>
                  From {formatter.formatDate(reportData.startDate)} to{" "}
                  {reportData.endDate
                    ? formatter.formatDate(
                        // Create a new Date object from the endDate string,
                        // then get its time in milliseconds and subtract one day's worth of milliseconds.
                        new Date(
                          new Date(reportData.endDate).getTime() -
                            24 * 60 * 60 * 1000
                        )
                      )
                    : "Present"}
                </div>
              )}

              {reportData.totalIncome > 0 || reportData.totalExpense > 0 ? ( // If there is data, show the charts
                <div>
                  <IncomeExpenseChart reportData={reportData} />
                  <ExpensePieChart reportData={reportData} />
                </div>
              ) : (
                // If there is no data, show a helpful message
                <p>No transaction data available for the selected period.</p>
              )}
            </div>
          ) : (
            <p>No data available for the selected period.</p>
          )}
        </div>
      )}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}

export default InsightsPage;
