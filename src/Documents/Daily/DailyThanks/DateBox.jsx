import React from "react";
import LeftArrow from "../../../../src/images/leftArrow.png";
import RightArrow from "../../../../src/images/rightArrow.png";

export default function Datebox({ selectedMonth, selectedYear, onChangeMonth, onChangeYear }) {
  const months = [
    "january","february","march","april","may","june",
    "july","august","september","october","november","december"
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
        <img  className="change-year-for-gratitudes-arrow left-year" 
              src={LeftArrow} onClick={handlePrevYear} 
              alt="prev-year"
        />
        <h2 style={{margin: "0px"}}>{selectedYear}</h2>
        <img  className="change-year-for-gratitudes-arrow right-year" 
              src={RightArrow} 
              onClick={handleNextYear}
        />
      </div>

      <div className="month-row">
        <img  className="change-month-for-gratitudes-arrow left" 
              src={LeftArrow} 
              onClick={handlePrevMonth}
        />
        <h1 style={{margin: "0px"}}>{months[selectedMonth - 1]}</h1>
        <img  className="change-month-for-gratitudes-arrow right" 
              src={RightArrow} 
              onClick={handleNextMonth}
        />
      </div>
    </div>
  );
}
