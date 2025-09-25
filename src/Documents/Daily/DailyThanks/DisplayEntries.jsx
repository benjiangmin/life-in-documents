import React from "react";

export default function DisplayEntries({ entries }) {
  // helper function to add suffix to date numbers
  const formatDayWithSuffix = (dateStr) => {
    const date = new Date(dateStr);
    const day = date.getDate();

    const suffix =
      day % 10 === 1 && day !== 11
        ? "st"
        : day % 10 === 2 && day !== 12
        ? "nd"
        : day % 10 === 3 && day !== 13
        ? "rd"
        : "th";

    return `${day}${suffix}`;
  };

  return (
    <section className="display-entries-main-display">
      <h2>entries</h2>
      <section className="display-entries-inner-container">
        {entries.length === 0 && <p>it's the first of the month!</p>}

        <div className="all-gratitudes-container">
          {entries.map((entry, index) => (
            <div className="individual-gratitude-container"
              key={index}
            >
              <div className="date-of-entry">
                {formatDayWithSuffix(entry.date)}
              </div>
              <section className="gratitude-container">
                <div>- {entry.input1}</div>
                <div>- {entry.input2}</div>
                <div>- {entry.input3}</div>
              </section>
            </div>
          ))}
        </div>
      </section>
    </section>
  );
}
