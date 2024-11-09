// components/Chart.tsx
import React, { useEffect, useRef } from 'react';
import { Chart as ChartJS, ChartType, ChartData, ChartOptions } from 'chart.js';
import {
  LineElement,
  BarElement,
  PointElement,
  ArcElement,
  CategoryScale,
  LinearScale,
  DoughnutController,
  BarController,
  LineController,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Register components
ChartJS.register(
  LineElement,
  BarElement,
  PointElement,
  ArcElement,
  CategoryScale,
  LinearScale,
  DoughnutController,
  BarController,
  LineController,
  Title,
  Tooltip,
  Legend
);

interface ChartProps {
  type: ChartType;
  data: ChartData<any>;
  options?: ChartOptions<any>;
}

const ChartComponent: React.FC<ChartProps> = ({ type, data, options }) => {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstanceRef = useRef<ChartJS>();

  useEffect(() => {
    if (chartRef.current) {
      // Destroy existing chart instance if it exists
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }
      // Create new chart instance
      chartInstanceRef.current = new ChartJS(chartRef.current, {
        type,
        data, 
        options,
      });
    }

    // Cleanup chart instance on unmount
    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }
    };
  }, [type, data, options]);

  return <canvas ref={chartRef} />;
};

export default ChartComponent;