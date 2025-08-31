import React, { useState } from "react";
import LeftArrow from "../../../../src/images/leftArrow.png";
import RightArrow from "../../../../src/images/rightArrow.png";

export default function DateBox({ currentMonth, onChangeMonth }) {
  const [showPopup, setShowPopup] = useState(false);
  const [popupYear, setPopupYear] = useState(currentMonth.getFullYear());

  const monthName = currentMonth.toLocaleString("default", { month: "long" });
  const year = currentMonth.getFullYear();

  const months = Array.from({ length: 12 }, (_, i) =>
    new Date(popupYear, i, 1).toLocaleString("default", { month: "long" })
  );

  const handleMonthSelect = (monthIndex) => {
    const selectedDate = new Date(popupYear, monthIndex, 1);
    const diff =
      (selectedDate.getFullYear() - currentMonth.getFullYear()) * 12 +
      (selectedDate.getMonth() - currentMonth.getMonth());
    onChangeMonth(diff);
    setShowPopup(false);
  };

  return (
    <section className="box-3-display">
      <h1 className="currently-viewing-text">currently viewing:</h1>
      <div className="display-date">
        <button className="arrow-images left" onClick={() => onChangeMonth(-1)}>
          <img src={LeftArrow} />
        </button>
        <h1
          className="month-text"
          onClick={() => {
            setPopupYear(year); // reset popup year to current view
            setShowPopup(true);
          }}
          style={{ cursor: "pointer" }}
        >
          {monthName} {year}
        </h1>
        <button className="arrow-images right" onClick={() => onChangeMonth(1)}>
          <img src={RightArrow} />
        </button>
      </div>

      {showPopup && (
        <div className="popup-overlay-date">
          <div className="popup-box-date">
            <div className="popup-content-date">
              {/* LEFT COLUMN: Year controls + Close */}
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
                  className="close-button" 
                  onClick={() => setShowPopup(false)}
                >
                  close
                </button>
              </div>

              {/* RIGHT COLUMN: Months */}
              <div className="months-grid">
                {months.map((m, i) => (
                  <button
                    key={i}
                    onClick={() => handleMonthSelect(i)}
                    className={`month-button ${
                      popupYear === year && i === currentMonth.getMonth()
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
    </section>
  );
}
