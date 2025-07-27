import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function IncomeExpenseChart({ reportData }) {
  // Get theme colors from CSS variables
  const themeColors = {
    primary: getComputedStyle(document.documentElement).getPropertyValue(
      '--color-primary'
    ),
    tertiary: getComputedStyle(document.documentElement).getPropertyValue(
      '--color-tertiary'
    ),
    onSurface: getComputedStyle(document.documentElement).getPropertyValue(
      '--color-on-surface'
    ),
    onSurfaceVariant: getComputedStyle(
      document.documentElement
    ).getPropertyValue('--color-on-surface-variant'),
    surfaceContainer: getComputedStyle(
      document.documentElement
    ).getPropertyValue('--color-surface-container'),
    outlineVariant: getComputedStyle(document.documentElement).getPropertyValue(
      '--color-outline-variant'
    ),
  };

  const data = {
    labels: [''], // Use an empty label for a cleaner look
    datasets: [
      {
        label: 'Income',
        data: [reportData.totalIncome],
        backgroundColor: themeColors.primary,
        borderRadius: 8, // Adds rounded corners to the bars
        barPercentage: 0.5, // Makes the bars a bit narrower
      },
      {
        label: 'Expense',
        data: [reportData.totalExpense],
        backgroundColor: themeColors.tertiary,
        borderRadius: 8,
        barPercentage: 0.5,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false, // Allows the chart to fill its container
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          font: {
            family: 'Inter, sans-serif',
            size: 14,
          },
          color: themeColors.onSurface,
        },
      },
      title: {
        display: true,
        text: 'Income vs Expense',
        font: {
          family: 'Inter, sans-serif',
          size: 24,
          weight: 'bold',
        },
        color: themeColors.onSurface,
        padding: {
          bottom: 20,
        },
      },
      tooltip: {
        backgroundColor: themeColors.surfaceContainer,
        titleColor: themeColors.onSurface,
        bodyColor: themeColors.onSurfaceVariant,
        titleFont: {
          family: 'Inter, sans-serif',
          weight: 'bold',
        },
        bodyFont: {
          family: 'Inter, sans-serif',
        },
      },
    },
    scales: {
      y: {
        border: {
          display: false, // Hide the y-axis line
        },
        grid: {
          color: themeColors.outlineVariant, // Use a subtle grid line color
        },
        ticks: {
          color: themeColors.onSurfaceVariant, // Style the axis labels
          font: {
            family: 'Inter, sans-serif',
          },
        },
      },
      x: {
        border: {
          display: false, // Hide the x-axis line
        },
        grid: {
          display: false, // Hide the vertical grid lines
        },
      },
    },
  };

  return (
    // Give the container a height so the chart can fill it
    <div className="h-96 w-full">
      <Bar data={data} options={options} />
    </div>
  );
}

export default IncomeExpenseChart;
