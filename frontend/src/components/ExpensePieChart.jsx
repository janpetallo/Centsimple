import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS, // Renamed Chart to ChartJS to avoid conflict with Chart component
  ArcElement, // Required for Pie and Doughnut charts
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

function ExpensePieChart({ reportData }) {
  const data = {
    labels: reportData.expenseBreakdown.map((item) => item.categoryName),
    datasets: [
      {
        label: "Expense Breakdown",
        data: reportData.expenseBreakdown.map((item) => item.total),
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Expense Breakdown",
      },
    },
  };

  return (
    <div>
      <Pie data={data} options={options} />
    </div>
  );
}

export default ExpensePieChart;
