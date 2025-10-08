import React, { useState } from "react";

export default function DisplayEntries({ entries, onSaveEntry }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentEntry, setCurrentEntry] = useState(null);
  const [editValues, setEditValues] = useState({ input1: "", input2: "", input3: "" });

  // Format day with suffix safely
  const formatDayWithSuffix = (dateStr) => {
    if (!dateStr) return "";
    const [year, month, day] = dateStr.split("-").map(Number);

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

  const handleClick = (entry) => {
    setCurrentEntry(entry);
    setEditValues({
      input1: entry.input1,
      input2: entry.input2,
      input3: entry.input3
    });
    setIsModalOpen(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    if (onSaveEntry && currentEntry) {
      onSaveEntry(currentEntry.id, editValues);
    }
    setIsModalOpen(false);
  };

  return (
    <section className="display-entries-main-display">
      <h2>entries:</h2>
      <section className="display-entries-inner-container">
        {entries.length === 0 && <p>no entries to see here!</p>}

        <div className="all-gratitudes-container">
          {entries.map((entry) => (
            <div className="individual-gratitude-container" key={entry.id}>
              <div className="date-of-entry">
                {formatDayWithSuffix(entry.date)}
              </div>
              <section
                className="gratitude-container"
                onClick={() => handleClick(entry)}
              >
                <div>- {entry.input1}</div>
                <div>- {entry.input2}</div>
                <div>- {entry.input3}</div>
              </section>
            </div>
          ))}
        </div>
      </section>

      {/* Popup modal */}
      {isModalOpen && (
        <div className="edit-gratitude-entry-popup">
          <div className="actual-popup-for-editing-entry">
            <section className="top-row-for-editing-class for-assignment">
              <h3>edit entry</h3>
              <button onClick={handleSave}>save</button>
              <button onClick={() => setIsModalOpen(false)}>cancel</button>
            </section>
            <section className="gratitude-popup-inputs">
              <input
                type="text"
                name="input1"
                value={editValues.input1}
                onChange={handleChange}
                placeholder="first gratitude"
                />
              <input
                type="text"
                name="input2"
                value={editValues.input2}
                onChange={handleChange}
                placeholder="second gratitude"
                />
              <input
                type="text"
                name="input3"
                value={editValues.input3}
                onChange={handleChange}
                placeholder="third gratitude"
                />
            </section>


          </div>
        </div>
      )}
    </section>
  );
}
