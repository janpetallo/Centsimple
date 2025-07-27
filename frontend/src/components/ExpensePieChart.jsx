import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement, // Required for Pie and Doughnut charts
  Tooltip,
  Legend,
  Title,
} from 'chart.js';
import tinycolor from 'tinycolor2';
import ExpenseBreakdown from './ExpenseBreakdown'; // Import the new component

ChartJS.register(ArcElement, Tooltip, Legend, Title);

function ExpensePieChart({ reportData }) {
  // Get a comprehensive set of theme colors from your CSS variables
  const themeColors = {
    // Light Theme Colors
    primary: getComputedStyle(document.documentElement).getPropertyValue(
      '--color-primary'
    ),
    secondary: getComputedStyle(document.documentElement).getPropertyValue(
      '--color-secondary'
    ),
    tertiary: getComputedStyle(document.documentElement).getPropertyValue(
      '--color-tertiary'
    ),
    error: getComputedStyle(document.documentElement).getPropertyValue(
      '--color-error'
    ),
    onPrimaryContainer: getComputedStyle(
      document.documentElement
    ).getPropertyValue('--color-on-primary-container'),
    onSecondaryContainer: getComputedStyle(
      document.documentElement
    ).getPropertyValue('--color-on-secondary-container'),
    onTertiaryContainer: getComputedStyle(
      document.documentElement
    ).getPropertyValue('--color-on-tertiary-container'),
    onErrorContainer: getComputedStyle(
      document.documentElement
    ).getPropertyValue('--color-on-error-container'),

    // Dark Theme Colors (provide more variety)
    primaryDark: getComputedStyle(document.documentElement).getPropertyValue(
      '--color-primary-dark'
    ),
    secondaryDark: getComputedStyle(document.documentElement).getPropertyValue(
      '--color-secondary-dark'
    ),
    tertiaryDark: getComputedStyle(document.documentElement).getPropertyValue(
      '--color-tertiary-dark'
    ),
    errorDark: getComputedStyle(document.documentElement).getPropertyValue(
      '--color-error-dark'
    ),

    // General UI Colors
    onSurface: getComputedStyle(document.documentElement).getPropertyValue(
      '--color-on-surface'
    ),
    onSurfaceVariant: getComputedStyle(
      document.documentElement
    ).getPropertyValue('--color-on-surface-variant'),
    surfaceContainer: getComputedStyle(
      document.documentElement
    ).getPropertyValue('--color-surface-container'),
  };

  // This function generates a dynamic palette
  function generateChartColors(count) {
    const initialPalette = [
      themeColors.primary,
      themeColors.tertiary,
      themeColors.secondary,
      themeColors.error,
      themeColors.onPrimaryContainer,
      themeColors.onTertiaryContainer,
      themeColors.primaryDark,
      themeColors.tertiaryDark,
      themeColors.onSecondaryContainer,
      themeColors.secondaryDark,
      themeColors.errorDark,
      themeColors.onErrorContainer,
    ];

    if (count <= initialPalette.length) {
      return initialPalette.slice(0, count);
    }

    const colors = [...initialPalette];
    const baseColor = tinycolor(themeColors.primary); // Use primary color as the generator base

    for (let i = initialPalette.length; i < count; i++) {
      // Generate a new color by spinning the hue of the base color
      const newColor = baseColor
        .spin((i - initialPalette.length + 1) * 25)
        .toString();
      colors.push(newColor);
    }
    return colors;
  }

  const dynamicPieColors = generateChartColors(
    reportData.expenseBreakdown.length
  );

  const data = {
    labels: reportData.expenseBreakdown.map((item) => item.categoryName),
    datasets: [
      {
        label: 'Expense',
        data: reportData.expenseBreakdown.map((item) => item.total),
        backgroundColor: dynamicPieColors, // Use the dynamically generated colors
        borderColor: themeColors.surfaceContainer,
        borderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '50%', // This turns the Pie chart into a Doughnut chart
    plugins: {
      legend: {
        display: false, // Hide the default legend
      },
      title: {
        display: true,
        text: 'Expense Breakdown',
        font: {
          family: 'Inter, sans-serif',
          size: 24,
          weight: 'bold',
        },
        color: themeColors.onSurface,
        padding: {
          bottom: 30,
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
  };

  return (
    <div className="grid w-full grid-cols-1 items-center gap-8 md:grid-cols-2">
      <div className="h-96 w-full">
        <Pie data={data} options={options} />
      </div>
      <ExpenseBreakdown
        breakdown={reportData.expenseBreakdown}
        colors={dynamicPieColors}
      />
    </div>
  );
}

export default ExpensePieChart;
