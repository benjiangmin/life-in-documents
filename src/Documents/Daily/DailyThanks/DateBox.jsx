import React from "react";

export default function Datebox({ selectedMonth, selectedYear, onChangeMonth, onChangeYear }) {
  const months = [
    "January","February","March","April","May","June",
    "July","August","September","October","November","December"
  ];

  const handlePrevMonth = () => {
    if (selectedMonth === 1) {
      onChangeMonth(12);
      onChangeYear(selectedYear - 1);
    } else {
      onChangeMonth(selectedMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (selectedMonth === 12) {
      onChangeMonth(1);
      onChangeYear(selectedYear + 1);
    } else {
      onChangeMonth(selectedMonth + 1);
    }
  };

  const handlePrevYear = () => {
    onChangeYear(selectedYear - 1);
  };

  const handleNextYear = () => {
    onChangeYear(selectedYear + 1);
  };

  return (
    <div className="change-dates-for-gratitudes">
      <div className="year-row">
        <button onClick={handlePrevYear}>&lt;</button>
        <h2>{selectedYear}</h2>
        <button onClick={handleNextYear}>&gt;</button>
      </div>

      <div className="month-row">
        <button onClick={handlePrevMonth}>&lt;</button>
        <h1>{months[selectedMonth - 1]}</h1>
        <button onClick={handleNextMonth}>&gt;</button>
      </div>
    </div>
  );
}
