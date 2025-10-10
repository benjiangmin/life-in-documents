import React, { useState, useMemo, useRef, useEffect } from "react";

const YEAR = 2023;
const MONTH_NAMES = [
  "january", "february", "march", "april", "may", "june",
  "july", "august", "september", "october", "november", "december"
];

function getOrdinalSuffix(n) {
  const rem100 = n % 100;
  if (rem100 >= 11 && rem100 <= 13) return "th";
  const rem10 = n % 10;
  if (rem10 === 1) return "st";
  if (rem10 === 2) return "nd";
  if (rem10 === 3) return "rd";
  return "th";
}

export default function ScrollableDates({
  initialMonth = 0, // January by default
  onDaySelect = null,
  onMonthChange = null,
}) {
  const [monthIndex, setMonthIndex] = useState(initialMonth);
  const [selectedDay, setSelectedDay] = useState(1);
  const listRef = useRef(null);

  const daysInMonth = useMemo(
    () => new Date(YEAR, monthIndex + 1, 0).getDate(),
    [monthIndex]
  );
  const days = useMemo(
    () => Array.from({ length: daysInMonth }, (_, i) => i + 1),
    [daysInMonth]
  );

  useEffect(() => {
    if (listRef.current) listRef.current.scrollTop = 0;
    if (onMonthChange)
      onMonthChange({ year: YEAR, monthIndex, daysInMonth });
  }, [monthIndex]);

  function handlePrevMonth() {
    setMonthIndex((m) => Math.max(0, m - 1));
  }

  function handleNextMonth() {
    setMonthIndex((m) => Math.min(11, m + 1));
  }

  function handleSelect(day) {
    setSelectedDay(day);
    if (onDaySelect) onDaySelect({ day, month: MONTH_NAMES[monthIndex] });
  }

  return (
    <div className="scrollable-dates-inner-display">
      {/* Top arrow */}
      <button
        onClick={handlePrevMonth}
        disabled={monthIndex === 0}
        title={
          monthIndex === 0
            ? "January (first month)"
            : `Go to ${MONTH_NAMES[monthIndex - 1]}`
        }
      >
        ▲
      </button>

      {/* Month label */}
      <div>{MONTH_NAMES[monthIndex]}</div>

      {/* Scrollable list of days */}
      <div className="dates-of-devotions-container" ref={listRef}>
        {days.map((d) => (
          <button
            key={d}
            onClick={() => handleSelect(d)}
            className="change-current-devotion-date-button"
          >
            {d}
            {getOrdinalSuffix(d)}
          </button>
        ))}
      </div>

      {/* Bottom arrow */}
      <button
        onClick={handleNextMonth}
        disabled={monthIndex === 11}
        title={
          monthIndex === 11
            ? "December (last month)"
            : `Go to ${MONTH_NAMES[monthIndex + 1]}`
        }
      >
        ▼
      </button>
    </div>
  );
}
