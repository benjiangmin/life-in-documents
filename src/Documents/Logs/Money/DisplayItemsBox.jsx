import React, { useState } from "react";

export default function DisplayItemsBox({ items, onUpdateItem, onDeleteItem }) {
  const [editingId, setEditingId] = useState(null);
  const [tempItem, setTempItem] = useState(null);

  const getOrdinal = (n) => {
    const s = ["th", "st", "nd", "rd"];
    const v = n % 100;
    return n + (s[(v - 20) % 10] || s[v] || s[0]);
  };

  const handleSave = () => {
    if (editingId !== null && tempItem) {
      onUpdateItem(editingId, tempItem);
      setEditingId(null);
      setTempItem(null);
    }
  };

  return (
    <>
      <h1 className="items-text">items:</h1>
      <section className="display-items-box">
        <div className="item-buttons">
          {items
            .slice()
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .map((entry) => {
              if (!entry.id) return null; // skip items without id
              const day = entry.date ? new Date(entry.date + "T00:00").getDate() : 1;
              const dayWithSuffix = getOrdinal(day);

              return (
                <button
                  key={entry.id}
                  className="item-button"
                  onClick={() => {
                    setEditingId(entry.id);
                    setTempItem({
                      id: entry.id,
                      name: entry.name || "",
                      type: entry.type || "other",
                      price: Number(entry.price) || 0,
                      date: entry.date ? entry.date.slice(0, 10) : new Date().toISOString().slice(0, 10),
                    });
                  }}
                >
                  <span className="item-day">{dayWithSuffix}:</span>
                  <span className="item-name">{entry.name || ""}</span>
                  <span className="item-price">${Number(entry.price || 0).toFixed(2)}</span>
                </button>
              );
            })}
        </div>
      </section>

      {editingId !== null && tempItem && (
        <div className="popup-overlay overlay-for-box-4">
          <div className="change-item-popup">
            <h3>edit item</h3>

            <label className="item-labels">
              item name:
              <input
                className="change-item-input"
                type="text"
                value={tempItem.name}
                onChange={(e) => setTempItem({ ...tempItem, name: e.target.value })}
              />
            </label>

            <label className="item-labels">
              type:
              <select
                className="change-item-input type"
                value={tempItem.type}
                onChange={(e) => setTempItem({ ...tempItem, type: e.target.value })}
              >
                <option value="food">food</option>
                <option value="clothing">clothing</option>
                <option value="games">games</option>
                <option value="abby">abby</option>
                <option value="other">other</option>
                <option value="groceries">groceries</option>
              </select>
            </label>

            <label className="item-labels">
              price:
              <input
                className="change-item-input"
                type="number"
                step="0.01"
                value={tempItem.price || 0}
                onChange={(e) => setTempItem({ ...tempItem, price: parseFloat(e.target.value) || 0 })}
              />
            </label>

            <label className="item-labels">
              date:
              <input
                className="change-item-input date"
                type="date"
                value={tempItem.date || new Date().toISOString().slice(0, 10)}
                onChange={(e) => setTempItem({ ...tempItem, date: e.target.value })}
              />
            </label>

            <section className="change-item-buttons">
              <button
                onClick={() => {
                  onDeleteItem(editingId);
                  setEditingId(null);
                  setTempItem(null);
                }}
                style={{ marginLeft: "10px", backgroundColor: "#a33939", color: "white" }}
              >
                delete
              </button>
              <button onClick={handleSave}>save</button>
              <button
                onClick={() => {
                  setEditingId(null);
                  setTempItem(null);
                }}
              >
                cancel
              </button>
            </section>
          </div>
        </div>
      )}
    </>
  );
}
