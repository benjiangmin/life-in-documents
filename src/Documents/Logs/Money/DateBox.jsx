import React from "react";
import LeftArrow from "../../../../src/images/leftArrow.png"
import RightArrow from "../../../../src/images/rightArrow.png"

export default function DateBox({ currentMonth, onChangeMonth }) {
  const monthName = currentMonth.toLocaleString("default", { month: "long" });
  const year = currentMonth.getFullYear();

  return (
    <section className="box-3-display">
      <h1 className="currently-viewing-text">currently viewing:</h1>
      <div className="display-date">
        <button className="arrow-images left" onClick={() => onChangeMonth(-1)}>
          <img src={LeftArrow} />
        </button>
        <h1 className="month-text">{monthName} {year}</h1>
        <button className="arrow-images right" onClick={() => onChangeMonth(1)}>
          <img src={RightArrow} />
        </button>
      </div>
    </section>
  );
}
