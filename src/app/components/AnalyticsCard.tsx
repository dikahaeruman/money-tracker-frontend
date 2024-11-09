// components/AnalyticsCard.tsx
import React from 'react';

interface Stat {
  value: string;
  name: string;
}

interface AnalyticsCardProps {
  title: string;
  stats: Stat[];
  children?: React.ReactNode;
}

const AnalyticsCard: React.FC<AnalyticsCardProps> = ({ title, stats, children }) => (
  <div className="analytics-card">
    <h2 className="card-title">{title}</h2>
    <div className="card-content">
      {stats.map((stat, index) => (
        <div className="card-stat" key={index}>
          <div className="stat-value">{stat.value}</div>
          <div className="stat-name">{stat.name}</div>
        </div>
      ))}
      {children}
    </div>
  </div>
);

export default AnalyticsCard;