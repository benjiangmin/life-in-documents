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
    <div className="datebox" style={{ textAlign: "center" }}>
      {/* Year row */}
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "1rem" }}>
        <button onClick={handlePrevYear}>&lt;</button>
        <span>{selectedYear}</span>
        <button onClick={handleNextYear}>&gt;</button>
      </div>

      {/* Month row */}
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "1rem" }}>
        <button onClick={handlePrevMonth}>&lt;</button>
        <span>{months[selectedMonth - 1]}</span>
        <button onClick={handleNextMonth}>&gt;</button>
      </div>
    </div>
  );
}
