import React from "react";

export default function DisplayEntries({ entries }) {
  return (
    <section>
      <h2>Entries</h2>
      {entries.length === 0 ? (
        <p>No entries for this month.</p>
      ) : (
        <ul>
          {entries.map((entry, index) => (
            <li key={index}>
              <strong>{entry.date}</strong>: 
              1: {entry.input1} | 2: {entry.input2} | 3: {entry.input3}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
