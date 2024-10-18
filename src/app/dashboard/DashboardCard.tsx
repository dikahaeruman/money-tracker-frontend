"use client"
import React, { useState, useEffect } from 'react';
import AnalyticsCard from "../components/AnalyticsCard"
import ChartComponent from '../components/Chart';

const generateRandomData = (numPoints: number, min: number, max: number) => {
    return Array.from({ length: numPoints }, () => Math.floor(Math.random() * (max - min + 1)) + min);
  };
  
const DashboardCards = () => {
    const [balanceTrendData, setBalanceTrendData] = useState<number[]>([]);
    const [expenseStructureData, setExpenseStructureData] = useState<number[]>([]);
    const [spendingByCategoriesData, setSpendingByCategoriesData] = useState<number[]>([]);
  
    useEffect(() => {
      setBalanceTrendData(generateRandomData(10, 34000000, 36000000));
      setExpenseStructureData(generateRandomData(5, 100000, 500000));
      setSpendingByCategoriesData(generateRandomData(5, 100000, 500000));
    }, []);
  

return (
    <section className="analytics">
    <div className="analytics-summary">
      <AnalyticsCard
        title="Dashboard"
        stats={[
          { value: '34.1M', name: 'BALANCE' },
          { value: '-1.7M', name: 'CASH FLOW' },
          { value: '-1.7M', name: 'SPENDING' }
        ]}
      />

      <AnalyticsCard
        title="Balance Trend"
        stats={[
          { value: 'IDR 34,133,625.00', name: 'vs previous period ↓5%' }
        ]}
      >
        <div className="card-chart">
          <ChartComponent
            type="line"
            data={{
              labels: Array.from({ length: 10 }, (_, i) => `10/${i + 1}`),
              datasets: [{
                label: 'Balance',
                data: balanceTrendData,
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
                fill: false,
              }],
            }}
            options={{
              scales: {
                y: {
                  beginAtZero: false,
                },
              },
            }}
          />
        </div>
      </AnalyticsCard>

      <AnalyticsCard
        title="Expenses Structure"
        stats={[
          { value: '-IDR 1,700,000.00', name: 'vs previous period ↑71%' }
        ]}
      >
        <div className="card-chart">
          <ChartComponent
            type="doughnut"
            data={{
              labels: ['Category 1', 'Category 2', 'Category 3', 'Category 4', 'Category 5'],
              datasets: [{
                label: 'Expenses',
                data: expenseStructureData,
                backgroundColor: [
                  'rgba(255, 99, 132, 0.2)',
                  'rgba(54, 162, 235, 0.2)',
                  'rgba(255, 206, 86, 0.2)',
                  'rgba(75, 192, 192, 0.2)',
                  'rgba(153, 102, 255, 0.2)'
                ],
                borderColor: [
                  'rgba(255, 99, 132, 1)',
                  'rgba(54, 162, 235, 1)',
                  'rgba(255, 206, 86, 1)',
                  'rgba(75, 192, 192, 1)',
                  'rgba(153, 102, 255, 1)'
                ],
                borderWidth: 1,
              }],
            }}
            options={{
              responsive: true,
              maintainAspectRatio: false,
            }}
          />
        </div>
      </AnalyticsCard>

      <AnalyticsCard
        title="Last Records"
        stats={[]}
      >
        <div className="record-item">
          <div className="record-icon">
            <div className="icon-container">
              <i className="fas fa-stethoscope icon"></i>
            </div>
          </div>
          <div className="record-info">
            <p className="record-name">Health care, doctor</p>
            <p className="record-category">Nasib</p>
          </div>
          <div className="record-amount decrease">-IDR 1,700,000.00</div>
        </div>
        <div className="record-date">10/17/2024, 12:00 AM</div>
      </AnalyticsCard>
    </div>

    <AnalyticsCard
      title="Cash Flow"
      stats={[
        { value: '-IDR 1,700,000.00', name: 'vs previous period ↑71%' },
      ]}
    >
      <div className="card-stats">
        <div className="card-stat">
          <p>Income</p>
          <p>IDR 0.00</p>
        </div>
        <div className="card-stat">
          <p>Expense</p>
          <p className="decrease">-IDR 1,700,000.00</p>
        </div>
      </div>
    </AnalyticsCard>

    <AnalyticsCard
      title="Spending by Categories"
      stats={[
        { value: '-IDR 1,700,000.00', name: 'vs previous period ↑71%' },
      ]}
    >
      <div className="card-chart">
        <ChartComponent
          type="bar"
          data={{
            labels: ['Category 1', 'Category 2', 'Category 3', 'Category 4', 'Category 5'],
            datasets: [{
              label: 'Spending',
              data: spendingByCategoriesData,
              backgroundColor: 'rgba(75, 192, 192, 0.2)',
              borderColor: 'rgba(75, 192, 192, 1)',
              borderWidth: 1,
            }],
          }}
          options={{
            scales: {
              y: {
                beginAtZero: true,
              },
            },
          }}
        />
      </div>
    </AnalyticsCard>
  </section>
)
}

export default DashboardCards