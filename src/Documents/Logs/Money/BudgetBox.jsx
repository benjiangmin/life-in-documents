import React, { useState, useEffect } from "react";

export default function BudgetBox({ items, budget, onUpdateBudget }) {
  const [isEditing, setIsEditing] = useState(false);
  const [newBudget, setNewBudget] = useState(budget);

  // Update local editing state when month changes
  useEffect(() => {
    setNewBudget(budget);
  }, [budget]);

  const spent = items.reduce(
    (total, entry) => total + parseFloat(entry.price || 0),
    0
  );

  const left = newBudget - spent;

  const totalsByType = items.reduce((acc, entry) => {
    const type = entry.type || "other";
    const price = parseFloat(entry.price) || 0;
    if (!acc[type]) acc[type] = 0;
    acc[type] += price;
    return acc;
  }, {});

  return (
    <section className="box-2-display">
      <h1 className="budget-text-display">budget:</h1>

      <section className="budget-detailed-display">
        <section className="budget-budget-display">
          <h3>budget:</h3>
          <h2
            className="clickable-budget"
            style={{ cursor: "pointer" }}
            onClick={() => setIsEditing(true)}
          >
            ${newBudget.toFixed(2)}
          </h2>
        </section>

        <section className="spent-display">
          <h3>spent:</h3>
          <h2>${spent.toFixed(2)}</h2>
        </section>

        <section className="left-display">
          <h3>left:</h3>
          <h2 style={{ color: left < 0 ? "#a33939ff" : "#d0fbcfff" }}>
            ${left.toFixed(2)}
          </h2>
        </section>
      </section>

      <section className="break-line"></section>

      <section className="item-details">
        {["food","groceries","clothing","games","abby","other"].map(type => (
          <section key={type} className="item-details-display">
            <h1>{type}:</h1>
            <h2>${(totalsByType[type] || 0).toFixed(2)}</h2>
          </section>
        ))}
      </section>

      {isEditing && (
        <div className="popup-overlay">
          <div className="popup">
            <h3>edit budget</h3>
            <input
              className="input-button"
              type="number"
              value={newBudget}
              onChange={(e) => setNewBudget(Number(e.target.value))}
            />
            <section className="popup-buttons-container">
              <button
                className="popup-button"
                onClick={() => {
                  onUpdateBudget(newBudget);
                  setIsEditing(false);
                }}
              >
                enter
              </button>
              <button
                className="popup-button"
                onClick={() => setIsEditing(false)}
              >
                cancel
              </button>
            </section>
          </div>
        </div>
      )}
    </section>
  );
}
