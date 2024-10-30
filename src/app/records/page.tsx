"use client";
import React, { useState } from "react";
import { differenceInMilliseconds, format, parseISO } from "date-fns";
import 'styles/records.css';
import Sidebar from "../components/SideBar";

// Dummy data
const dummyData = [
  { date: "2023-08-15", type: "Groceries", category: "Essentials", description: "monthly groceries", amount: -450000.0 },
  { date: "2023-08-10", type: "Salary", category: "Income", description: "monthly salary", amount: 6000000.0 },
  { date: "2023-07-28", type: "Transportation", category: "Essentials", description: "monthly train pass", amount: -200000.0 },
  { date: "2023-07-18", type: "Utilities", category: "Bills", description: "electricity bill", amount: -300000.0 },
  { date: "2023-07-10", type: "Dining Out", category: "Entertainment", description: "dinner with family", amount: -150000.0 },
  { date: "2023-06-22", type: "Investment", category: "Savings", description: "mutual funds", amount: -500000.0 },
  { date: "2023-06-15", type: "Bonus", category: "Income", description: "performance bonus", amount: 800000.0 },
  { date: "2023-06-01", type: "Healthcare", category: "Essentials", description: "doctor's appointment", amount: -250000.0 },
  { date: "2023-05-30", type: "Gift", category: "Occasions", description: "anniversary gift", amount: -300000.0 },
  { date: "2023-05-25", type: "Lending", category: "Others", description: "lent to friend", amount: -1000000.0 },
];

// Define date ranges
const dateRanges = {
  "Apr 4-May 3": { start: "2023-04-04", end: "2023-05-03" },
  "Mar 4-Apr 3": { start: "2023-03-04", end: "2023-04-03" },
  "Feb 4-Mar 3": { start: "2023-02-04", end: "2023-03-03" },
};

const RecordsPage = () => {
  const [selectedDate, setSelectedDate] = useState("Apr 4-May 3");
  const [sortBy, setSortBy] = useState("Time (newest first)");

  const handleDateChange = (date: string) => setSelectedDate(date);
  const handleSortChange = (sort: string) => setSortBy(sort);

  const sortedData = dummyData.toSorted((a, b) => {
    switch (sortBy) {
      case "Time (newest first)":
        return differenceInMilliseconds(parseISO(b.date), parseISO(a.date));
      case "Amount (highest first)":
        return b.amount - a.amount;
      default:
        return a.amount - b.amount;
    }
  });

  const filteredData = sortedData;

  return (
    <div className="container">
      <div className="sidebar">
        <Sidebar />
      </div>
      <div className="mainContent">
        <div className="filtersContainer">
          <div className="dateRangeSelect">
            <label htmlFor="date-range">Date range:</label>
            <select id="date-range" value={selectedDate} onChange={(e) => handleDateChange(e.target.value)}>
              {Object.keys(dateRanges).map((range) => (
                <option key={range} value={range}>{range}</option>
              ))}
            </select>
          </div>
          <div className="sortSelect">
            <label htmlFor="sort-by">Sort by:</label>
            <select id="sort-by" value={sortBy} onChange={(e) => handleSortChange(e.target.value)}>
              <option value="Time (newest first)">Time (newest first)</option>
              <option value="Amount (highest first)">Amount (highest first)</option>
              <option value="Amount (lowest first)">Amount (lowest first)</option>
            </select>
          </div>
        </div>
        <div className="tableContainer">
          <table className="recordsTable">
            <thead className="tableHeader">
              <tr>
                <th>Date</th>
                <th>Type</th>
                <th>Category</th>
                <th>Description</th>
                <th className="amountColumn">Amount</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((record, index) => (
                <tr key={index} className={`tableRow ${index % 2 === 0 ? "evenRow" : ""}`}>
                  <td>{format(parseISO(record.date), "MMM d, yyyy")}</td>
                  <td>{record.type}</td>
                  <td>{record.category}</td>
                  <td>{record.description}</td>
                  <td className="amountCell">
                    {record.amount.toLocaleString("id-ID", {
                      style: "currency",
                      currency: "IDR",
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default RecordsPage;

