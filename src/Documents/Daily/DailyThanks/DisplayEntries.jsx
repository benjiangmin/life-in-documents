import React, { useState } from "react";

export default function DisplayEntries({ entries, onSaveEntry }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentEntry, setCurrentEntry] = useState(null);
  const [editValues, setEditValues] = useState({ input1: "", input2: "", input3: "" });

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

  const handleClick = (entry, index) => {
    setCurrentEntry({ ...entry, index });
    setEditValues({ input1: entry.input1, input2: entry.input2, input3: entry.input3 });
    setIsModalOpen(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    if (onSaveEntry && currentEntry) {
      onSaveEntry(currentEntry.index, editValues);
    }
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <section className="display-entries-main-display">
      <h2>entries:</h2>
      <section className="display-entries-inner-container">
        {entries.length === 0 && <p>it's the first of the month! (so no entries yet)</p>}

      <div className="all-gratitudes-container">
        {entries
          .slice()
          .sort((a, b) => new Date(b.date) - new Date(a.date))
          .map((entry) => {
            // Find the real index in the original entries array
            const originalIndex = entries.findIndex(
              (e) =>
                e.date === entry.date &&
                e.input1 === entry.input1 &&
                e.input2 === entry.input2 &&
                e.input3 === entry.input3
            );

            return (
              <div className="individual-gratitude-container" key={originalIndex}>
                <div className="date-of-entry">
                  {formatDayWithSuffix(entry.date)}
                </div>
                <section
                  className="gratitude-container"
                  onClick={() => handleClick(entry, originalIndex)}
                >
                  <div>- {entry.input1}</div>
                  <div>- {entry.input2}</div>
                  <div>- {entry.input3}</div>
                </section>
              </div>
            );
          })}
      </div>
      </section>

      {/* Popup modal */}
      {isModalOpen && (
        <div className="edit-gratitude-entry-popup">
          <div className="actual-popup-for-editing-entry">
            <h3>Edit Entry</h3>
            <input
              type="text"
              name="input1"
              value={editValues.input1}
              onChange={handleChange}
              placeholder="First gratitude"
            />
            <input
              type="text"
              name="input2"
              value={editValues.input2}
              onChange={handleChange}
              placeholder="Second gratitude"
            />
            <input
              type="text"
              name="input3"
              value={editValues.input3}
              onChange={handleChange}
              placeholder="Third gratitude"
            />

            <div className="modal-buttons">
              <button onClick={handleSave}>Save</button>
              <button onClick={handleCancel}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
