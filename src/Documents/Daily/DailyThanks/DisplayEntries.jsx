import React from "react";

export default function DisplayEntries({ entries, onEditEntry }) {
  return (
    <section>
      <h2>Entries</h2>
      {entries.length === 0 ? (
        <p>No entries for this month.</p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {entries.map((entry, index) => (
            <button
              key={index}
              onClick={() => onEditEntry(entry)}
              style={{
                display: "block",
                textAlign: "left",
                padding: "12px",
                borderRadius: "8px",
                border: "1px solid #ccc",
                backgroundColor: "#f9f9f9",
                cursor: "pointer",
              }}
            >
              <strong>{entry.date}</strong>: 1: {entry.input1} | 2: {entry.input2} | 3: {entry.input3}
            </button>
          ))}
        </div>
      )}
    </section>
  );
}
