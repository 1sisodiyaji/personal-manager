import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';
import { motion } from 'framer-motion';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const RoiCharts = ({ results }) => {
  const chartData = {
    labels: ['Additional Revenue', 'Churn Savings', 'Cost Savings'],
    datasets: [
      {
        label: 'ROI Breakdown',
        data: [
          parseFloat(results.additionalRevenue),
          parseFloat(results.churnSavings),
          parseFloat(results.costSavings)
        ],
        backgroundColor: [
          'rgba(66, 153, 225, 0.8)',
          'rgba(72, 187, 120, 0.8)',
          'rgba(159, 122, 234, 0.8)'
        ],
        borderColor: [
          'rgba(66, 153, 225, 1)',
          'rgba(72, 187, 120, 1)',
          'rgba(159, 122, 234, 1)'
        ],
        borderWidth: 1
      }
    ]
  };

  const options = {
    responsive: true,
    animation: {
      duration: 500,
      easing: 'easeInOutQuart'
    },
    plugins: {
      legend: {
        position: 'top',
        labels: {
          font: {
            family: "'Inter', sans-serif",
            size: 12
          },
          padding: 20
        }
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            label += new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: 'USD'
            }).format(context.parsed.y);
            return label;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value) => {
            return new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: 'USD',
              minimumFractionDigits: 0,
              maximumFractionDigits: 0
            }).format(value);
          }
        }
      }
    }
  };

  const doughnutOptions = {
    ...options,
    cutout: '70%',
    plugins: {
      ...options.plugins,
      tooltip: {
        callbacks: {
          label: (context) => {
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = ((context.parsed / total) * 100).toFixed(1);
            const value = new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: 'USD'
            }).format(context.parsed);
            return `${context.label}: ${value} (${percentage}%)`;
          }
        }
      }
    }
  };

  return (
    <motion.div 
      className="charts-container"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <motion.div 
        className="chart-wrapper"
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <h3>ROI Distribution</h3>
        <Bar data={chartData} options={options} />
      </motion.div>

      <motion.div 
        className="chart-wrapper"
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <h3>ROI Composition</h3>
        <Doughnut data={chartData} options={doughnutOptions} />
      </motion.div>
    </motion.div>
  );
};

export default RoiCharts;
