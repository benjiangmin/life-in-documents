import React, { useState } from "react";
import LeftArrow from "../../../../src/images/leftArrow.png";
import RightArrow from "../../../../src/images/rightArrow.png";

export default function Datebox({
  selectedMonth,
  selectedYear,
  onChangeMonth,
  onChangeYear,
}) {
  const [showPopup, setShowPopup] = useState(false);
  const [popupYear, setPopupYear] = useState(selectedYear);

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

  const handleMonthSelect = (monthIndex) => {
    onChangeMonth(monthIndex + 1); // months are 1–12
    onChangeYear(popupYear);
    setShowPopup(false);
  };

  return (
    <div className="change-dates-for-gratitudes">
      {/* Year row (no arrows, just display) */}
      <div className="year-row">
        <h2 style={{ margin: "0px" }}>{selectedYear}</h2>
      </div>

      {/* Month row with arrows */}
      <div className="month-row">
        <img
          className="change-month-for-gratitudes-arrow"
          src={LeftArrow}
          onClick={handlePrevMonth}
          style={{ paddingTop: "11px" }}
        />
        <h1
          style={{ margin: "0px", cursor: "pointer" }}
          onClick={() => {
            setPopupYear(selectedYear);
            setShowPopup(true);
          }}
        >
          {months[selectedMonth - 1]}
        </h1>
        <img
          className="change-month-for-gratitudes-arrow"
          src={RightArrow}
          onClick={handleNextMonth}
          style={{ paddingTop: "11px" }}
        />
      </div>

      {/* Popup */}
      {showPopup && (
        <div className="popup-overlay-date">
          <div className="popup-box-date">
            <div className="popup-content-date">
              {/* Year controls */}
              <div className="year-controls">
                <button
                  className="year-arrow"
                  onClick={() => setPopupYear(popupYear - 1)}
                >
                  <img src={LeftArrow} />
                </button>
                <h2 className="popup-year">{popupYear}</h2>
                <button
                  className="year-arrow"
                  onClick={() => setPopupYear(popupYear + 1)}
                >
                  <img src={RightArrow} />
                </button>
                <button
                  className="close-for-selecting-months"
                  onClick={() => setShowPopup(false)}
                >
                  close
                </button>
              </div>

              {/* Month grid */}
              <div className="months-grid">
                {months.map((m, i) => (
                  <button
                    key={i}
                    onClick={() => handleMonthSelect(i)}
                    className={`month-button ${
                      popupYear === selectedYear && i + 1 === selectedMonth
                        ? "active"
                        : ""
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
